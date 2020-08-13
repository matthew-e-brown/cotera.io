<template>
  <main>
    <div class="keen-slider" ref="keen">
      <div class="keen-slider__slide" v-for="(page, i) in chunkArmor(armor)" :key="i">
        <ArmorList
          :armor="page"
          :selected="selected ? selected.id : undefined"
          @armor-clicked="selectArmor"
        />
      </div>
    </div>
    <div id="selected">
      <template v-if="selected">
        <h2>{{ selected.name }}</h2>
        <p>
          The selected piece of armor has {{ selected.defense }} defense, and
          is currently at level {{ selected.level }}.
        </p>
        <template v-if="selected.level < 4">
          <p>
            Here are the upgrades required for the next level:
          </p>
          <ul>
            <li v-for="([item, quantity], i) in getNextItems(selected)" :key="i">
              {{ item }} &times; {{ quantity }}
            </li>
          </ul>
        </template>
        <p v-else>
          This item is at the maximum level!
        </p>
      </template>
    </div>
  </main>
</template>

<script>
import items from '@/items';
import armor from '@/armor';
import KeenSlider from "keen-slider";
import 'keen-slider/keen-slider.min.css';
import ArmorList from "@/components/ArmorList";

export default {
  name: 'Home',
  components: { ArmorList },
  data: function() {
    return {
      rawArmor: armor,
      selectedIndex: -1,
      slider: undefined
    }
  },
  computed: {
    armor: function() {
      return this.rawArmor.map((i) => {
        const item = { ...i };
        // >> Check if there's any level:
        if (!item.level) item.level = 0;
        if (item.level > 4) item.level = 4;

        // >> Check if the current level requries changing defense from base:
        if (item.level == 0) item.defense = item.base;
        else item.defense = item.upgrades[item.level - 1].defense;
        delete item.base;

        return item;
      });
    },
    selected: function() {
      if (this.selectedIndex < 0) return undefined;
      return this.armor[this.selectedIndex];
    }
  },
  methods: {
    selectArmor: function(armor) {
      this.selectedIndex = this.armor.indexOf(armor);
    },
    getNextItems: function(selected) {
      // >> Get all the item names from the imported items object
      return Object.entries(selected.upgrades[selected.level].items)
        .map(([item, quantity]) => [ items[item], quantity ]);
    },
    chunkArmor: function(armor) {
      return armor.reduce((result, item, i) => {
        const chunk = Math.floor(i / 20);

        if (!result[chunk]) result[chunk] = [];
        result[chunk].push(item);
        return result;
      }, []);
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