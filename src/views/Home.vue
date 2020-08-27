<template>
  <main id="home">
    <div>
      <div class="page" v-for="(page, i) in paginatedArmor" :key="i">
        <ArmorItem v-for="item in page" :key="item.tag" :armor="item" />
      </div>
    </div>
    <div>
      <template v-if="state.selected">
        <h2>{{ state.selected.name }}</h2>
        <p>This item has {{ state.selected.defense }} base defense!</p>
      </template>
    </div>
  </main>
</template>

<script>
import ArmorItem from '@/components/ArmorItem.vue';

import state from '@/store';
import armor from '@/assets/gamedata/armor.json';
import items from '@/assets/gamedata/items.json';

export default {
  name: 'Home',
  components: { ArmorItem },
  data: function() {
    return { state, armor, items }
  },
  computed: {
    paginatedArmor: function() {
      return this.armor.reduce((acc, cur, i) => {
        const chunk = Math.floor(i / 20);

        if (!acc[chunk]) acc[chunk] = [] // start new page;
        acc[chunk].push(cur);

        return acc;
      }, []);
    }
  }
}
</script>

<style scoped>
#home {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
}

.page {
  display: grid;
  grid-template-columns: repeat(5, 8rem);
  grid-template-rows: repeat(5, 8rem);
  gap: 0.85rem;
}
</style>