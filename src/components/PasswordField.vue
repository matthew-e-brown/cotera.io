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
  position: relative;
  box-sizing: content-box;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  background-color: white;
  border: 0;
  z-index: 2;
  cursor: pointer;
  position: absolute;
  top: 0; bottom: 0; right: 0;
  padding: 0.5em;
  max-width: 2.77rem;
  border-top-right-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
}

svg {
  display: block;
  height: 100%;
  fill: #000000aa;
  transform: scale(1);
}

@media (hover: hover) {
  svg, button {
    transition-property: transform, background-color;
    transition: 75ms linear;
  }

  button:hover, button:focus {
    background-color: #e0e0e0;
  }

  button:hover svg, button:focus svg {
    transform: scale(1.25);
  }
}
</style>