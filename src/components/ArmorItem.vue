<template>
  <button type="button" class="armor-item" @click="select">
    <span v-if="armor">{{ defense }}</span>
    <div>
      <img :src="imgsrc" aria-hidden="true" alt="">
    </div>
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
div, span {
  box-sizing: border-box;
}

button {
  cursor: pointer;
  position: relative;
  display: block;
}

div {
  background-color: #00000055;
  padding: 0.5rem;
}

span {
  background-color: #000000bb;
  color: var(--body-text);
  position: absolute;
  font-size: 1.35rem;
  font-weight: bold;
  bottom: 0.2rem; right: 0.2rem;
  padding: 0.4em 0.7em 0.15em;
}

img {
  display: block;
  height: 100%;
  width: 100%;
}
</style>