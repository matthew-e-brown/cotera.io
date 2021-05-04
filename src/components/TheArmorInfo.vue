<template>
  <div
    id="armor-info"
    ref="main"
    class="sticky-box"
  >
    <template>

    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import throttle from 'lodash.throttle';

import Shirt from '@/assets/icons/shirt.svg';

import { Armor } from '@/armor';
import { itemSprites, itemNames } from '@/items';
import { allState } from '@/state';


export default defineComponent({
  name: 'TheArmorInfo',
  
});
</script>

<style scoped lang="scss">
#armor-info {
  z-index: 4;

  @media (max-width: $break-medium) and (min-width: $break-mobile + 1) {
    min-width: calc(13.8rem + 12vw);
    margin: 1.5rem 1.5rem 0;
    font-size: 0.85em;
  }
}
</style>