<template>
  <div class="modal-wrapper">
    <div class="modal">
      <slot></slot>
      <div>
        <button class="button danger" @click="$emit('confirm')">
          <slot name="confirm">Yes</slot>
        </button>
        <button class="button" @click="$emit('cancel')">
          <slot name="cancel">No</slot>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
.modal-wrapper {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: var(--block-color);
}

.modal {
  margin: 5em auto;
  min-width: 50%;
  max-width: 80%;
  width: fit-content;
}

h4 {
  text-align: center;
}

.modal div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal div>* {
  flex: 1 1 50%;
}

.modal div>:first-child {
  margin-left: 0;
}

.modal div>:last-child {
  margin-right: 0;
}
</style>