<template>
  <main id="register" class="sticky-box">
    <h2 v-if="!linkMode">Register</h2>
    <h2 v-else>Link Email &amp; Password</h2>
    <form @submit.prevent="submit">
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
      <button
        v-if="!linkMode"
        class="button"
        type="submit"
      >Create account</button>
      <button v-else class="button" type="submit">Link account</button>
    </form>
    <template v-if="requiresAuth">
      <p>
        Sorry&hellip; it's been a while since you signed in. Please
        re-authenticate and try again.
      </p>
      <GoogleSignIn @finish="submit" mode="re-auth" />
    </template>
    <template v-else-if="!linkMode">
      <div class="separator"><span>or</span></div>
      <div id="bottom-buttons">
        <GoogleSignIn />
        <router-link to="/login">Log into an existing account</router-link>
      </div>
    </template>
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
      requiresAuth: false,
      form: {
        email: '',
        password1: '',
        password2: ''
      }
    }
  },
  computed: {
    linkMode: function() {
      return this.$router.currentRoute.name == "AccountLink";
    }
  },
  methods: {
    submit: function() {
      this.linkMode ? this.link() : this.register();
    },
    link: async function() {
      if (!this.validateForm()) return;

      const credential = firebase.auth
        .EmailAuthProvider
        .credential(this.form.email, this.form.password1);

      try {
        const usercred = await firebase.auth().currentUser
          .linkWithCredential(credential);

        usercred.user.sendEmailVerification();
        this.$router.push('/account');
      } catch (error) {
        if (error.code == 'auth/requires-recent-login') {
          this.requiresAuth = true;
        } else {
          if (!error.message.endsWith('.')) error.message += '.';
          this.errors.push(error.message);
        }
      }
    },
    register: async function() {
      if (!this.validateForm()) return;

      try {
        const user = await firebase.auth()
          .createUserWithEmailAndPassword(this.form.email, this.form.password1);

        user.sendEmailVerification();
      } catch (error) {
        // Add a period :P
        if (!error.message.endsWith('.')) error.message += '.';
        this.errors.push(error.message);
      }

    },
    validateForm: function() {
      this.errors = [];

      if (this.form.email.length == 0)
        this.errors.push("Please enter an email address.");

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

p {
  color: var(--red-text);
  margin-top: 1.5rem;
}

/* Re-auth button */
p+.button {
  margin-left: auto;
  margin-right: auto;
}
</style>