<template>
  <div id="modal" v-if="view != ModalViews.Hidden">

    <div v-if="view == ModalViews.LinkAccount">

    </div>


    <div v-if="view == ModalViews.Reauthorize">

    </div>


    <div v-else-if="view == ModalViews.ResetWarning">

    </div>


    <div v-else-if="view == ModalViews.DeletionWarning1">

    </div>


    <div v-else-if="view == ModalViews.DeletionWarning2">

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ModalViews } from './types';

export default defineComponent({
  props: {
    view: { type: Number as PropType<ModalViews>, required: true }
  },
  setup() {
    return { ModalViews };
  },
});
</script>


<style scoped lang="scss">
#modal {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }

  >div {
    margin: 5em auto;
    width: 72.5%;
  }
}
</style>