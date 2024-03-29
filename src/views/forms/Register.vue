<template>
  <h2>Register</h2>

  <form @submit.prevent="submit">

    <div class="row">
      <input
        id="email"
        type="text"
        name="email"
        placeholder="Email address"
        autocomplete="email"
        v-model="email"
      />
    </div>

    <div class="row">
      <PasswordField
        id="password-1"
        name="password-1"
        placeholder="Password"
        autocomplete="new-password"
        passwordrules="minlength: 12; required: lower; required: upper; required: digit;"
        v-model:value="password1"
        v-model:hidden="hidden"
      />
      <PasswordField
        id="password-2"
        name="password-2"
        placeholder="Re-type password"
        autocomplete="new-password"
        passwordrules="minlength: 12; required: lower; required: upper; required: digit;"
        v-model:value="password2"
        v-model:hidden="hidden"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <button type="submit" class="button">Create Account</button>

  </form>

  <div class="separator"><span>or</span></div>

  <div class="bottom-buttons">
    <button type="button" class="icon-button" @click="googleSubmit">
      <fa-icon :icon="[ 'fab', 'google' ]" fixed-width />
      <span>Sign in with Google</span>
    </button>
    <router-link to="/login">Log into an existing account</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { auth } from '@/firebase';
import {
  createUserWithEmailAndPassword, sendEmailVerification, UserCredential
} from 'firebase/auth';

import router from '@/router';
import PasswordField from '@/components/PasswordField.vue';
import { useAuthFlow, useThirdPartyAuth } from '@/auth-hooks';

export default defineComponent({
  name: 'RegisterForm',
  components: { PasswordField },
  setup() {
    const email = ref("");
    const password1 = ref("");
    const password2 = ref("");
    const errors = ref<string[]>([]);

    const hidden = ref(true);

    const { signIn: googleSignIn } = useThirdPartyAuth();
    const { authExecutor, handleRedirection } = useAuthFlow({ errors });

    const validate = () => {
      errors.value = [];

      if (email.value.length == 0)
        errors.value.push("Please enter an email address.");

      if (password1.value.length == 0)
        errors.value.push("Please enter a password.");
      else if (password2.value.length == 0)
        errors.value.push("Please verify your password.");
      else if (password1.value != password2.value)
        errors.value.push("Those passwords do not match.");

      return errors.value.length == 0;
    }

    const submit = async () => {
      if (!validate()) return;

      const newUserCred = ref<UserCredential>();

      const success = await authExecutor(
        createUserWithEmailAndPassword(auth, email.value, password1.value),
        newUserCred
      );

      if (success) {
        await sendEmailVerification(newUserCred.value!.user);
        await router.push({ name: 'Home' });
      }
    }

    const googleSubmit = async () => {
      const success = await authExecutor(googleSignIn());
      if (success) await router.push({ name: 'Home' });
    }

    handleRedirection().then(success => {
      if (success === true) router.replace({ name: 'Home' });
    });

    return {
      email, password1, password2, errors,
      hidden, submit, googleSubmit
    };
  }
});
</script>