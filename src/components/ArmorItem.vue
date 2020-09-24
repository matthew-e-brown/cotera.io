<template>
  <li :aria-label="armor.name" :class="{ selected }">
    <button type="button" @click="select" ref="button">
      <div class="stars">
        <span v-for="i in 4" :class="{ filled: i <= armor.level }" :key="i">
          <fa-icon icon="star" />
        </span>
      </div>
      <img :src="armor.sprite" draggable="false" aria-hidden="true" alt="">
      <span
        v-if="armor"
        class="num"
        aria-label="defense"
      >{{ armor.defense }}</span>
    </button>
  </li>
</template>

<script>
import state from '@/store';

export default {
  name: 'ArmorItem',
  props: {
    armor: { type: Object, required: false }
  },
  data: function() {
    return { state }
  },
  computed: {
    selected: function() {
      return this.state.selected == this.armor;
    }
  },
  methods: {
    select: function(event) {
      if (this.state.selected == this.armor) {
        this.state.selected = undefined;
        this.$refs.button.blur();
      } else this.state.selected = this.armor;
    }
  }
}
</script>

<style scoped>
li {
  display: block;
  list-style: none;
  margin: 0.85rem;
}

button {
  display: block;
  cursor: pointer;
  position: relative;
  background-color: var(--block-color-t);
  padding: 0.25rem;
  margin: 0;
  border: 0.25rem double var(--block-border);
  border-radius: 0.3rem;
}

.stars {
  flex-flow: column-reverse;
  position: absolute;
  bottom: 0.2em; left: 0.2em;
  z-index: 2;
}

.stars span {
  font-size: 0.6em;
}

span.num {
  font-size: 1.25rem;
  position: absolute;
  right: -0.4em; bottom: -0.4em;
  z-index: 2;
}

img {
  display: block;
  min-height: 82px;
  min-width: 82px;
  height: calc(2rem + 5vw);
  position: relative;
  z-index: 1;
}

.selected {
  --block-border: rgba(249, 237, 180, 0.55);
}

.selected button::before {
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

@media (max-width: 980px) {
  li {
    margin: 0.55rem 0.30rem;
  }
}

@media (max-width: 770px) {
  li {
    margin: 0.5rem;
  }

  img {
    height: calc(2rem + 3vh + 4vw);
  }
}
</style>