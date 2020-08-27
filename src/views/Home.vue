<template>
  <main id="home">
    <h2 v-if="state.signedin">Hello! You're signed in.</h2>
    <h2 v-else>Hello! Sign in to store progress.</h2>
  </main>
</template>

<script>
import state from '@/store';
import armor from '@/assets/gamedata/armor.json';
import items from '@/assets/gamedata/items.json';
import sets from '@/assets/gamedata/sets.json';

export default {
  name: 'Home',
  data: function() {
    return {
      state,
      armor: [ ...armor ],
      items: [ ...items ],
    }
  }
}
</script>

<style scoped>
</style>