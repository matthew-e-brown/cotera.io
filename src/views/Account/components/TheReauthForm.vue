<template>
  <h3>Log in again</h3>

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
      @click="$emit('close')"
    >Cancel</button>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useAuthFlow, useThirdPartyAuth } from '@/auth/hooks';
import { unlock } from '@/auth/session';

import user, { hasEmail, hasGoogle } from '../user';

import PasswordField from '@/components/PasswordField.vue';

import '@/assets/styles/forms.scss';

export default defineComponent({
  components: { PasswordField },
  emits: [ 'close' ],
  setup(_, { emit }) {
    const email = ref("");
    const password = ref("");

    const errors = ref<string[]>([]);

    const { authExecutor } = useAuthFlow({ errors });
    // 'reauthenticate' simply hangs for some reason?? but this works fine
    const { signIn: signInWithGoogle } = useThirdPartyAuth();

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
        unlock();
        emit('close');
      }
    }

    const googleSubmit = async () => {
      const success = await authExecutor(signInWithGoogle());

      if (success) {
        unlock();
        emit('close');
      }
    }

    return {
      hasEmail, hasGoogle, email, password, submit, googleSubmit, errors
    };
  }
});
</script>

<style scoped lang="scss">
.bottom-buttons button:last-child {
  border: none;
}
</style>