<template>
  <div class="modal-wrapper">
    <div class="modal" aria-modal="true">
      <slot></slot>
      <div class="modal-buttons">
        <button
          v-if="showConfirm"
          class="button danger"
          @click="$emit('confirm')"
        >
          <slot name="confirm">Yes</slot>
        </button>
        <button class="button" @click="$emit('cancel')">
          <slot name="cancel">Cancel</slot>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    showConfirm: { type: Boolean, required: false, default: true }
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
.modal-wrapper {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: var(--block-color);
}

@supports (backdrop-filter: blur(10px)) {
  .modal-wrapper {
    background-color: var(--block-color-t);
    backdrop-filter: blur(10px);
  }
}

.modal {
  margin: 5em auto;
  width: 72.5%;
}

h4 {
  text-align: center;
}

.modal-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-buttons>* {
  flex: 1 1 50%;
}

.modal-buttons>:first-child {
  margin-left: 0;
}

.modal-buttons>:last-child {
  margin-right: 0;
}
</style>