<template>
  <main>
    
  </main>
</template>

<script>
import db from '@/firestore';

export default {
  name: 'Home',
  data: function() {
    return {
      armor: [],
      items: [],
      sets: []
    }
  },
  firestore: function() {
    return {
      armor: db.collection('armor'),
      items: db.collection('items'),
      sets: db.collection('armor-sets')
    }
  }
}
</script>

<style scoped>
</style>