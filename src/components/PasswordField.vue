<template>
  <div class="hide-input">
    <input
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    <button type="button" @click="toggle">
      <EyeClosed v-if="type == 'password'" />
      <EyeOpen v-else />
    </button>
  </div>
</template>

<script>
import EyeOpen from '@/assets/icons/eye-open.svg';
import EyeClosed from '@/assets/icons/eye-closed.svg';

export default {
  name: 'PasswordField',
  components: { EyeOpen, EyeClosed },
  props: [
    'id',
    'name',
    'placeholder',
    'autocomplete',
    'value' // for v-model
  ],
  data: function() {
    return {
      type: 'password'
    }
  },
  methods: {
    toggle: function() {
      this.type = this.type == 'password' ? 'text' : 'password';
      this.$emit('change', this.type);
    },
    set: function(value) {
      this.type = value;
    }
  }
}
</script>

<style scoped>
div {
  display: flex;
  position: relative;
  box-sizing: content-box;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  cursor: pointer;
  padding: 0.40em;
  width: 2.77rem;
  height: 2.77rem;
  border-radius: 0.4rem;
  position: absolute;
  right: 0;
}

button:active {
  color: var(--body-text);
  background-color: var(--block-color-a);
}

svg {
  display: block;
  height: 100%;
  fill: var(--body-text-1);
}

@media (hover: hover) {
  button {
    transition: background-color 75ms linear;
  }

  button:hover, button:focus {
    color: var(--body-text);
    background-color: var(--block-color-a);
  }
}
</style>