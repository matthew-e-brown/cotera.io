<template>
  <main :id="formID" class="sticky-box">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import '@/assets/styles/forms.scss';

export default defineComponent({
  name: 'Auth',
  props: {
    formID: { type: String as PropType<string>, required: true }
  }
});
</script>

<style scoped lang="scss">
// All Auth forms use this width by default
@include standalone-sticky(calc(25rem + 5vw));
// Make '/auth/register' and '/auth/link-email' a little wider
@include standalone-sticky(calc(35rem + 5vw), $suffix: '#register');
@include standalone-sticky(calc(35rem + 5vw), $suffix: '#link-email');
</style>