<template>
  <main id="home">

  </main>
</template>

<script>
import armor from '@/assets/gamedata/armor.json';
import items from '@/assets/gamedata/items.json';
import sets from '@/assets/gamedata/sets.json';

export default {
  name: 'Home',
  data: function() {
    return {
      armor: [ ...armor ],
      items: [ ...items ],
    }
  }
}
</script>

<style scoped>
</style>