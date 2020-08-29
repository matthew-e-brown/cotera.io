<template>
  <div id="armor-info" :class="{ empty: !armor }">
    <template v-if="armor">
      <img :src="armor.sprite" alt="" aria-hidden="true" draggable="true">
      <h3 :aria-label="`${armor.level} ${armor.level == 1 ? 'star' : 'stars'}`">
        <span v-for="i in armor.level" :key="i" aria-hidden="true">
          &#9733;&#xFE0E;
        </span>
      </h3>
      <h2>{{ armor.name }}</h2>
      <div id="stats">
        <Shirt />
        <span class="num">{{ armor.defense }}</span>
        <span>&#x25b6;&#xFE0E;</span>
        <span class="num">{{ armor.nextDefense }}</span>
      </div>
      <div class="upgrade-item">
        <img :src="armor.sprite" alt="" aria-hidden="true">
        <span>{{ armor.name }}</span>
        <span>1</span>
      </div>
      <!-- <div v-for="item in nextItems" class="upgrade-item" :key="item.tag">
        <img :src="item.sprite" alt="" aria-hidden="true">
        <span>{{ item.name }}</span>
        <span>{{ item.count }}</span>
      </div> -->
    </template>
    <template v-else>
      <h2>No armor selected.</h2>
    </template>
  </div>
</template>

<script>
import Shirt from '@/assets/shirt.svg';
import items from '@/assets/items.json';

export default {
  name: 'ArmorInfo',
  props: [ 'armor' ],
  components: { Shirt },
  data: function() {
    return { items }
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
}

.upgrade-item :last-child {
  margin-left: auto;
}

#armor-info.empty h2 {
  border: none;
  color: var(--body-text-t);
  margin-top: 5rem;
  margin-bottom: 4.5rem;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>