<template>
  <p><slot></slot></p>

  <div class="split-buttons">
    <button :class="classL" @click="$emit(nameL)">
      <slot :name="nameL"></slot>
    </button>
    <button :class="classR" @click="$emit(nameR)">
      <slot :name="nameR"></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef, computed } from 'vue';

export default defineComponent({
  emits: [ 'confirm', 'cancel' ],
  // Left is confirm unless swapped, then right is confirm
  props: { swapped: { default: false, type: Boolean as PropType<boolean> } },
  setup(props) {
    const s = toRef(props, 'swapped');

    const nameL = computed(() => !s.value ? 'confirm' : 'cancel');
    const nameR = computed(() => !s.value ? 'cancel' : 'confirm');

    const classL = computed(() => !s.value ? 'danger-button' : 'button');
    const classR = computed(() => !s.value ? 'button' : 'danger-button');

    return { nameL, nameR, classL, classR };
  }
});
</script>