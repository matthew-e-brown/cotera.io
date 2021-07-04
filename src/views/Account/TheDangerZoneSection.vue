<template>
  <p>These actions are irreversible.</p>

  <div class="split-buttons">
    <button
      @click="$emit('start-reset')"
      class="danger-button"
    >Reset Progress</button>
    <button
      @click="$emit('start-delete')"
      class="danger-button"
    >Delete Account</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: [ 'start-reset', 'start-delete' ]
});
</script>