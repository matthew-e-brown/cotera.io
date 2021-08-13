<template>
  <h2>Reset Password</h2>

  <form @submit.prevent="submit">

    <div class="row">
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Email address"
        autocomplete="email"
        v-model="email"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <p class="notice" v-if="success">
      Please check your email for a link to reset your password.
    </p>

    <button type="submit" class="button">Send reset email</button>

  </form>

  <div class="separator"><span>or</span></div>

  <div class="bottom-buttons">
    <router-link to="/login">Return to login</router-link>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Don't need the whole AuthExecutor flow, just need the fallback error handler,
// since all we're doing is sending a single email
import { fallbackHandler } from '@/auth-hooks';

export default defineComponent({
  name: 'ResetPasswordForm',
  setup() {
    const email = ref("");
    const errors = ref<string[]>([]);
    const success = ref(false);

    const submit = async () => {
      errors.value = [];

      if (email.value.length == 0) {
        errors.value.push("Please enter an email address.");
        return;
      }

      if (success.value) {
        errors.value.push("An email has already been sent.")
        return;
      }

      try {
        await firebase.auth().sendPasswordResetEmail(email.value);
        success.value = true;
      } catch (error) {
        fallbackHandler(error);
      }
    }

    return { email, errors, success, submit };
  }
});
</script>
