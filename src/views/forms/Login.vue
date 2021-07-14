<template>
  <h2>Log In</h2>

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
        v-model:value="password"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <button type="submit" class="button">Log in</button>

  </form>

  <div class="separator"><span>or</span></div>

  <div class="bottom-buttons">
    <router-link to="/register">Create a new account</router-link>
    <router-link to="/reset-password">Reset your password</router-link>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import PasswordField from '@/components/PasswordField.vue';
import { useAuthFlow } from '@/auth-hooks';

export default defineComponent({
  name: 'LoginForm',
  components: { PasswordField },
  setup() {
    const email = ref("");
    const password = ref("");
    const errors = ref<string[]>([]);

    const authExecutor = useAuthFlow({ errors });

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

      const success = await authExecutor(firebase.auth()
        .signInWithEmailAndPassword(email.value, password.value));

      if (success) await router.push({ name: 'Home' });
    }

    return { email, password, errors, submit };
  }
});
</script>