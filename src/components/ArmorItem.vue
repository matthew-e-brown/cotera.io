<template>
  <button type="button" class="armor-item" @click="select">
    <span v-if="armor" class="num">{{ armor.defense }}</span>
    <img :src="armor.sprite" draggable="false" aria-hidden="true" alt="">
  </button>
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
  methods: {
    select: function() {
      if (this.state.selected == this.armor) this.state.selected = null;
      else this.state.selected = this.armor;
    }
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
  min-height: 82px;
  min-width: 82px;
  height: calc(2rem + 5vw);
}

@media (max-width: 770px) {
  button {
    margin: 0.5rem;
  }

  img {
    height: calc(2rem + 3vh + 4vw);
  }
}
</style>