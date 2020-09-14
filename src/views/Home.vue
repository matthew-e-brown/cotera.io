<template>
  <main id="home">
    <div id="main-container">
      <ArmorInfo class="sticky-box" :armor="state.selected" />
      <div id="list-container">
        <section>
          <h3 class="line">
            <Shirt />
            <span>Armor</span>
          </h3>
          <ul class="armor-list">
            <ArmorItem v-for="piece in armor" :key="piece.tag" :armor="piece" />
          </ul>
        </section>
        <section>
          <h3 class="line">
            <Amiibo id="amiibo" aria-label="amiibo" />
            <span>Armor</span>
          </h3>
          <ul class="armor-list">
            <ArmorItem v-for="piece in amiibo" :key="piece.tag" :armor="piece" />
          </ul>
        </section>
      </div>
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

      console.log(order);
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
    this.sortArmor(this.armor, sets, state.sortOrder);
    this.sortArmor(this.amiibo, amiiboSets, state.sortOrder);
  }
}
</script>

<style scoped>
#main-container {
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: flex-start;
}

#main-container>* {
  flex: 1 1 auto;
}

section {
  margin: 2rem 1rem;
}

.armor-list {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 0;
}

h3 {
  margin: 0 1rem;
}

h3 svg {
  height: 1em;
  margin-right: 0.5em;
  align-self: center;
}

#amiibo {
  height: 1.275em;
  margin-right: 0.30em;
  align-self: flex-end;
}

@media (max-width: 770px) {
  #main-container {
    flex-flow: row wrap;
  }
}
</style>