<template>
  <div class="hide-input">
    <input
      :type="hidden ? 'password' : 'text'"
      :value="value"
      @input="onInput"
      v-bind="$attrs"
    />
    <button type="button" @click="onClick">
      <component :is="icon" />
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

import EyeOpen from '@/assets/icons/eye-open.svg';
import EyeClosed from '@/assets/icons/eye-closed.svg';

export default defineComponent({
  name: 'PasswordField',
  props: {
    // v-model value
    value: { type: String as PropType<string> },
    // Optional v-model hidden -- if passed, will model this variable
    hidden: {
      type: Boolean as PropType<boolean> | undefined as PropType<undefined>,
      default: undefined
    }
  },
  emits: [ 'toggle', 'update:value', 'update:hidden' ],
  setup(props, { emit }) {
    // Internal state, used only when prop is not passed: undefined otherwise
    const _hidden = ref<boolean | undefined>(
      props.hidden === undefined ? true : undefined
    );

    /**
     * Wrapper for alternative 'hidden' behaviour: if props.hidden is passed,
     * then this will return its value on get and emit 'update:hidden' on set.
     * Otherwise, it will proxy to the internal _hidden state.
     */
    const hidden = computed({
      get: () => {
        if (props.hidden === undefined) return _hidden.value;
        else return props.hidden;
      },
      set: (value) => {
        if (props.hidden === undefined) _hidden.value = value;
        else emit('update:hidden', value);
      }
    });

    const icon = computed(() => hidden.value ? EyeClosed : EyeOpen);

    const onInput = (event: any) => emit('update:value', event.target.value);
    const onClick = () => hidden.value = !hidden.value;

    return { icon, hidden, onInput, onClick };
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