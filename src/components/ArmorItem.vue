<template>
  <button type="button" class="armor-item" @click="select">
    <span v-if="armor" class="num">{{ defense }}</span>
    <!-- <div> -->
      <img :src="imgsrc" draggable="false" aria-hidden="true" alt="">
    <!-- </div> -->
  </button>
</template>

<script>
import state from '@/store';

export default {
  name: 'ArmorItem',
  props: {
    armor: { type: Object, required: false },
    level: { type: Number, default: 0 }
  },
  data: function() {
    return {
      state
    }
  },
  methods: {
    select: function() {
      if (this.state.selected == this.armor) this.state.selected = null;
      else this.state.selected = this.armor;
    }
  },
  computed: {
    imgsrc: function() {
      if (!this.armor) return '/images/blank.png';
      const type = this.armor.tag.substring(0, this.armor.tag.indexOf('_'));
      return `/images/${type}/${this.armor.tag}.png`;
    },
    defense: function() {
      return (this.armor.upgrades[this.level - 1] || this.armor).defense;
    },
  }
}
</script>

<style scoped>
button {
  display: block;
  cursor: pointer;
  position: relative;
  background-color: var(--block-color-t);
  padding: 0.25rem;
  margin: 1rem;
  border: 0.25rem double var(--block-border);
  border-radius: 0.3rem;
}

span {
  font-size: 1.25rem;
  position: absolute;
  right: -0.4em; bottom: -0.4em;
}

img {
  display: block;
  max-height: 100%;
  max-width: 100%;
  height: calc(2rem + 5vw);
}
</style>