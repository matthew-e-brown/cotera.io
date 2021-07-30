<template>
  <main id="home">

    <TheArmorInfo />

    <div id="list-container" ref="popperBounds">

      <div id="list-settings">
        <ListPicker :overflow-bounds="popperBounds" />

        <button
          id="sort-button"
          type="button"
          class="option-button"
          @click="toggleSortState"
          :aria-label="`Switch to sorting by ${ariaSortLabel}`"
        >
          <fa-icon icon="sort-alt" />
          <span>{{ sortLabel }}</span>
        </button>

        <button
          id="amiibo-button"
          type="button"
          class="option-button"
          @click="toggleAmiibo"
          :aria-label="`Switch to ${ showAmiibo ? 'hiding' : 'showing' } Amiibo armor`"
        >
          <span><AmiiboIcon class="amiibo" aria-label="amiibo" /></span>
          <fa-icon class="fa-fw" :icon="showAmiibo ? 'eye' : 'eye-slash'" />
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

      <section v-show="showAmiibo">
        <h3 class="line">
          <AmiiboIcon class="amiibo" aria-label="amiibo" />
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
import { defineComponent, computed, toRefs, ref } from 'vue';

import TheArmorInfo from '@/components/TheArmorInfo.vue';
import ListPicker from '@/components/ListPicker.vue';
import ArmorItem from '@/components/ArmorItem.vue';

import ShirtIcon from '@/assets/icons/shirt.svg';
import AmiiboIcon from '@/assets/icons/amiibo.svg';

import store, { toggleSort } from '@/store';
import armor, { amiiboList as amiibo } from '@/armor';


export default defineComponent({
  name: 'Home',
  components: { TheArmorInfo, ListPicker, ArmorItem, ShirtIcon, AmiiboIcon },
  setup() {
    const { sortOrder, showAmiibo } = toRefs(store.state.settings);
    const popperBounds = ref<HTMLDivElement>();

    const capitalize = (str: string): string => {
      return `${str[0].toUpperCase()}${str.slice(1)}`;
    }

    const toggleSortState = () => {
      store.setSetting('sortOrder', toggleSort(sortOrder.value));
    }

    const toggleAmiibo = () => {
      store.setSetting('showAmiibo', !showAmiibo.value);
    }

    const sortLabel = computed(() => capitalize(sortOrder.value));
    const ariaSortLabel = computed(() => toggleSort(sortOrder.value));

    return {
      armor, amiibo,
      toggleSortState, toggleAmiibo, sortLabel, ariaSortLabel, showAmiibo,
      popperBounds
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

h3 {
  margin-top: 1.85em;
  margin-bottom: 1em;
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
  display: grid;
  place-items: flex-end;

  // default layout
  grid-template-columns: min-content 1fr min-content min-content;
  grid-template-areas: 'a . b c';
  gap: 0.85rem;

  >:nth-child(1) { grid-area: a; }
  >:nth-child(2) { grid-area: b; }
  >:nth-child(3) { grid-area: c; }

  margin-bottom: 0;

  // Explicitly set the width so it doesn't shift around when toggling
  #sort-button span { width: 4.25ch; }
  #amiibo-button span svg { margin-top: -0.25em; }

  @media (max-width: $break-small) {
    font-size: 1.1em;
  }

  @media (max-width: $break-large + 200) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr min-content min-content;
    grid-template-areas: 'a a a' '. b c';
  }
}

.armor-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
}

h3 svg {
  height: 1em;
  margin-right: 0.5em;
  align-self: center;
  &.amiibo { align-self: flex-end; }
}

svg.amiibo {
  height: 1.275em;
  margin-bottom: -0.15em;

  // Less margin in the header
  @at-root h3 & { margin-right: 0.30em; }
}
</style>