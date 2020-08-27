<template>
  <main id="home">
    <div ref="slider" id="left" class="keen-slider">
      <div
        class="page keen-slider__slide"
        v-for="(page, i) in paginatedArmor"
        :key="i"
      >
        <ArmorItem v-for="item in page" :key="item.tag" :armor="item" />
      </div>
    </div>
    <div id="right">
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

import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';

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
  },
  mounted: function() {
    this.slider = new KeenSlider(this.$refs.slider, {
      slidesPerView: 1,
      spacing: 50,
      centered: true
    });

    setTimeout(this.slider.refresh, 100);
  },
  beforeDestroy: function() {
    if (this.slider) this.slider.destroy();
  }
}
</script>

<style scoped>
#home {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
}

#left, #right {
  margin: 2rem 5rem 0;
}

#left {
  margin-right: 0;
}

#right {
  margin-left: 0;
}

.page {
  display: grid;
  box-sizing: border-box;
  grid-template: repeat(4, 1fr) / repeat(5, 1fr);
  justify-content: center;
  align-items: stretch;
  gap: 0.85em;
}
</style>