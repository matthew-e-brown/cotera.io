<template>
  <main>
    <div class="keen-slider" ref="keen">
      <div class="keen-slider__slide" v-for="(page, i) in armor" :key="i">
        <ArmorList :armor="page" />
      </div>
    </div>
    <div id="selected">
      
    </div>
  </main>
</template>

<script>
import items from '@/items';
import armor, { sets } from '@/armor';

import KeenSlider from "keen-slider";
import 'keen-slider/keen-slider.min.css';
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
  },
  mounted: function() {
    this.slider = new KeenSlider(this.$refs.keen, {
      slidesPerView: 1,
      mode: 'snap',
      spacing: 15,
      centered: true,
      loop: false
    });
  },
  beforeDestroy: function() {
    if (this.slider) this.slider.destroy();
  }
}
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: calc(4rem + 0.25vw);
  padding: 0 5rem;
}
</style>