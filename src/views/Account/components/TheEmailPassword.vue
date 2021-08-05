<template>
  <div v-if="!emailForm.visible" class="account-row">
    <div>Email</div>
    <div>{{ providerEmail }}</div>
    <button
      type="button"
      class="button"
      @click="emailForm.visible = true"
    >Change</button>
  </div>

  <div v-else class="account-row">
    <div>Email</div>

    <form @submit.prevent="emailForm.submit">
      <input
        type="text"
        id="new-email"
        name="new-email"
        placeholder="New email address"
        autocomplete="off"
        v-model="emailForm.newEmail"
      />

      <ul v-if="emailForm.errors.length > 0" class="errors">
        <li v-for="(error, i) in emailForm.errors" :key="i">{{ error }}</li>
      </ul>

      <div class="form-buttons">
        <button
          type="submit"
          class="button"
          :disabled="!sessionOpen"
        >Save</button>
        <button
          type="button"
          class="button"
          @click="emailForm.close"
        >Cancel</button>
      </div>
    </form>
  </div>


  <div v-if="!passwordForm.visible" class="account-row">
    <div>Password</div>
    <div v-html="'&ast;'.repeat(10)" />
    <button
      type="button"
      class="button"
      @click="passwordForm.visible = true"
    >Change</button>
  </div>

  <div v-else class="account-row">
    <div>Password</div>

    <form @submit.prevent="passwordForm.submit">

      <PasswordField
        id="password-1"
        name="new-password-1"
        placeholder="New password"
        autocomplete="new-password"
        v-model:value="passwordForm.password1"
        v-model:hidden="passwordForm.hiddenFields"
      />
      <PasswordField
        id="password-2"
        name="new-password-2"
        placeholder="Re-type new password"
        autocomplete="new-password"
        v-model:value="passwordForm.password2"
        v-model:hidden="passwordForm.hiddenFields"
      />

      <ul v-if="passwordForm.errors.length > 0" class="errors">
        <li v-for="(error, i) in passwordForm.errors" :key="i">{{ error }}</li>
      </ul>

      <div class="form-buttons">
        <button
          type="submit"
          class="button"
          :disabled="!sessionOpen"
        >Save</button>
        <button
          type="button"
          class="button"
          @click="passwordForm.close"
        >Cancel</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue';

import { useAuthFlow } from '@/auth/hooks';
import { sessionOpen } from '@/auth/session';

import user, { refreshUser, errorHandler } from '../user';

import PasswordField from '@/components/PasswordField.vue';


function useChangeEmailForm() {
  const visible = ref(false);
  const newEmail = ref("");

  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors, errorHandler });

  const validate = () => {
    errors.value = [];

    if (newEmail.value.length == 0)
      errors.value.push("Please enter a new email address.");

    if (!sessionOpen.value) {
      errors.value = [
        "Sorry, your session has expired. Please sign in again."
      ];
    }

    return errors.value.length == 0;
  }

  const close = () => {
    newEmail.value = "";
    visible.value = false;
  }

  const submit = async () => {
    if (!validate()) return;
    const success = await authExecutor(user.value.updateEmail(newEmail.value));
    if (success) {
      refreshUser();
      close();
    }
  }

  return {
    emailForm: reactive({ visible, newEmail, errors, submit, close })
  };
}


function useChangePasswordForm() {
  const visible = ref(false);

  const password1 = ref("");
  const password2 = ref("");
  const hiddenFields = ref(true);

  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors, errorHandler });

  const validate = () => {
    errors.value = [];

    if (password1.value.length == 0)
      errors.value.push("Please enter a password.");
    else if (password2.value.length == 0)
      errors.value.push("Please verify your password.");
    else if (password1.value != password2.value)
      errors.value.push("Those passwords do not match.");

    return errors.value.length == 0;
  }

  const close = () => {
    password1.value = "";
    password2.value = "";
    visible.value = false;
  }

  const submit = async () => {
    if (!validate()) return;

    const success = await authExecutor(user.value
      .updatePassword(password1.value));

    if (success) {
      refreshUser();
      close();
    }
  }

  return {
    passwordForm: reactive({
      visible, password1, password2, hiddenFields, errors, submit, close
    })
  };
}


export default defineComponent({
  components: { PasswordField },
  setup() {
    const providerEmail = computed(() => {
      // '!' because this component is only shown when 'hasEmail' is true, and
      // because the 'password' provider always has an email attached to it (the
      // other providers may not, hence 'string | null').
      return user.value.providerData
        .find(p => p!.providerId == 'password')!
        .email!;
    });

    return {
      providerEmail, sessionOpen,
      ...useChangeEmailForm(), ...useChangePasswordForm()
    };
  }
});
</script>

<style scoped lang="scss">
.account-row {
  display: grid;
  align-items: flex-start;
  grid-template-columns: 7rem 2fr 1fr;
  column-gap: 1em;

  font-size: 95%;

  margin: 0.85rem 0;

  // Offset the *text* from the top to make it appear centered. Can't use actual
  // centering because the row becomes taller when the value is replaced by the
  // form.
  >div {
    margin-top: 1.2em;
  }

  >:nth-child(1) {
    font-weight: bold;
    font-style: italic;
  }

  >:nth-child(2) {
    color: $fg-color-dim;
    @include dot-dot-dot;
  }

  >button { justify-self: flex-end; }
  input, .hide-input { margin-top: 0.4em; }
}

.form-buttons {
  display: flex;
  column-gap: 1em;
  justify-content: flex-end;
  flex-flow: row nowrap;

  margin-top: 1em;
  font-size: 0.9em;

  button { margin: 0; }
  button:last-child { border: none; }
}
</style>