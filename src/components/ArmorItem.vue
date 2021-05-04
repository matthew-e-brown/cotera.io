<template>
  <li :aria-label="armor.name" :class="{ selected }">
    <button type="button" @click="select" ref="button">
      <div class="stars">
        <span v-for="i in 4" :class="{ filled: i <= armor.level }" :key="i">
          <fa-icon icon="star" />
        </span>
      </div>
      <img :src="armor.sprite" draggable="false" aria-hidden="true" alt="">
      <span class="num" aria-label="defense">{{ armor.defense }}</span>
    </button>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Armor } from '@/armor';
import { localState } from '@/state';


export default defineComponent({
  name: 'ArmorItem',
  props: {
    armor: { type: Armor, required: true }
  },
  methods: {
    select(): void {
      localState.selected = this.armor;
    }
  },
  computed: {
    selected(): boolean {
      return localState.selected == this.armor;
    }
  }
});
</script>

<style scoped lang="scss">
li {
  display: block;
  list-style: none;
  margin: 0.85rem;

  @media (max-width: $break-large) {
    margin: 0.55rem 0.30rem;
  }

  @media (max-width: $break-mobile) {
    margin: 0.5rem;
  }
}

button {
  display: block;
  position: relative;

  cursor: pointer;
  background-color: $bg-color-transparent;
  border: 0.25em double $border-color;
  border-radius: 0.3em;

  margin: 0;
  padding: 0.25em;

  @at-root .selected & {
    border-color: adjust-color($border-color, $alpha: 0.15);

    // Blue background:
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0.125em; right: 0.125em; bottom: 0.125em; left: 0.125em;
      z-index: 0;

      opacity: 0.80;
      border-radius: 0.15em;

      box-shadow: inset 0 0 1em -0.15em rgba(255, 255, 255, 0.85);
      background:
        radial-gradient(rgb(3, 145, 255), rgba(255, 255, 255, 0.80) 250%);
    }
  }
}

.stars {
  flex-flow: column-reverse;

  position: absolute;
  bottom: 0.2em; left: 0.2em;
  z-index: 2;

  span {
    font-size: 0.6em;
  }
}

.num {
  font-size: 1.25em;
  position: absolute;
  bottom: -0.4em; right: -0.4em;
  z-index: 2;
}

img {
  display: block;
  position: relative;
  z-index: 1;

  min-height: 82px;
  min-width: 82px;
  height: calc(2em + 5vw);

  @media (max-width: $break-mobile) {
    height: calc(2em + 3vh + 4vw);
  }
}
</style>