<template>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { sessionOpen } from '@/auth/session';

import { ModalPayload } from '../types';

export default defineComponent({
  emits: {
    openModal: (payload: ModalPayload) => {
      return (payload as object).hasOwnProperty('reason');
    }
  },
  setup(_, { emit }) {

  }
});
</script>

<style scoped lang="scss">

</style>