<template>
  
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';

import { ModalPayloadKey } from '../types';

export default defineComponent({
  setup() {
    const modalPayload = inject(ModalPayloadKey, ref(null));
  }
});
</script>

<style scoped lang="scss">

</style>