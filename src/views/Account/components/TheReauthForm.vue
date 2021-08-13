<template>
  <h3>Log in again</h3>

  <p>
    Because this is a sensitive operation, we'd like to ask that you please log
    in again, so we know that it's actually you trying to do this.
  </p>

  <form @submit.prevent="submit" v-if="hasEmail">

    <div class="row">
      <input
        id="email"
        type="text"
        placeholder="Email address"
        autocomplete="email"
        v-model="email"
      />
    </div>

    <div class="row">
      <PasswordField
        id="password"
        placeholder="Password"
        autocomplete="current-password"
        v-model:value="password"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <button type="submit" class="button">Log in</button>

  </form>

  <div v-if="hasEmail && hasGoogle" class="separator"><span>or</span></div>

  <div v-if="hasGoogle" class="bottom-buttons">

    <button
      type="button"
      class="icon-button"
      @click="googleSubmit"
    >
      <fa-icon :icon="[ 'fab', 'google' ]" fixed-width />
      <span>Sign in with Google</span>
    </button>

    <button
      type="button"
      class="button"
      @click="modalPayload = null"
    >Cancel</button>

  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useAuthFlow, useThirdPartyAuth } from '@/auth-hooks';
import { ModalPayloadKey, UserDataKey } from '../types';

import PasswordField from '@/components/PasswordField.vue';


export default defineComponent({
  components: { PasswordField },
  setup() {
    const { user, hasEmail, hasGoogle } = inject(UserDataKey)!;
    const modalPayload = inject(ModalPayloadKey)!;

    const email = ref("");
    const password = ref("");

    const errors = ref<string[]>([]);

    const { authExecutor } = useAuthFlow({ errors });
    const { reauthenticate } = useThirdPartyAuth();

    const validate = () => {
      errors.value = [];

      if (email.value.length == 0)
        errors.value.push("Please enter an email address");

      if (password.value.length == 0)
        errors.value.push("Please enter a password.");

      return errors.value.length == 0;
    }

    const submit = async () => {
      if (!validate()) return;

      const cred = firebase.auth.EmailAuthProvider
        .credential(email.value, password.value);

      const success = await authExecutor(user.value
        .reauthenticateWithCredential(cred));

      if (success) {
        if (modalPayload.value?.callback) modalPayload.value.callback();
        else modalPayload.value = null;
      }
    }

    const googleSubmit = async () => {
      const success = await authExecutor(reauthenticate());
      if (success) {
        if (modalPayload.value?.callback) modalPayload.value.callback();
        else modalPayload.value = null;
      }
    }

    return {
      hasEmail, hasGoogle, email, password, submit, googleSubmit, errors,
      modalPayload
    };
  }
});
</script>

<style scoped lang="scss">
.bottom-buttons button:last-child {
  border: none;
}
</style>