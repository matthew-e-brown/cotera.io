<template>
  <div
    id="armor-info"
    ref="main"
    class="sticky-box"
  >

    <template v-if="selected">
      <img :src="selected.sprite" alt="" aria-hidden="true" draggable="true">

      <h2 ref="header" key="h2-filled">
        <span>{{ selected.name }}</span>
      </h2>

      <div id="stats">
        <div id="defense">
          <ShirtIcon />
          <span class="num" aria-label="current defense">
            {{ selected.defense }}
          </span>
          <span v-if="!completed" aria-hidden="true">
            <fa-icon icon="caret-right" />
          </span>
          <span v-if="!completed" class="num" aria-label="next defense">
            {{ selected.nextDefense }}
          </span>
        </div>

        <div class="stars">
          <button
            type="button"
            aria-label="decrease level"
            class="plus-minus"
            :disabled="!(selected.level > 0)"
            @click="decrease"
          ><fa-icon icon="minus" /></button>
          <button
            v-for="i in 4"
            :key="i"
            :class="{ filled: i <= selected.level }"
            class="star"
            :aria-label="`set level to ${i}`"
            @click="setLevel(i)"
          ><fa-icon icon="star" /></button>
          <button
            type="button"
            aria-label="increase level"
            class="plus-minus"
            :disabled="!(selected.level < 4)"
            @click="increase"
          ><fa-icon icon="plus" /></button>
        </div>
      </div>

      <template v-if="!completed">
        <div class="upgrade-item">
          <img :src="selected.sprite" alt="" aria-hidden="true">
          <span>{{ selected.name }}</span>
          <span>1</span>
        </div>

        <div
          class="upgrade-item"
          v-for="[ tag, quantity ] in selected.itemsToUpgrade"
          :key="tag"
        >
          <img
            :src="itemSprites.get(tag)"
            alt=""
            aria-hidden="true"
            width="144"
            height="144"
          />
          <span>{{ itemNames.get(tag) }}</span>
          <span>{{ quantity }}</span>
        </div>
      </template>

      <p v-else>This armor is fully upgraded!</p>

    </template>

    <h2
      v-else
      class="empty"
      ref="header"
      key="h2-empty"
    >
      <span>No armor selected.</span>
    </h2>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue';
import throttle from 'lodash.throttle';

import ShirtIcon from '@/assets/icons/shirt.svg';

import { Armor, ArmorLevel } from '@/armor';
import { itemSprites, itemNames } from '@/items';
import { allState as state, setArmorLevel } from '@/state';


const selected = toRef(state, 'selected');

export default defineComponent({
  name: 'TheArmorInfo',
  components: { ShirtIcon },
  setup() {
    return { ...useArmor(), selected };
  }
});


/**
 * Handles user interaction with the currently selected armor: updates the
 * item-list, levels up and down the armor, et cetera.
 */
function useArmor() {

  const setLevel = (level: ArmorLevel): void => {
    setArmorLevel(selected.value as Armor, level);
  }

  const increase = (): void => {
    if (selected.value && selected.value.level < 4)
      setLevel((selected.value.level + 1) as ArmorLevel);
  }

  const decrease = (): void => {
    if (selected.value && selected.value.level > 0)
      setLevel((selected.value.level - 1) as ArmorLevel);
  }

  const completed = computed(() => (selected.value?.level ?? NaN) == 4);

  return { increase, decrease, setLevel, completed, itemSprites, itemNames };
}


/**
 * Handles listening to changing styles when the user scrolls on mobile
 */
function useScroll() {

}
</script>

<style scoped lang="scss">
$fold-transition: 500ms ease;

#armor-info {
  --fold-nav-offset: #{$nav-height + 0.05rem};

  z-index: 4;
  >img, >div { margin-bottom: 0; }
}

h2 {
  margin-top: 0;
  margin-bottom: 0;
  padding: 0.45em 0 0.50em 0.35em;
  border-bottom: 0.1rem solid $border-color;
  position: relative;

  &.empty {
    border: none;
    color: $fg-color-dim;
    text-align: center;

    margin-top: 5rem;
    margin-bottom: 4.5rem;
  }
}

// The only paragraph on the page is 'armor is fully upgraded' paragraph
p {
  text-align: center;
  font-family: $head-font;
  font-size: 1.2em;
  font-weight: 700;

  margin-top: 1.8em;
  margin-bottom: 1.75em;
}

#stats, .upgrade-item {
  margin-top: 0.85rem;
}

#stats {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  @media (max-width: $break-small) {
    font-size: 1.20em;
  }
}

#defense {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  font-size: 0.85em;

  // All flex-items
  >* {
    margin: 0 0.3rem;
  }

  // Just the numbers
  span {
    font-size: 1.45em;
  }

  // ShirtIcon and caret same size
  svg {
    height: 1.45rem;
  }
}

.stars {
  >:first-child { margin-right: 1em; }
  >:last-child { margin-left: 1em; }

  // If they have a touch screen, double the margin around the stars, but move
  // the +/- a bit closer to compensate for the width
  @media (any-pointer: coarse) {
    .star { margin: 0.2em; }
    >:first-child { margin-right: 0.8em; }
    >:last-child { margin-left: 0.8em; }
  }
}

.upgrade-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;

  font-family: $head-font;
  font-size: 1.275em;
  font-weight: 700;

  height: 2.2rem;
  padding: 0 1em 0.15em 0.5em;

  background-color: $bg-color-accent;

  >* {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  // Second 'type' -> second 'div' -> first '.upgrade-item'
  &:nth-of-type(2) { margin-top: 1.5rem; }

  >:first-child { margin-left: 0; }
  >:last-child {
    margin-left: auto;
    margin-right: 0;
  }

  img {
    display: inline-block;
    align-self: flex-end;
    height: 135%;
    width: auto;
  }
}


// *Between* medium and mobile
@media (max-width: $break-medium) and (min-width: $break-mobile + 1) {
  #armor-info {
    // Above $break-medium, uses global .sticky-box size of calc(18rem + 12vw).
    // Under $break-mobile, again uses global .sticky-box styles for being stuck
    // to the top, right under the navbar.
    min-width: calc(13.8rem + 12vw);
    margin: 1.5rem 1.5rem 0;
    font-size: 0.85em;
  }

  .upgrade-item {
    font-size: 1.1em;

    >* {
      margin-left: 0.55rem;
      margin-right: 0.55rem;
    }
  }
}


// Mobile and below
@media (max-width: $break-mobile) {
  /* nothing yet */
}


// Smaller mobile sizes
@media (max-width: $break-small) {
  #stats {
    font-size: 1.20em;
  }
}

@media (max-width: $break-tiny) {
  #defense {
    font-size: 0.75em;
  }

  .upgrade-item {
    span:first-of-type { font-size: 0.8em; }

    >* {
      margin-left: 0.65rem;
      margin-right: 0.65rem;
    }
  }
}

@media (max-width: $break-tiny - 30px) {
  #stats {
    flex-flow: column nowrap;
    align-items: flex-end;
  }

  #defense {
    margin-top: 0;
    margin-bottom: 1em;
  }
}
</style>