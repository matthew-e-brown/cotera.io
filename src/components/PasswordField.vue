<template>
  <div class="hide-input">
    <input
      :type="hidden ? 'password' : 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    />
    <button type="button" @click="hidden = !hidden">
      <component :is="icon" />
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import EyeOpen from '@/assets/icons/eye-open.svg';
import EyeClosed from '@/assets/icons/eye-closed.svg';

export default defineComponent({
  name: 'PasswordField',
  props: {
    modelValue: { type: String as PropType<string> }
  },
  emits: [ 'toggle', 'update:modelValue' ],
  setup(_, { emit }) {
    const hidden = ref(true);
    const icon = computed(() => hidden.value ? EyeClosed : EyeOpen);
    watch(hidden, v => emit('toggle', v));

    return { hidden, icon };
  }
});
</script>

<style scoped lang="scss">
div {
  box-sizing: content-box;
  position: relative;
}

button {
  position: absolute;
  top: 0; right: 0;

  color: $fg-color-dim;
  background: none;
  cursor: pointer;

  padding: 0.4em;
  width: 2.77em;
  height: 2.77em;
  border-radius: 0.5em;

  transition: background-color 75ms linear;

  &:active, &:focus {
    color: $fg-color;
    background-color: $bg-color-accent;
  }

  @media (hover: hover) {
    &:hover {
      color: $fg-color;
      background-color: $bg-color-accent;
    }
  }
}

svg {
  height: 100%;
}
</style>