<template>
  <div id="armor-info" :class="{ empty: !armor, complete: armor && completed }">
    <template v-if="armor">
      <img :src="armor.sprite" alt="" aria-hidden="true" draggable="true">
      <h2>{{ armor.name }}</h2>
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
            :disabled="!(armor.level > 0)"
            @click="decrease"
          ><fa-icon icon="minus" /></button>
          <span
            v-for="i in 4"
            :key="i"
            :class="{ filled: i <= armor.level }"
            aria-hidden="true"
          ><fa-icon icon="star" /></span>
          <button
            type="button"
            aria-label="increase level"
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
      <p v-else>This armor is fully upgraded!</p>
    </template>
    <h2 v-else>No armor selected.</h2>
  </div>
</template>

<script>
import Shirt from '@/assets/icons/shirt.svg';
import { userProgress, levelUp, levelDown } from '@/store';
import items from '@/assets/data/items.json';

export default {
  name: 'ArmorInfo',
  props: {
    armor: { type: Object, required: false }
  },
  components: { Shirt },
  methods: {
    increase: function() {
      if (this.armor.level < 4) levelUp(this.armor);
    },
    decrease: function() {
      if (this.armor.level > 0) levelDown(this.armor);
    },
    itemName: function(item) {
      return items.find(i => i.tag == item).name;
    },
    itemSprite: function(item) {
      return `/images/items/${item}.png`;
    }
  },
  computed: {
    completed: function() {
      return this.armor.level == 4;
    }
  }
}
</script>

<style scoped>
img {
  display: block;
}

#armor-info>* {
  margin-bottom: 0;
}

#armor-info>div {
  margin-top: 0.85rem;
}

h2 {
  margin-top: 0.5rem;
  padding-bottom: 0.85rem;
  padding-left: 0.35em;
  border-bottom: 0.1rem solid var(--block-border);
}

#stats {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.stars span:first-of-type {
  margin-left: 1em;
}

.stars span:last-of-type {
  margin-right: 1em;
}

#defense {
  font-size: 0.85rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

#defense span {
  font-size: 1.25rem;
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

#armor-info.empty h2 {
  border: none;
  color: var(--body-text-1);
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 4.5rem;
}

/* Class just for specificity */
#armor-info.complete p {
  text-align: center;
  font-family: 'Calamity', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  margin-top: 1.8em;
  margin-bottom: 1.75em;
}
</style>