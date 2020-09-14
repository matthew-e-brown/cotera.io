<template>
  <main id="home">
    <div id="main-container">
      <ArmorInfo class="sticky-box" :armor="state.selected" />
      <div id="list-container">
        <section>
          <h3 class="line">
            <Shirt />
            <span>Armor</span>
          </h3>
          <ul class="armor-list">
            <ArmorItem v-for="piece in armor" :key="piece.tag" :armor="piece" />
          </ul>
        </section>
        <section>
          <h3 class="line">
            <Amiibo id="amiibo" aria-label="amiibo" />
            <span>Armor</span>
          </h3>
          <ul class="armor-list">
            <ArmorItem v-for="piece in amiibo" :key="piece.tag" :armor="piece" />
          </ul>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import ArmorItem from '@/components/ArmorItem.vue';
import ArmorInfo from '@/components/ArmorInfo.vue';
import Amiibo from '@/assets/icons/amiibo.svg';
import Shirt from '@/assets/icons/shirt.svg';

import state from '@/store';
import armor, { amiibo } from '@/armor';

export default {
  name: 'Home',
  components: { ArmorItem, ArmorInfo, Shirt, Amiibo },
  data: function() {
    return { state, armor, amiibo }
  }
}
</script>

<style scoped>
#main-container {
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: flex-start;
}

#main-container>* {
  flex: 1 1 auto;
}

section {
  margin: 2rem 1rem;
}

.armor-list {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 0;
}

h3 {
  margin: 0 1rem;
}

h3 svg {
  height: 1em;
  margin-right: 0.5em;
  align-self: center;
}

#amiibo {
  height: 1.275em;
  margin-right: 0.30em;
  align-self: flex-end;
}

@media (max-width: 770px) {
  #main-container {
    flex-flow: row wrap;
  }
}
</style>