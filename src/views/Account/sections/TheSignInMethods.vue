<template>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ModalPayload } from '../types';

export default defineComponent({
  emits: { 'open-modal': (payload: ModalPayload) => !!payload.reason },
  setup(_, { emit }) {

  }
});
</script>

<style scoped lang="scss">

</style>