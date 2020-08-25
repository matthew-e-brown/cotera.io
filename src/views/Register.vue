<template>
  <main id="register">
    <h2>Register</h2>
    <form @submit.prevent="signup">
      <div class="row">
        <div>
          <!-- <label for="display-name">Display name</label> -->
          <input
            id="display-name"
            type="text"
            name="display-name"
            placeholder="Display name"
            v-model="signupForm.displayName"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <!-- <label for="email-1">Email address</label> -->
          <input
            id="email-1"
            type="text"
            name="email-1"
            placeholder="Email address"
            autocomplete="email"
            v-model="signupForm.email"
          >
        </div>
        <div>
          <!-- <label for="email-2">Re-type email address</label> -->
          <input
            id="email-2"
            type="text"
            name="email-2"
            placeholder="Re-type email address"
            autocomplete="email"
            v-model="signupForm.verifyEmail"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <!-- <label for="password-1">Password</label> -->
          <input
            id="password-1"
            name="password-1"
            :type="passtype"
            placeholder="Password"
            autocomplete="new-password"
            v-model="signupForm.password"
          >
        </div>
        <div>
          <!-- <label for="password-2">Re-type password</label> -->
          <input
            id="password-2"
            name="password-2"
            :type="passtype"
            placeholder="Re-type password"
            autocomplete="new-password"
            v-model="signupForm.verifyPassword"
          >
        </div>
      </div>
      <button class="button" type="submit">Create account</button>
    </form>
    <div class="separator"><span>or</span></div>
    <div id="bottom-buttons">
      <button class="button" @click="google">Sign in with Google</button>
      <router-link to="/login">Log into an existing account</router-link>
    </div>
  </main>
</template>

<script>
import '@/assets/styles/forms.css';

export default {
  name: 'Register',
  data: function() {
    return {
      passtype: 'password',
      signupForm: {
        displayName: '',
        email: '',
        verifyEmail: '',
        password: '',
        verifyPassword: ''
      }
    }
  },
  methods: {
    google: function() {
      return undefined;
    }
  }
}
</script>

<style scoped>
main {
  max-width: calc(30rem + 5vw);
}
</style>