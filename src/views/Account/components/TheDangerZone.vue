<template>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ModalPayload } from '../types';
import { sessionOpen } from '@/auth/session';

export default defineComponent({
  emits: {
    openModal: (payload: ModalPayload) => {
      return (payload as any).hasOwnProperty('reason');
    }
  },
  setup(_, { emit }) {

  }
});
</script>

<style scoped lang="scss">

</style>