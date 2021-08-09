<template>
  <div class="modal-wrapper">
    <div class="modal-container" :class="containerClass">

      <slot />

      <div class="split-buttons" v-if="!noButtons">

        <button
          ref="refL"
          type="button"
          :class="classL"
          @click="clickL"
        ><slot :name="slotL">{{ nameL }}</slot></button>

        <button
          ref="refR"
          type="button"
          :class="classR"
          @click="clickR"
        ><slot :name="slotR">{{ nameR }}</slot></button>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, toRefs } from 'vue';

export default defineComponent({
  props: {
    noButtons: {
      type: Boolean as PropType<boolean>, required: false, default: false
    },
    swapButtons: {
      type: Boolean as PropType<boolean>, required: false, default: false
    },
    containerClass: {
      type: String as PropType<string>, required: false
    }
  },
  emits: [ 'confirm', 'cancel' ],
  setup(props, { emit }) {
    const { noButtons, swapButtons: swap, containerClass } = toRefs(props);

    const refL = ref<HTMLButtonElement>();
    const refR = ref<HTMLButtonElement>();

    const classL = computed(() => !swap.value ? 'danger-button' : 'button');
    const classR = computed(() => !swap.value ? 'button' : 'danger-button');

    const slotL = computed(() => !swap.value ? 'submit' : 'cancel');
    const slotR = computed(() => !swap.value ? 'cancel' : 'submit');

    const nameL = computed(() => !swap.value ? 'Yes' : 'No');
    const nameR = computed(() => !swap.value ? 'No' : 'Yes');

    const clickL = computed(() => {
      return () => {
        emit(!swap.value ? 'confirm' : 'cancel');
        refL.value?.blur();
      }
    });

    const clickR = computed(() => {
      return () => {
        emit(!swap.value ? 'cancel' : 'confirm');
        refR.value?.blur();
      }
    });

    return {
      noButtons, containerClass,
      classL, classR, slotL, slotR, clickL, clickR, nameL, nameR
    };
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
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }
}

.modal-container {
  margin-left: auto;
  margin-right: auto;

  p {
    margin: 2rem 0;
  }

  // non-overridden modal-content width
  width: 75%;
  max-width: 35rem;
  min-width: 15rem;
}
</style>