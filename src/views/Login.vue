<template>
  <main id="login" class="sticky-box">
    <h2>Log in</h2>
    <form @submit.prevent="login">
      <div class="row">
        <input
          id="email"
          type="text"
          name="email"
          placeholder="Email address"
          autocomplete="email"
          v-model="form.email"
        />
      </div>
      <div class="row">
        <PasswordField
          id="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          v-model="form.password"
        />
      </div>
      <div class="row errors" v-if="errors.length">
        <ul>
          <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
        </ul>
      </div>
      <button class="button" type="submit">Log in</button>
    </form>
    <div class="separator"><span>or</span></div>
    <div id="bottom-buttons">
      <GoogleSignIn />
      <router-link to="/register">Create a new account</router-link>
    </div>
  </main>
</template>

<script>
import GoogleSignIn from '@/components/GoogleSignIn.vue';
import PasswordField from '@/components/PasswordField.vue';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  components: { GoogleSignIn, PasswordField },
  data: function() {
    return {
      errors: [],
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login: function() {
      if (!this.validateForm()) return;
      else firebase.auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .catch(error => {
          if (!error.message.endsWith('.')) error.message += '.';
          this.errors.push(error.message);
        });
    },
    validateForm: function() {
      this.errors = [];

      if (this.form.email.length == 0)
        this.errors.push("Please enter an email address.");

      if (this.form.password.length == 0)
        this.errors.push("Please enter a password.");

      return this.errors.length == 0;
    }
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
@media (min-width: 770px) {
  main {
    min-width: initial;
    max-width: 95%;
    width: calc(25rem + 5vw);
  }
}
</style>