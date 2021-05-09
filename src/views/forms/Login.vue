<template>
  <h2>Log in</h2>

  <form @submit.prevent="submit">
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
        v-model="password"
      />
    </div>
    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>
    <button type="submit" class="button">Log in</button>
  </form>

  <div class="separator"><span>or</span></div>

  <div class="bottom-buttons">
    <button type="button" class="icon-button" @click="googleSubmit">
      <fa-icon :icon="[ 'fab', 'google' ]" />
      <span>Sign in with Google</span>
    </button>
    <router-link to="/register">Create a new account</router-link>
    <router-link to="/reset-password">Reset your password</router-link>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';

import firebase from 'firebase/app';
import 'firebase/auth';

import PasswordField from '@/components/PasswordField.vue';

export default defineComponent({
  name: 'LoginForm',
  components: { PasswordField },
  setup() {
    const email = ref("");
    const password = ref("");
    const errors = ref<string[]>([]);

    const google = new firebase.auth.GoogleAuthProvider();

    const validate = () => {
      errors.value = [];

      if (email.value.length == 0)
        errors.value.push("Please enter an email address.");

      if (password.value.length == 0)
        errors.value.push("Please enter a password.");

      return errors.value.length == 0;
    }

    const submit = async () => {
      if (!validate()) return;
      else {
        firebase.auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then(() => router.push({ name: 'Home' }))
          .catch(error => {
            if (!error.message.endsWith('.')) error.message += '.';
            errors.value.push(error.message);
          });
      }
    }

    const googleSubmit = async () => {

    }

    return { email, password, errors, submit };
  }
});
</script>
