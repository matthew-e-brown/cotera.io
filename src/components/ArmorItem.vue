<template>
  <li :aria-label="armor.name">
    <button type="button" @click="select">
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
  methods: {
    select: function() {
      this.state.selected = this.armor;
    }
  }
}
</script>

<style scoped>
li {
  display: block;
  list-style: none;
  margin: 1rem;
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
}

.stars span {
  font-size: 0.6em;
}

span.num {
  font-size: 1.25rem;
  position: absolute;
  right: -0.4em; bottom: -0.4em;
}

img {
  display: block;
  min-height: 82px;
  min-width: 82px;
  height: calc(2rem + 5vw);
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