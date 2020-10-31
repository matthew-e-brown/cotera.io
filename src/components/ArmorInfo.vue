<template>
  <div id="armor-info" ref="main" :data-folded="folded" :style="foldedTop">
    <template v-if="armor">
      <img :src="armor.sprite" alt="" aria-hidden="true" draggable="true">
      <h2
        :style="foldedTransform"
        ref="heading"
        key="h2-filled"
        :tabindex="isMobile && folded ? 0 : -1"
        :role="isMobile && folded ? 'button' : undefined"
        @click="fold"
        @keydown.space.enter.prevent="fold"
      >
        <span>{{ armor.name }}</span>
        <div id="fold-button">
          <fa-icon icon="chevron-circle-down" class="fa-fw" />
        </div>
      </h2>
      <div id="stats">
        <div id="defense">
          <Shirt />
          <span class="num" aria-label="current defense">
            {{ armor.defense }}
          </span>
          <span v-if="!completed" aria-hidden="true">
            <fa-icon icon="caret-right" />
          </span>
          <span v-if="!completed" class="num" aria-label="next defense">
            {{ armor.nextDefense }}
          </span>
        </div>
        <div
          class="stars"
          :aria-label="`${armor.level} ${armor.level == 1 ? 'star' : 'stars'}`"
        >
          <button
            type="button"
            aria-label="decrease level"
            class="plus-minus"
            :disabled="!(armor.level > 0)"
            @click="decrease"
          ><fa-icon icon="minus" /></button>
          <button
            v-for="i in 4"
            :key="i"
            :class="{ filled: i <= armor.level }"
            class="star"
            @click="setLevel(i)"
            aria-hidden="true"
          ><fa-icon icon="star" /></button>
          <button
            type="button"
            aria-label="increase level"
            class="plus-minus"
            :disabled="!(armor.level < 4)"
            @click="increase"
          ><fa-icon icon="plus" /></button>
        </div>
      </div>
      <template v-if="!completed">
        <div class="upgrade-item">
          <img :src="armor.sprite" alt="" aria-hidden="true">
          <span>{{ armor.name }}</span>
          <span>1</span>
        </div>
        <div
          v-for="[ item, count ] in armor.nextItems"
          class="upgrade-item"
          :key="item"
        >
          <img
            :src="itemSprite(item)"
            aria-hidden="true"
            width="144"
            height="144"
            alt=""
          >
          <span>{{ itemName(item) }}</span>
          <span>{{ count }}</span>
        </div>
      </template>
      <p v-else id="complete">
        This armor is fully upgraded!
      </p>
    </template>
    <h2
      v-else
      id="empty"
      ref="heading"
      key="h2-empty"
      :style="foldedTransform"
      :tabindex="isMobile && folded ? 0 : -1"
      :role="isMobile && folded ? 'button' : ''"
      @click="fold"
      @keydown.space.enter.prevent="fold"
    >
      <span>No armor selected.</span>
      <div id="fold-button">
        <fa-icon icon="chevron-circle-down" class="fa-fw" />
      </div>
    </h2>
  </div>
</template>

<script>
import Shirt from '@/assets/icons/shirt.svg';
import state, { userProgress, setArmorLevel } from '@/store';
import items from '@/assets/data/items.json';
import throttle from 'lodash.throttle';

export default {
  name: 'ArmorInfo',
  data: function() {
    return {
      state,
      folded: false,
      isMobile: false,
      query: window.matchMedia('(max-width: 770px)'),
      // Keep track of current scroll to tell if they're going up or down
      oldScrollPos:
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.scrollY,
      foldedTop: {},
      foldedTransform: {}
    }
  },
  props: {
    armor: { type: Object, required: false },
  },
  components: { Shirt },
  methods: {
    setLevel: function(level) {
      setArmorLevel(this.armor, level);
    },
    increase: function() {
      if (this.armor.level < 4) setArmorLevel(this.armor, this.armor.level + 1);
    },
    decrease: function() {
      if (this.armor.level > 0) setArmorLevel(this.armor, this.armor.level - 1);
    },
    itemName: function(item) {
      return items.find(i => i.tag == item).name;
    },
    itemSprite: function(item) {
      return `/images/items/${item}.png`;
    },
    fold: function() {
      if (this.isMobile) this.folded = false;
    },
    handleScrollHelper: function() {
      if (this.isMobile) this.handleScroll();
    },
    handleScroll: throttle(function() {
      const oldScrollPos = this.oldScrollPos;
      const newScrollPos = this.oldScrollPos =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.scrollY;
      const lowestTop = document.body.scrollHeight - window.innerHeight;
      const currentRem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      if (newScrollPos > 0 && newScrollPos > oldScrollPos) {
        // Check if the distance moved was big enough to warrant a change
        if (!(Math.abs(newScrollPos - oldScrollPos) > 5 * currentRem)) return;
        this.folded = true;
      } else if (newScrollPos <= 10.25 * currentRem) {
        // Unfold when at the very top, no speed-checking necessary
        this.folded = false;
      } else if (newScrollPos <= lowestTop) {
        // Need more oomph on page-move to warrant re-opening than closing
        if (!(Math.abs(newScrollPos - oldScrollPos) > 6 * currentRem)) return;
        this.folded = false;
      }
    }, 100, { leading: true, trailing: true }),
    computeFoldedStyles: function() {
      const foldedTop = () => {
        if (!this.folded || !this.isMobile) return {};
        else {
          const h = this.$refs.main.getBoundingClientRect().height;
          return { top: `calc(-${h}px + 5.3rem + var(--fold-nav-offset))` };
        }
      }

      const foldedTransform = () => {
        if (!this.folded || !this.isMobile) return {};
        else {
          // Find how far down we have to move the current "keep text" (the text
          // that shows while folded -- it has to animate back and forth)

          // How far from the TOP of #armor-info is the BOTTOM of $refs.heading
          const offsetBottom =
            this.$refs.heading.offsetTop +
            this.$refs.heading.getBoundingClientRect().height;
          const parentHeight =
            this.$refs.main.getBoundingClientRect().height;
          const distance = parentHeight - offsetBottom;

          return { transform: `translateY(calc(${distance}px - 1rem))` };
        }
      }

      this.foldedTop = foldedTop();
      this.foldedTransform = foldedTransform();
    }
  },
  computed: {
    completed: function() {
      return this.armor.level == 4;
    }
  },
  watch: {
    folded: function() {
      this.computeFoldedStyles();
    },
    'state.selected': function(newVal, oldVal) {
      if (this.isMobile) {
        this.folded = false;

        // Fix for chrome bug -- changing the size of #armor-info to be larger
        // triggers a scroll event (since it auto-scrolls to make up for the
        // page reflowing when the sticky up top shunts the page down)
        // -- Apparently as of Chrome 86 it needs to be offset by TWO animation
        // -- frames. FFS.
        if (oldVal == undefined) {
          // Re-un-fold the thing on the very next (next) frame
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => this.folded = false);
          });
        }
      }
    }
  },
  created: function() {
    this.isMobile = this.query.matches;
    this.query.onchange = () => {
      this.isMobile = this.query.matches
      this.computeFoldedStyles();
    }

    document.addEventListener('scroll', this.handleScrollHelper);
  },
  destroyed: function() {
    this.query.onchange = null;
    document.removeEventListener('scroll', this.handleScrollHelper);
  }
}
</script>

<style scoped>
img {
  display: block;
}

#armor-info {
  --fold-transition: 500ms ease;
  --fold-nav-offset: 5.35rem;
  z-index: 4;
}

#armor-info>* {
  margin-bottom: 0;
}

#armor-info>div {
  margin-top: 0.85rem;
}

h2 {
  margin-top: 0;
  padding: 0.45em 0 0.50em 0.35em;
  border-bottom: 0.1rem solid var(--block-border);
  position: relative;
}

#fold-button {
  color: currentColor;
  position: absolute;
  right: 0;
  top: 0.45em;
  bottom: 0.50em;
  /* ↓↓ overridden in mobile & shown view */
  display: none;
  opacity: 0;
  visibility: hidden;
  transition:
    right var(--fold-transition),
    opacity var(--fold-transition),
    visibility var(--fold-transition);
}

#fold-button svg {
  font-size: 1.25em;
}

/* Only have the outline when in button-mode */
h2:focus-within, h2:focus {
  outline: none;
}

[role="button"] {
  cursor: pointer;
  outline: initial;
}

#stats {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.stars>:first-child {
  margin-right: 1em;
}

.stars>:last-child {
  margin-left: 1em;
}

@media (any-pointer: coarse) {
  /* give the stars a little more breathing room if they have a touch screen */
  .stars .star {
    margin: 0.2em;
  }

  .stars>:first-child {
    margin-right: 0.8em;
  }

  .stars>:last-child {
    margin-left: 0.8em;
  }
}

#defense {
  font-size: 0.85em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

#defense span {
  font-size: 1.45em;
}

#defense>* {
  margin: 0 0.3rem;
}

#defense svg {
  height: 1.45rem;
}

/* The second div, AKA the first .upgrade-item */
#armor-info>.upgrade-item:nth-of-type(2) {
  margin-top: 1.5rem;
}

.upgrade-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Calamity', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 1.275em;
  font-weight: bold;
  height: 2.2rem;
  background-color: var(--block-color-a);
  padding: 0 1em 0.15em 0.5em;
}

.upgrade-item>* {
  margin-left: 1rem;
  margin-right: 1rem;
}

.upgrade-item>:first-child {
  margin-left: 0;
}

.upgrade-item>:last-child {
  margin-right: 0;
}

.upgrade-item img {
  display: inline-block;
  align-self: flex-end;
  height: 135%;
  width: auto;
}

.upgrade-item :last-child {
  margin-left: auto;
}

h2#empty {
  border: none;
  color: var(--body-text-1);
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 4.5rem;
}

/* Class just for specificity */
p#complete {
  text-align: center;
  font-family: 'Calamity', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  margin-top: 1.8em;
  margin-bottom: 1.75em;
}

@media (max-width: 770px) {
  #armor-info {
    transition: top var(--fold-transition);
  }

  h2 {
    transition:
      transform var(--fold-transition),
      padding-left var(--fold-transition),
      border-color var(--fold-transition);
  }

  h2#empty {
    text-align: left;
    padding-left: 1em;
    transition:
      transform var(--fold-transition),
      padding-left var(--fold-transition);
  }

  #fold-button {
    display: initial;
  }

  [data-folded] h2 {
    border-color: transparent;
  }

  /* Give the text some breathing room */
  [data-folded] h2 {
    padding-left: 1em;
  }

  #armor-info>:not(h2) {
    transition:
      opacity var(--fold-transition),
      visibility var(--fold-transition);
    opacity: 1;
    visibility: visible;
  }

  #armor-info[data-folded]>:not(h2) {
    opacity: 0;
    visibility: hidden;
  }

  #fold-button svg {
    transition: transform var(--fold-transition);
    transform: rotate(180deg);
  }

  [data-folded] #fold-button {
    right: 1em;
    opacity: 1;
    visibility: visible;
  }

  [data-folded] #fold-button svg {
    transform: rotate(0deg);
  }
}

@media (max-width: 850px) and (min-width: 771px) {
  #armor-info {
    min-width: calc(13.8rem + 12vw);
    margin: 1.5rem 1.5rem 0;
    font-size: 0.85em;
  }

  .upgrade-item {
    font-size: 1.1em;
  }

  .upgrade-item>* {
    margin-left: 0.55rem;
    margin-right: 0.55rem;
  }
}

/* small-font size mobile */
@media (max-width: 430px) {
  #stats {
    font-size: 1.20em
  }
}

@media (max-width: 330px) {
  #defense {
    font-size: 0.75em;
  }

  .upgrade-item span:first-of-type {
    font-size: 0.80em;
  }

  .upgrade-item>* {
    margin-left: 0.65rem;
    margin-right: 0.65rem;
  }
}

/* Galaxy Fold */
@media (max-width: 300px) {
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