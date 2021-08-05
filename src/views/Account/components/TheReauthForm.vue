<template>
  <h3>Sign-in Again</h3>

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
        unlock();
        emit('close');
      }
    }

    const googleSubmit = async () => {
      const success = await authExecutor(reauthenticate());
      if (success) {
        unlock();
        emit('close');
      }
    }

    return { hasEmail, hasGoogle, email, password, submit, googleSubmit };
  }
});
</script>

<style scoped lang="scss">
h3 {
  margin-top: 0;
  text-align: center;
}
</style>