<template>
  <main id="home">
    <ArmorInfo class="sticky-box" :armor="state.selected" />
    <div id="armor-list">
      <ArmorItem v-for="item in armor" :key="item.tag" :armor="item" />
    </div>
  </main>
</template>

<script>
import ArmorItem from '@/components/ArmorItem.vue';
import ArmorInfo from '@/components/ArmorInfo.vue';

import state from '@/store';
import armor from '@/assets/gamedata/armor.json';
import items from '@/assets/gamedata/items.json';

export default {
  name: 'Home',
  components: { ArmorItem, ArmorInfo },
  data: function() {
    return { state, armor, items, }
  },
  mounted: function() {
    // Pick a random selected (just for testing)
    this.state.selected = this.armor[ Math.floor(Math.random() * this.armor.length) ];
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: flex-start;
}

#home>* {
  flex: 1 1 auto;
}

#armor-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 2rem 1rem;
}

@media (max-width: 770px) {
  #home {
    flex-flow: row wrap;
  }
}
</style>