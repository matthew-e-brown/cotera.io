<template>
  <button type="button" class="armor-item" @click="select">
    <div class="defense">{{ defense }}</div>
    <img :src="imgsrc" aria-hidden="true" alt="">
  </button>
</template>

<script>
import state from '@/store';

export default {
  name: 'ArmorItem',
  props: {
    armor: { type: Object, required: true },
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
  cursor: pointer;
  position: relative;
  display: block;
}

.defense {
  position: absolute;
  bottom: 0.5em; right: 0.5em;
  color: var(--body-text);
}

img {
  display: block;
  height: 100%;
  width: auto;
}
</style>