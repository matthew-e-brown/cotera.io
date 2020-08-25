<template>
  <main id="login">
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
        <input
          id="password"
          name="password"
          :type="passtype"
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
      <button class="button" @click="google">Sign in with Google</button>
      <router-link to="/register">Create a new account</router-link>
    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data: function() {
    return {
      passtype: 'password',
      errors: [],
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login: async function() {
      if (!this.validateForm()) return false;

      try {
        const data = await firebase.auth()
          .signInWithEmailAndPassword(this.form.email, this.form.password);

        this.$router.push('/');
      } catch (error) {
        console.log(error);

        if (!error.message.endsWith('.')) error.message += '.';
        this.errors.push(error.message);
        return false;
      }
    },
    validateForm: function() {
      this.errors = [];

      if (this.form.email.length == 0)
        this.errors.push("Please enter an email address.");

      if (this.form.password.length == 0)
        this.errors.push("Please enter a password.");

      return this.errors.length == 0;
    },
    google: function() {
      return undefined;
    }
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>