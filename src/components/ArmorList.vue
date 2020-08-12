<template>
  <div class="armor-table">
    <ArmorItem v-for="(item, i) in list" :key="i" :armor="item" />
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
    }
  },
  computed: {
    list: function() {
      return [ ...this.armor, ...Array(20 - this.armor.length) ];
    }
  }
}
</script>

<style>

</style>