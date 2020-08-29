<template>
  <main id="register" class="sticky-box">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="row">
        <input
          id="email-1"
          type="text"
          name="email-1"
          placeholder="Email address"
          autocomplete="email"
          v-model="form.email1"
        />
        <input
          id="email-2"
          type="text"
          name="email-2"
          placeholder="Re-type email address"
          autocomplete="email"
          v-model="form.email2"
        />
      </div>
      <div class="row">
        <PasswordField
          ref="password1"
          id="password-1"
          name="password-1"
          placeholder="Password"
          autocomplete="new-password"
          v-model="form.password1"
          @change="passwordToggle"
        />
        <PasswordField
          ref="password2"
          id="password-2"
          name="password-2"
          placeholder="Re-type password"
          autocomplete="new-password"
          v-model="form.password2"
          @change="passwordToggle"
        />
      </div>
      <div class="row errors" v-if="errors.length">
        <ul>
          <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
        </ul>
      </div>
      <button class="button" type="submit">Create account</button>
    </form>
    <div class="separator"><span>or</span></div>
    <div id="bottom-buttons">
      <GoogleSignIn />
      <router-link to="/login">Log into an existing account</router-link>
    </div>
  </main>
</template>

<script>
import GoogleSignIn from '@/components/GoogleSignIn.vue';
import PasswordField from '@/components/PasswordField.vue';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Register',
  components: { GoogleSignIn, PasswordField },
  data: function() {
    return {
      errors: [],
      form: {
        email1: '',
        email2: '',
        password1: '',
        password2: ''
      }
    }
  },
  methods: {
    register: async function() {
      if (!this.validateForm()) return;

      try {
        await firebase.auth()
          .createUserWithEmailAndPassword(this.form.email1, this.form.password1)
      } catch (error) {
        // Add a period :P
        if (!error.message.endsWith('.')) error.message += '.';
        this.errors.push(error.message);
      }
    },
    validateForm: function() {
      this.errors = [];

      if (this.form.email1.length == 0)
        this.errors.push("Please enter an email address.");
      else if (this.form.email2.length == 0)
        this.errors.push("Please verify your email address.");
      else if (this.form.email1 != this.form.email2)
        this.errors.push("Those email addresses don't match.");

      if (this.form.password1.length == 0)
        this.errors.push("Please enter a password.");
      else if (this.form.password2.length == 0)
        this.errors.push("Please verify your password.");
      else if (this.form.password1 != this.form.password2)
        this.errors.push("Those passwords don't match.");

      return this.errors.length == 0;
    },
    passwordToggle: function(value) {
      // Used to sync visibility of both password fields
      this.$refs.password1.set(value);
      this.$refs.password2.set(value);
    }
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
@media (min-width: 770px) {
  main {
    min-width: initial;
    width: calc(35rem + 5vw);
  }
}
</style>