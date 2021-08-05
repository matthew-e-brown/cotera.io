<template>
  <div class="modal-wrapper">

    <slot />

    <div class="modal-buttons" v-if="!noButtons">

      <button
        type="button"
        class="button"
        :class="classL"
        @click="clickL"
      ><slot :name="slotL" /></button>

      <button
        type="button"
        class="button"
        :class="classR"
        @click="clickR"
      ><slot :name="slotR" /></button>

    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

export default defineComponent({
  props: {
    noButtons: {
      type: Boolean as PropType<boolean>, required: false, default: false
    },
    swapButtons: {
      type: Boolean as PropType<boolean>, required: false, default: false
    },
  },
  emits: [ 'confirm', 'cancel' ],
  setup(props, { emit }) {
    const { noButtons, swapButtons } = toRefs(props);

    const classL = computed(() => !swapButtons.value ? 'submit' : '');
    const classR = computed(() => !swapButtons.value ? '' : 'submit');

    const slotL = computed(() => !swapButtons.value ? 'submit' : 'cancel');
    const slotR = computed(() => !swapButtons.value ? 'cancel' : 'submit');

    const clickL = computed(() => {
      return () => emit(!swapButtons.value ? 'confirm' : 'cancel');
    });
    const clickR = computed(() => {
      return () => emit(!swapButtons.value ? 'cancel' : 'confirm');
    });

    return { noButtons, classL, classR, slotL, slotR, clickL, clickR };
  }
});
</script>

<style scoped lang="scss">
.modal-wrapper {
  position: absolute;
  z-index: 4;
  inset: 0;

  background-color: $bg-color;

  display: flex;
  align-items: center;
  justify-content: center;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }
}
</style>