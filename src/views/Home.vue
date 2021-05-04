<template>
  <main id="home">

    <TheArmorInfo />

    <div id="list-container">

      <div id="list-settings">
        <button @click="toggleSort" :aria-label="`Order by ${nextSortChoice}`">
          <fa-icon icon="sort-alt" />
          <span>{{ capitalize(nextSortChoice) }}</span>
        </button>
        <button
          @click="toggleAmiibo"
          :aria-label="`${ state.preferences.showAmiibo ? 'Hide' : 'Show' } Amiibo armor`"
        >
          <AmiiboIcon class="amiibo" aria-label="amiibo" />
          <fa-icon
            class="fa-fw"
            :icon="state.preferences.showAmiibo ? 'eye' : 'eye-slash'"
            :key="state.preferences.showAmiibo ? 'eye' : 'eye-slash'"
          />
        </button>
      </div>

      <section>
        <h3 class="line">
          <ShirtIcon />
          <span>Armor</span>
        </h3>
        <ul class="armor-list">
          <ArmorItem v-for="piece in armor" :key="piece.tag" :armor="piece" />
        </ul>
      </section>

      <section v-if="state.preferences.showAmiibo">
        <h3 class="line">
          <AmiiboIcon />
          <span>Armor</span>
        </h3>
        <ul class="armor-list">
          <ArmorItem v-for="piece in amiibo" :key="piece.tag" :armor="piece" />
        </ul>
      </section>
      
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TheArmorInfo from '@/components/TheArmorInfo.vue';
import ArmorItem from '@/components/ArmorItem.vue';

import ShirtIcon from '@/assets/icons/shirt.svg';
import AmiiboIcon from '@/assets/icons/amiibo.svg';

import armor, { amiiboList as amiibo } from '@/armor';
import { allState, SortChoice, nextSortChoice, setPreference } from '@/state';

/**
 * @NOTE:  
 * https://github.com/FortAwesome/vue-fontawesome/issues/230  
 * Currently (2021-05-03), in Vue 3, using reactive :icon on FontAwesome icons
 * requires a :key.
 */

export default defineComponent({
  name: 'Home',
  components: { TheArmorInfo, ArmorItem, ShirtIcon, AmiiboIcon },
  data() {
    return {
      armor, amiibo,
      state: allState
    }
  },
  methods: {
    capitalize(str: string): string {
      return `${str[0].toUpperCase()}${str.slice(1)}`;
    },
    toggleSort(): void {
      setPreference('sortOrder', this.nextSortChoice);
    },
    toggleAmiibo(): void {
      setPreference('showAmiibo', !this.state.preferences.showAmiibo);
    }
  },
  computed: {
    /**
     * Wrapper for the state's nextSortChoice enum iterator, just to keep lines
     * short.
     */
    nextSortChoice(): SortChoice {
      return nextSortChoice(this.state.preferences.sortOrder);
    }
  },
});
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: flex-start;

  >* {
    flex: 1 1 auto;
  }

  @media (max-width: $break-mobile) {
    flex-flow: row wrap;
  }
}

section {
  margin-bottom: 2rem;
  &:last-child { margin-bottom: 0; }
}

#list-container {
  padding: 3rem 2rem 0;

  >:first-child {
    margin-top: 0;
  }
}

#list-settings {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}

.armor-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
}

// The only buttons directly in this component are the list-setting ones
button {
  color: $fg-color;
  background-color: $bg-color;

  padding: 0.60em 1em;
  margin-left: 1em;
  min-width: 06.25rem;
  height: 2.80em;

  border-radius: 0.4em;
  border: 0.15em solid $border-color;

  display: flex;
  place-items: center;

  svg:first-child { margin-right: 0.80rem; }
  svg:last-child { font-size: 1.25em; }

  span {
    margin-bottom: -0.15em;
    text-align: center;
    width: 4.25ch;
  }
}

h3 {
  svg {
    height: 1em;
    margin-right: 0.5em;
    align-self: center;
  }

  svg.amiibo {
    height: 1.275em;
    align-self: flex-end;
  }
}

svg.amiibo {
  height: 1.275em;
  align-self: flex-end;

  // Less margin in the header
  @at-root h3 & { margin-right: 0.30em; }
}
</style>