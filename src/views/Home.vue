<template>
  <main id="home">
    <ArmorInfo class="sticky-box" :armor="state.selected" />
    <div id="list-container">
      <div id="list-settings">
        <button
          @click="toggleSort"
        >Sort by {{ state.sortOrder == 'set' ? 'type' : 'set' }}</button>
        <button
          @click="toggleAmiibo"
          :aria-label="`${state.showAmiibo ? 'Hide' : 'Show'} Amiibo armor`"
        >
          <Amiibo class="amiibo" aria-hidden="true" />
          <fa-icon
            class="fa-fw"
            :icon="state.showAmiibo ? 'eye' : 'eye-slash'"
          />
        </button>
      </div>
      <section>
        <h3 class="line">
          <Shirt />
          <span>Armor</span>
        </h3>
        <ul class="armor-list">
          <ArmorItem v-for="piece in armor" :key="piece.tag" :armor="piece" />
        </ul>
      </section>
      <section v-if="state.showAmiibo">
        <h3 class="line">
          <Amiibo class="amiibo" aria-label="amiibo" />
          <span>Armor</span>
        </h3>
        <ul class="armor-list">
          <ArmorItem v-for="piece in amiibo" :key="piece.tag" :armor="piece" />
        </ul>
      </section>
    </div>
  </main>
</template>

<script>
import ArmorItem from '@/components/ArmorItem.vue';
import ArmorInfo from '@/components/ArmorInfo.vue';
import Amiibo from '@/assets/icons/amiibo.svg';
import Shirt from '@/assets/icons/shirt.svg';

import state from '@/store';
import armor, { amiibo } from '@/armor';
import sets from '@/assets/data/sets.json';
import amiiboSets from '@/assets/data/amiibo-sets.json';

export default {
  name: 'Home',
  components: { ArmorItem, ArmorInfo, Shirt, Amiibo },
  data: function() {
    return { state, armor, amiibo }
  },
  methods: {
    toggleSort: function() {
      this.$set(
        this.state,
        'sortOrder',
        this.state.sortOrder == 'set' ? 'type' : 'set'
      );
    },
    toggleAmiibo: function() {
      this.$set(this.state, 'showAmiibo', !this.state.showAmiibo);
    },
    sortArmor: function(list, set, value) {
      const order = set.reduce((acc, cur) => [...acc, ...cur.pieces], []);

      if (value == 'type') {
        // Sort the sort-order, to make it head-head-body-body-legs-legs instead
        // of head-body-leg-head-body-leg
        order.sort((...args) => {
          const [ a, b ] = args.map(x => x.substr(0, x.lastIndexOf('_')));
          if (a == b) return 0; // items of same time stay next to one another
          else {
            const o = [ 'head', 'body', 'legs' ];
            return o.indexOf(a) - o.indexOf(b);
          }
        });
      }

      list.sort((a, b) => {
        // Put Champion's Tunic first and jewelry/divine headgear last
        if (a.tag == 'body_13') return -1;
        else if (b.tag == 'body_13') return 1;
        else if (/head_(?:1[345678]|2[56789])/.test(a.tag)) {
          // Don't sort jewelry/divine headgear relative to one another
          if (/head_(?:1[345678]|2[56789])/.test(b.tag)) return 0;
          return 1;
        } else return order.indexOf(a.tag) - order.indexOf(b.tag);
      });
    }
  },
  watch: {
    'state.sortOrder': function(value) {
      this.sortArmor(this.armor, sets, value);
      // Can re-use same sorter for the amiibo armor since the extra "override"
      // checks are specific to certain IDs
      this.sortArmor(this.amiibo, amiiboSets, value);
    }
  },
  mounted: function() {
    this.sortArmor(this.armor, sets, this.state.sortOrder);
    this.sortArmor(this.amiibo, amiiboSets, this.state.sortOrder);
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: flex-start;
}

#home>* {
  flex: 1 1 auto;
}

section {
  margin-bottom: 2rem;
}

#list-container {
  padding: 3rem 2rem 0;
}

#list-container>:first-child {
  margin-top: 0;
}

#list-settings {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}

.armor-list {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 0;
}

button {
  color: var(--text-color);
  background-color: var(--block-color);
  padding: 0.60em 1em;
  border-radius: 0.4em;
  margin-left: 1em;
  border: 0.1em solid var(--block-border);
  display: flex;
  align-items: center;
}

button svg {
  display: inline-block;
}

button svg:last-child {
  font-size: 1.25em;
  margin-left: 0.5em;
}

h3 svg {
  height: 1em;
  margin-right: 0.5em;
  align-self: center;
}

svg.amiibo {
  height: 1.275em;
  align-self: flex-end;
}

h3 svg.amiibo {
  margin-right: 0.30em;
}

@media (max-width: 770px) {
  #home {
    flex-flow: row wrap;
  }

  #list-container {
    padding-top: 1.5rem;
  }
}
</style>