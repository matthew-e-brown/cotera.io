<template>

  <div class="account-row">

    <div>Email</div>

    <div v-if="!emailShown">{{ providerEmail }}</div>
    <form v-else @submit.prevent="emailForm.submit">
      <input
        id="new-email"
        type="text"
        name="new-email"
        placeholder="New email address"
        autocomplete="off"
        v-model="emailForm.newEmail"
      />
      <PasswordField
        id="email-password"
        name="email-password"
        placeholder="Current password"
        autocomplete="current-password"
        v-model:value="emailForm.password"
      />

      <ul v-if="emailForm.errors.length > 0" class="errors">
        <li v-for="(error, i) in emailForm.errors" :key="i">{{ error }}</li>
      </ul>

      <div class="form-buttons">
        <button
          class="button"
          type="submit"
        >Save</button>
        <button
          class="button"
          type="button"
          @click="emailShown = false"
        >Cancel</button>
      </div>
    </form>

    <button
      v-if="!emailShown"
      @click="emailShown = true"
      class="button"
    >Change</button>

  </div>


  <div class="account-row">

    <div>Password</div>

    <div v-if="!passwordShown" v-html="'&ast;'.repeat(10)"></div>
    <form v-else @submit.prevent="passwordForm.submit">
      <PasswordField
        id="old-password"
        name="old-password"
        placeholder="Current password"
        autocomplete="current-password"
        v-model:value="passwordForm.old"
        v-model:hidden="passwordForm.hidden"
      />
      <PasswordField
        id="new-password-1"
        name="new-password-1"
        placeholder="New password"
        autocomplete="new-password"
        v-model:value="passwordForm.new1"
        v-model:hidden="passwordForm.hidden"
      />
      <PasswordField
        id="new-password-2"
        name="new-password-2"
        placeholder="Re-type new password"
        autocomplete="new-password"
        v-model:value="passwordForm.new2"
        v-model:hidden="passwordForm.hidden"
      />

      <ul v-if="passwordForm.errors.length > 0">
        <li v-for="(error, i) in passwordForm.errors" :key="i">{{ error }}</li>
      </ul>

      <div class="form-buttons">
        <button
          class="button"
          type="submit"
        >Save</button>
        <button
          class="button"
          type="button"
          @click="passwordShown = false"
        >Cancel</button>
      </div>
    </form>

    <button
      v-if="!passwordShown"
      @click="passwordShown = true"
      class="button"
    >Change</button>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useAuthFlow } from '@/auth-hooks';
import user, { refreshUser, errorHandler } from "./user";
import PasswordField from '@/components/PasswordField.vue';


function useChangeEmailForm() {
  const shown = ref(false);

  const newEmail = ref("");
  const password = ref("");

  const providerEmail = computed(() => {
    return user.value.providerData
      .find(p => p!.providerId == 'password')! // hasEmail guard, therefore '!'
      .email!; // 'password' provider will always have email
  });

  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors, errorHandler });

  const validate = () => {
    errors.value = [];

    if (newEmail.value.length == 0)
      errors.value.push("Please a new email address.");

    if (password.value.length == 0)
      errors.value.push("Please enter your password.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate()) return;

    let success = false;
    try {
      success = await authExecutor(user.value.updateEmail(newEmail.value));
    } catch (error) {
      // catch 'auth/requires-recent-login' error

      const cred = firebase.auth
        .EmailAuthProvider
        .credential(providerEmail.value, password.value);

      // Reauthenticate and retry
      await authExecutor(user.value.reauthenticateWithCredential(cred));
      success = await authExecutor(user.value.updateEmail(newEmail.value));
    }

    if (success) refreshUser();
  }

  return {
    providerEmail,
    emailShown: shown,
    emailForm: reactive({ newEmail, password, errors, submit }),
  };
}


function useChangePasswordForm() {
  const shown = ref(false);

  const old = ref("");
  const new1 = ref("");
  const new2 = ref("");
  const hidden = ref(false);

  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (old.value.length == 0)
      errors.value.push("Please enter your old.");

    if (new1.value.length == 0)
      errors.value.push("Please enter a new password.");
    else if (new2.value.length == 0)
      errors.value.push("Please verify your password.");
    else if (new1.value != new2.value)
      errors.value.push("Sorry, those passwords do not match.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate()) return;

    const success = await authExecutor(
      user.value.updatePassword(new1.value)
    );

    if (success) refreshUser();
  }

  return {
    passwordShown: shown,
    passwordForm: reactive({ old, new1, new2, hidden, errors, submit }),
  };
}


export default defineComponent({
  components: { PasswordField },
  setup() {
    return { user, ...useChangeEmailForm(), ...useChangePasswordForm() };
  }
});
</script>

<style lang="scss" scoped>
.account-row {
  display: grid;
  align-items: flex-start;
  grid-template-columns: 7em 2fr 1fr;
  column-gap: 1em;

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