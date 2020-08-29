<template>
  <div id="armor-info">
    <img :src="sprite" alt="" aria-hidden="true" draggable="true">
    <h3
      v-if="this.armor"
      :aria-label="`${level} ${level == 1 ? 'star' : 'stars'}`"
    >
      <span v-for="i in level" :key="i" aria-hidden="true">&#9733;</span>
    </h3>
    <h2>{{ name }}</h2>
    <div id="stats">
      <Shirt />
      <span class="num">{{ currentDefense }}</span>
      <span>&#x25b6;</span>
      <span class="num">{{ nextDefense }}</span>
    </div>
    <div v-if="this.level < 4" class="upgrade-item">
      <img :src="sprite" alt="" aria-hidden="true">
      <span>{{ name }}</span>
      <span>1</span>
    </div>
    <div v-else class="upgrade-item">
      <img src="/images/blank.png" alt="" aria-hidden="true">
      <span>Fully upgraded!</span>
      <span></span>
    </div>
    <template v-for="item in nextItems">
      <div class="upgrade-item" :key="item.tag">
        <img :src="item.sprite" alt="" aria-hidden="true">
        <span>{{ item.name }}</span>
        <span>{{ item.count }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import Shirt from '@/assets/shirt.svg';
import items from '@/assets/gamedata/items.json';

export default {
  name: 'ArmorInfo',
  props: [ 'armor' ],
  components: { Shirt },
  data: function() {
    return { items }
  },
  computed: {
    name: function() {
      if (!this.armor) return 'No armor selected';
      else return this.armor.name;
    },
    sprite: function() {
      if (!this.armor) return '/images/blank.png';
      const folder = this.armor.tag.substr(0, this.armor.tag.indexOf('_'));
      return `/images/${folder}/${this.armor.tag}.png`;
    },
    level: function() {
      if (!this.armor) return 0;
      // Just random for testing
      return Math.floor(Math.random() * 5);
    },
    currentDefense: function() {
      // deal w/ user-progress later
      if (!this.armor) return 0;
      return this.armor.defense;
    },
    nextDefense: function() {
      // testing
      return 0;
    },
    nextItems: function() {
      if (!this.armor || this.level >= 4) return [];
      return Object.entries(this.armor.upgrades[this.level].items).map(([k, v]) => {
        return {
          sprite: `/images/items/${k}.png`,
          name: this.items.find(({tag}) => tag == k).name,
          count: v
        }
      });
    }
  }
}
</script>

<style scoped>
#armor-info {
  min-width: calc(18rem + 12vw);
  padding: 1rem;
  background-color: var(--block-color-t);
  backdrop-filter: blur(10px);
  border-radius: 0.3rem;
  border: 0.25rem double var(--block-border);
}

img {
  display: block;
}

#armor-info>* {
  margin-bottom: 0;
}

#armor-info>*+:not(h2) {
  margin-top: 0.85rem;
}

#armor-info>img {
  margin-top: 0;
}

h2 {
  margin-top: 0.5rem;
  padding-bottom: 0.85rem;
  padding-left: 0.35em;
  border-bottom: 0.1rem solid var(--block-border);
}

#stats {
  font-size: 0.85rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

#stats span {
  font-size: 1.25rem;
}

#stats>* {
  margin: 0 0.3rem;
}

svg {
  display: block;
  fill: currentColor;
  height: 1.2rem;
}

#stats~.upgrade-item {
  margin-top: 1.5rem;
}

.upgrade-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.35em;
  font-weight: bold;
  height: 2.2rem;
  background-color: var(--block-color);
  padding: 0 0.5em 0.15em;
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
}

.upgrade-item :last-child {
  margin-left: auto;
}
</style>