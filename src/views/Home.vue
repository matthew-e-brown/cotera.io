<template>
  <main>
    <div id="armor-list">
      <ArmorList
        v-for="(page, i) in armor"
        :key="i"
        :armor="page"
      />
    </div>
    <div id="selected">
      
    </div>
  </main>
</template>

<script>
import items from '@/items';
import armor, { sets } from '@/armor';

import ArmorList from "@/components/ArmorList";

export default {
  name: 'Home',
  components: { ArmorList },
  data: function() {
    return {
      sets, items,
      armor: armor.reduce((result, item, i) => {
        const chunk = Math.floor(i / 20);

        if (!result[chunk]) result[chunk] = [];
        result[chunk].push(item);
        return result;
      }, [])
    }
  }
}
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: calc(4rem + 0.25vw);
}

.armor-table {
  display: grid;
  grid-template: repeat(4, 1fr) / repeat(5, 1fr);
  place-items: center;
}
</style>