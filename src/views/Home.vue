<template>
  <main id="home">
    <ArmorInfo class="sticky-box" :armor="state.selected" />
    <ul id="armor-list">
      <ArmorItem v-for="piece in armor" :key="piece.tag" :armor="piece" />
    </ul>
  </main>
</template>

<script>
import ArmorItem from '@/components/ArmorItem.vue';
import ArmorInfo from '@/components/ArmorInfo.vue';

import state from '@/store';
import armor, { amiibo } from '@/armor';

export default {
  name: 'Home',
  components: { ArmorItem, ArmorInfo },
  data: function() {
    return {
      state,
      armor: armor.concat(amiibo)
    }
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
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 2rem 1rem;
  padding: 0;
}

@media (max-width: 770px) {
  #home {
    flex-flow: row wrap;
  }
}
</style>