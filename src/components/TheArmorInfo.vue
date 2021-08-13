<template>
  <div
    id="armor-info"
    ref="root"
    class="sticky-box"
    :data-folded="isFolded"
    :style="foldedRootStyles"
  >

    <template v-if="selected">
      <img
        :src="selected.sprite"
        draggable="true"
        width="144"
        height="144"
        aria-hidden="true"
        alt=""
      >

      <h2
        ref="header"
        key="h2-filled"
        :style="foldedHeaderStyles"
        :tabindex="isFolded ? 0 : -1"
        :role="isFolded ? 'button' : null"
        @click="unfold"
        @keydown.space.enter.prevent="unfold"
      >
        <span>{{ selected.name }}</span>
        <span class="fold-button">
          <fa-icon icon="chevron-circle-down" fixed-width />
        </span>
      </h2>

      <div id="stats">
        <div id="defense">
          <ShirtIcon />
          <span class="num" aria-label="current defense">
            {{ selected.defense }}
          </span>
          <span v-if="!isCompleted" aria-hidden="true">
            <fa-icon icon="caret-right" />
          </span>
          <span v-if="!isCompleted" class="num" aria-label="next defense">
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

      <template v-if="!isCompleted">
        <div class="upgrade-item">
          <img
            :src="selected.sprite"
            alt=""
            aria-hidden="true"
            width="144"
            height="144"
          >
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
      :style="foldedHeaderStyles"
      :tabindex="isFolded ? 0 : -1"
      :role="isFolded ? 'button' : null"
      @click="unfold"
      @keydown.space.enter.prevent="unfold"
    >
      <span>No armor selected.</span>
      <span class="fold-button">
        <fa-icon icon="chevron-circle-down" fixed-width />
      </span>
    </h2>

  </div>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, toRef, computed, watch, onUnmounted
} from 'vue';
import throttle from 'lodash/throttle';

import ShirtIcon from '@/assets/icons/shirt.svg';

import { ArmorLevel } from '@/types/armor';
import { itemSprites, itemNames } from '@/items';
import store from '@/store';
import sassVars from '@/assets/styles/_variables.scss';


export default defineComponent({
  name: 'TheArmorInfo',
  components: { ShirtIcon },
  setup() {
    return {
      selected: toRef(store.state, 'selected'),
      ...useArmor(), ...useFolding()
    };
  }
});


/**
 * Handles user interaction with the currently selected armor: updates the
 * item-list, levels up and down the armor, et cetera.
 */
function useArmor() {
  const setLevel = (i: ArmorLevel): void => store.setSelectedLevel(i);

  const increase = (): void => {
    if ((store.state.selected?.level ?? NaN) < 4)
      store.setSelectedLevel(store.state.selected!.level + 1 as ArmorLevel);
  }

  const decrease = (): void => {
    if ((store.state.selected?.level ?? NaN) > 0)
      store.setSelectedLevel(store.state.selected!.level - 1 as ArmorLevel);
  }

  const isCompleted = computed(() => (store.state.selected?.level ?? NaN) == 4);

  return { setLevel, increase, decrease, isCompleted, itemSprites, itemNames };
}


/**
 * Handles checking if the current window is in mobile or not
 */
function useMobile() {
  const query = window.matchMedia(`(max-width: ${sassVars.break_mobile})`);
  const isMobile = ref(query.matches);

  const onQueryChange = () => isMobile.value = query.matches;

  query.addEventListener('change', onQueryChange);
  onUnmounted(() => query.removeEventListener('change', onQueryChange));

  return { isMobile };
}


/**
 * Handles listening to changing styles when the user scrolls on mobile
 * @param {() => void} options.hitTop The function to run when the user scrolls
 * to the top of the page
 * @param {() => void} options.down The function to run when the user scrolls
 * down
 * @param {() => void} options.up The function to run when the user scrolls up
 * @param {Ref<boolean>[]} options.onlyWhen Do not trigger the scroll listeners
 * unless all of these conditions are met.
 */
function useScroll(options: {
  hitTop: () => void,
  down: () => void,
  up: () => void,
  onlyWhen?: Ref<boolean>[]
}) {
  /**
   * Wrapper for the various different properties to grab scroll-height from,
   * depending on browser/support.
   * @returns The current scroll-position of the document.
   */
  const getScroll = (): number => {
    return document.documentElement.scrollTop ||
      document.body.scrollTop ||
      window.scrollY;
  }

  const savedScrollPos = ref(getScroll());   // The last pos the user stopped

  const canDoScroll = (): boolean => {
    // If there are no options, they can always scroll.
    if (options.onlyWhen === undefined) return true;
    // Otherwise, check if all are true.
    else return options.onlyWhen.every(ref => ref.value);
  }

  const onScroll = throttle((): void => {
    const { body, documentElement } = document;

    const oldScrollPos = savedScrollPos.value;
    const newScrollPos = savedScrollPos.value = getScroll();

    // The Y position of the top of the screen when scrolled down all the way
    const lowestTop = body.scrollHeight - window.innerHeight;
    // :root's current font-size property at whatever the current breakpoint is
    const currentRem = parseFloat(getComputedStyle(documentElement).fontSize);

    if (!canDoScroll()) return;

    // If they scrolled down
    if (newScrollPos > 0 && newScrollPos > oldScrollPos) {
      // If the difference was a big enough scroll to warrant being called a
      // "down" scroll
      if (Math.abs(newScrollPos - oldScrollPos) > 5 * currentRem)
        options.down();
    }

    // If they scrolled to within the top 10.25 rem
    else if (newScrollPos <= 10.25 * currentRem) {
      options.hitTop();
    }

    // If they didn't scroll up (went down), but they *also* aren't below the
    // page (they can be below the page when mobile browsers do that bouncy
    // effect when you try and scroll off the bottom)
    else if (newScrollPos <= lowestTop) {
      // Check if the difference was big enough ( ↓ -- requires larger force
      // than going "down" did) to be called "up" ↓
      if (Math.abs(newScrollPos - oldScrollPos) > 6 * currentRem)
        options.up();
    }

  }, 100, {
    leading: true,
    trailing: true
  });

  window.addEventListener('scroll', onScroll);
  onUnmounted(() => window.removeEventListener('scroll', onScroll));
}


function useFolding() {

  const { isMobile } = useMobile();

  const isFolded = ref(false);

  // See @note below explaining why this is needed
  const chromiumFoldEnabled = ref(true);

  const root = ref<HTMLDivElement>();              // Root <div> of TheArmorInfo
  const header = ref<HTMLHeadingElement>();        // Either of the two headings

  const foldedRootStyles = ref<{ top?: string }>({ });
  const foldedHeaderStyles = ref<{ transform?: string }>({ });

  const unfold = () => {
    isFolded.value = false;
    foldedRootStyles.value = { };
    foldedHeaderStyles.value = { };
    header.value?.blur();
  }

  // Unfold and clear styles if they ever leave mobile view
  watch(isMobile, newValue => { if (!newValue) unfold(); });

  watch(toRef(store.state, 'selected'), (_, oldValue) => {
    if (isMobile.value) {
      unfold();

      if (oldValue === null) {

        /**
         * @note
         *
         * When selecting a new armor, the size of the root <div> changes.
         * Because it's up at the top, this means that the user's browser can
         * either let the document slide down in the viewport (the bigger header
         * shunts the rest down), or it can accommodate for this by
         * automatically scrolling the viewport down to keep the element the
         * user was looking at in place.
         *
         * The latter is what Chromium browsers do. However, since we're
         * listening to the 'scroll' event, and folding when the user scrolls
         * down far enough, this will trigger *another* fold, and subsequently
         * re-hide whatever the user just tried to show.
         *
         * @see {@link https://stackoverflow.com/a/63460737/10549827}
         *
         * We fix this by:
         * - unfolding as normal
         * - disable unfolding
         * - wait for Chromium to move the viewport
         * - re-enable unfolding
         *
         * Since Chrome 86, this requires waiting for two animation-frames. I'm
         * not sure why.
         */

        chromiumFoldEnabled.value = false;
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            chromiumFoldEnabled.value = true;
          });
        });
      }
    }
  });

  useScroll({
    onlyWhen: [ isMobile, chromiumFoldEnabled ],
    hitTop: unfold,
    up: unfold,
    down: () => {
      // Height of root <div#armor-info>
      const rHeight = (root.value?.getBoundingClientRect().height ?? 0);
      // Height of the header <h2>
      const hHeight = (header.value?.getBoundingClientRect().height ?? 0);

      // Offset of header <h2> down to the bottom of root <div#armor-info>
      // (the header's y position within the root, plus the header's own height)
      const hOffset = (header.value?.offsetTop ?? 0) + hHeight;

      isFolded.value = true;

      /**
       * @note
       *
       * 1. move off the top by the height of the entire root div
       * 2. move down by the height of the nav: the bottom edge is now even with
       *    nav
       * 3. move down by one more nav-height, now the exposed portion of the
       *    root div is the same size as the nav
       */

      foldedRootStyles.value = {
        top: `calc(-${rHeight}px + var(--nav-height) * 2)`
      };

      /**
       * @note
       *
       * 1. move the header down by the full height of the root
       *
       *        + rHeight
       *
       * 2. move the header back up by the size equal to (header height +
       *    distance from top of root). this puts the header sitting on the
       *    bottom edge of the root.
       *
       *        - hOffset
       *
       * 3. move the header back up to center between the nav and the bottom of
       *    the div:
       *
       *        - up by nav-height, now it's along the bottom edge of the nav
       *        + down by the height of the header; now, between the bottom edge
       *          of root and the bottom of header, there's what was previously
       *          the distance between the top of header and the bottom edge of
       *          nav
       *        finally, divide that whole calculation by two, since we want to
       *        *center* it.
       *
       * 4. final equation to move down by:
       *
       *        + (rHeight px - hOffset px)
       *        - (var(--nav-height) - hHeight px) / 2
       */

      const one = `${rHeight - hOffset}px`;
      const two = `(var(--nav-height) - ${hHeight}px)`;
      const all = `${one} - ${two} / 2`;

      foldedHeaderStyles.value = {
        // One final 0.1rem to account for border + text funkiness
        transform: `translateY(calc(${all} + 0.1rem))`
      };
    }
  });

  return {
    root, header, isFolded, foldedRootStyles, foldedHeaderStyles,
    unfold: () => { if (isFolded.value) unfold(); } // used for keypress/click
  };
}
</script>

<style scoped lang="scss">
@use 'sass:math';

$fold-transition: 500ms ease;

#armor-info {
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

  &:not([role="button"]) {
    :focus, :focus-within, :focus-visible {
      outline: none;
    }
  }

  &[role="button"] { cursor: pointer; }
}

.fold-button {
  color: currentColor;

  position: absolute; // relative to h2
  top: 0.45em;
  bottom: 0.50em;

  display: none; // overridden in mobile view

  svg {
    font-size: 1.25em;
    transform: rotate(180deg); // start upside-down
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

#stats {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  margin-top: 1.00rem;

  // Make the .stars and #defense go on top of one another when the screen is
  // too small to support them otherwise
  @media (max-width: $break-tiny + 15px) {
    flex-flow: column nowrap;
    align-items: flex-end;
  }
}

#defense {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  font-size: 0.85em;

  // All flex-items
  >* { margin: 0 0.3rem; }

  // Just the numbers
  span { font-size: 1.45em; }

  // Make the ShirtIcon and the caret same size
  svg { height: 1.45rem; }

  @media (max-width: $break-tiny + 15px) {
    margin-top: 0;
    margin-bottom: 0.90rem;
  }
}

.stars {
  >:first-child { margin-right: 0.65em; }
  >:last-child { margin-left: 0.65em; }

  .star {
    margin-top: 0.20em;
    margin-bottom: 0.20em;
  }

  // If they have a touch screen, double the margin around the stars and give
  // the '+/-' a bit more room
  @media (any-pointer: coarse) {
    .star { margin: 0.20em; } // extend L/R margins as well
    >:first-child { margin-right: 1.00em; }
    >:last-child { margin-left: 1.00em; }
  }

  @media (max-width: $break-small) {
    font-size: 1.10em;
  }
}

.upgrade-item {
  $height: 2.2rem;

  font-family: $head-font;
  font-size: 1.275em;
  font-weight: 700;

  min-height: $height;
  padding: 0 1em 0.15em 0.5em;

  // Second 'type' is the second 'div' is first 'div.upgrade-item'
  &:nth-of-type(2) { margin-top: 1.50rem; }
  margin-top: 1.15rem;

  background-color: $bg-color-accent;

  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  column-gap: 2rem;

  img {
    display: inline-block;
    margin-top: -0.35 * $height;
    height: $height * 1.35; // 135% height
    width: auto;
  }

  // The item name
  >span:first-of-type { margin: 0.45ch 0; }
  // The count
  >:last-child { justify-self: flex-end; }

  @media (max-width: $break-small) {
    column-gap: 1.35rem;
    span { font-size: 0.95em; }
  }
}


// *Between* large/medium-ish and mobile
@media
  (max-width: math.div($break-medium + $break-large, 2))
  and (min-width: $break-mobile + 1)
{
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
  // Where all the styles for folding go
  #armor-info {
    transition: top $fold-transition;

    >:not(h2) {
      transition:
        opacity $fold-transition,
        visibility $fold-transition;

      // By default, show everything
      opacity: 1;
      visibility: visible;
    }

    // When folded
    &[data-folded="true"]>:not(h2) {
      opacity: 0;
      visibility: hidden;
    }
  }

  h2 {
    box-sizing: content-box;

    transition:
      transform $fold-transition,
      padding-left $fold-transition,
      border-color $fold-transition;

    &.empty {
      text-align: left;
      padding-left: 1em;
      transition:
        transform $fold-transition,
        padding-left $fold-transition;
    }

    // Shown properties
    @at-root [data-folded="true"] & {
      border-color: transparent;
      padding-left: 1em;
    }
  }

  h2 span {
    display: inline-block;
    box-sizing: content-box;
    transition: max-width $fold-transition;
    @include dot-dot-dot;

    // By default, it can use the full width
    max-width: 100%;

    // Shown properties
    @at-root [data-folded="true"] & {
      max-width: calc(100% - #{1.25em * 1.25} - 2ch);
    }
  }

  .fold-button {
    display: block;

    transition:
      right $fold-transition,
      opacity $fold-transition,
      visibility $fold-transition;

    // By default, hide it and keep on the far right
    right: 0;
    opacity: 0;
    visibility: hidden;

    // Shown properties
    @at-root [data-folded="true"] & {
      right: 1em;
      opacity: 1;
      visibility: visible;
    }

    svg {
      transition: transform $fold-transition;

      // Shown properties
      @at-root [data-folded="true"] & {
        transform: rotate(0deg);
      }
    }
  }
}

// Make the defense and stars stack when smaller
@media (max-width: $break-tiny + 30px) {
  #stats {
    flex-flow: column nowrap;
    align-items: flex-end;
  }

  #defense {
    margin-top: 0;
    margin-bottom: 0.90rem;
  }
}

// Shrinking font-sizes at tiniest of sizes
@media (max-width: $break-tiny) {
  #stats { font-size: 1.10em; }
  // .upgrade-item span { font-size: 0.8em; }
}
</style>