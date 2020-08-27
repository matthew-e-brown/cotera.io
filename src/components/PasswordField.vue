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
import EyeOpen from '../assets/eye-open.svg';
import EyeClosed from '../assets/eye-closed.svg';

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
  position: relative;
  box-sizing: content-box;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: 0;
  z-index: 2;
  cursor: pointer;
  position: absolute;
  top: 0; bottom: 0; right: 0;
  padding: 0.4em;
}

@media (hover: hover) {
  button {
    transition: padding 75ms linear;
  }
  
  button:hover, button:focus {
    padding: 0.25em;
  }
}

svg {
  display: block;
  height: 100%;
  fill: #000000aa;
}
</style>