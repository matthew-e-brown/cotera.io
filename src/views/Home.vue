<template>
  <main id="home">

    <TheArmorInfo />

    <div id="list-container">

      <div id="list-settings">
        <button
          type="button"
          class="option-button"
          @click="toggleSort"
          :aria-label="`Switch to sorting by ${ariaSortLabel}`"
        >
          <fa-icon icon="sort-alt" />
          <span>{{ capitalize(sortLabel) }}</span>
        </button>
        <button
          type="button"
          class="option-button"
          @click="toggleAmiibo"
          :aria-label="`Switch to ${ showAmiibo ? 'hiding' : 'showing' } Amiibo armor`"
        >
          <AmiiboIcon class="amiibo" aria-label="amiibo" />
          <fa-icon
            class="fa-fw"
            :icon="showAmiibo ? 'eye' : 'eye-slash'"
            :key="showAmiibo ? 'eye' : 'eye-slash'"
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

      <section v-if="showAmiibo">
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
import { computed, defineComponent, toRef } from 'vue';

import TheArmorInfo from '@/components/TheArmorInfo.vue';
import ArmorItem from '@/components/ArmorItem.vue';

import ShirtIcon from '@/assets/icons/shirt.svg';
import AmiiboIcon from '@/assets/icons/amiibo.svg';

import armor, { amiiboList as amiibo } from '@/armor';
import store, { iterChoice } from '@/store';

/**
 * @note
 *
 * Currently (2021-05-03), in Vue 3, using reactive :icon on FontAwesome icons
 * requires a :key. There is a PR to fix it, but it doesn't look like it'll be
 * merged anytime soon; it's been sitting there since September.
 *
 * @see {@link https://github.com/FortAwesome/vue-fontawesome/issues/250}
 * @see {@link https://github.com/FortAwesome/vue-fontawesome/pull/297}
 */

export default defineComponent({
  name: 'Home',
  components: { TheArmorInfo, ArmorItem, ShirtIcon, AmiiboIcon },
  setup() {
    const capitalize = (str: string): string => {
      return `${str[0].toUpperCase()}${str.slice(1)}`;
    }

    const toggleSort = () => {
      store.setSortOrder(iterChoice(store.state.prefs.sortOrder));
    }

    const toggleAmiibo = () => {
      store.setShowAmiibo(!store.state.prefs.showAmiibo);
    }

    const sortLabel = toRef(store.state.prefs, 'sortOrder');
    const ariaSortLabel = computed(() => iterChoice(sortLabel.value));
    const showAmiibo = computed(() => store.state.prefs.showAmiibo);
    const sortOrder = computed(() => store.state.prefs.sortOrder);

    return {
      armor, amiibo,
      showAmiibo, sortOrder, sortLabel,
      capitalize, toggleSort, ariaSortLabel, toggleAmiibo
    };
  }
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

  @media (max-width: $break-mobile) {
    padding-top: 1.5rem;
  }
}

#list-settings {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;

  @media (max-width: $break-small) {
    font-size: 1.1em;
  }
}

.armor-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.option-button {
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