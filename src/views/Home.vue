<template>
  <div>
    <div v-for="(page, i) in paginatedArmor" :key="i" class="armor-table">
      <ArmorItem v-for="item in page" :key="item.id" :armor="item" />
    </div>
  </div>
</template>

<script>
import items from '@/items';
import armor, { sets } from '@/armor';

import ArmorItem from "@/components/ArmorItem";

export default {
  name: 'Home',
  components: { ArmorItem },
  data: function() {
    return {
      armor, sets, items,
      perPage: 20,
    }
  },
  computed: {
    paginatedArmor: function() {
      return this.armor.reduce((result, item, i) => {
        const chunk = Math.floor(i / this.perPage);

        if (!result[chunk]) result[chunk] = [];
        result[chunk].push(item);
        return result;
      }, []);
    }
  }
}
</script>

<style scoped>
.armor-table {
  display: grid;
  grid-template: repeat(4, 1fr) / repeat(5, 1fr);
  place-items: center;
}
</style>