<template>
  <div class="armor-list">
    <ArmorItem
      v-for="(item, i) in list"
      :key="i"
      :armor="item"
      :selected="selected"
      @clicked="armor => $emit('armor-clicked', armor)"
    />
  </div>
</template>

<script>
import ArmorItem from "@/components/ArmorItem";

export default {
  name: 'ArmorList',
  components: { ArmorItem },
  props: {
    armor: {
      type: Array,
      required: true,
      validator: arr => arr.length <= 20
    },
    selected: {
      type: String,
      required: false
    }
  },
  computed: {
    list: function() {
      // Pad with undefined to length 20
      return [ ...this.armor, ...Array(20 - this.armor.length) ];
    }
  }
}
</script>

<style>
.armor-list {
  display: grid;
  grid-template: repeat(4, minmax(90px, 1fr)) / repeat(5, minmax(90px, 1fr));
  place-items: center;
  gap: 0.65rem;
  padding: 0.25rem 1.25rem;
}
</style>