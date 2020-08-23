<template>
  <main id="home">
    
  </main>
</template>

<script>
import db from '@/firestore';
import { armor, sets } from '@/assets/armor';
import { items } from '@/assets/items';

export default {
  name: 'Home',
  data: function() {
    return {
      armor: [ ...armor ],
      items: [ ...items ],
      user: {
        progress: null
      }
    }
  },
  firestore: function() {
    return {
      'user.progress': db.collection('user-progress')
    }
  }
}
</script>

<style scoped>
</style>