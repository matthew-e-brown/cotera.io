<template>
  <main class="sticky-box">
    <h2>Your Account</h2>
    <p>Currently signed in as {{ email }}</p>
    <button id="signout" class="button" @click="signout">Sign out</button>
    <h3>Account Operations</h3>
    <section id="progress">
      <h4 class="separator"><span>Progress</span></h4>
      <button id="reset" class="button" @click="reset">Reset progress</button>
      <p v-if="erased">Progress cleared.</p>
    </section>
    <section id="password-reset" v-if="hasEmail">
      <h4 class="separator"><span>Change Password</span></h4>
      <form @submit.prevent="changePassword">
        <div class="row">
          <PasswordField
            ref="password1"
            id="current-password"
            name="current-password"
            placeholder="Current password"
            autocomplete="current-password"
            v-model="form.current"
            @change="passwordToggle"
          />
        </div>
        <div class="row">
          <PasswordField
            ref="password2"
            id="new-password-1"
            name="new-password-1"
            placeholder="New password"
            autocomplete="new-password"
            v-model="form.new1"
            @change="passwordToggle"
          />
        </div>
        <div class="row">
          <PasswordField
            ref="password3"
            id="new-password-2"
            name="new-password-2"
            placeholder="Re-type new password"
            autocomplete="new-password"
            v-model="form.new2"
            @change="passwordToggle"
          />
        </div>
        <button class="button" type="submit">Change password</button>
      </form>
    </section>
    <section id="sign-in">
      <h4 class="separator"><span>Sign-in Methods</span></h4>
      <p>Currently registered sign-in methods:</p>
      <ul>
        <li v-if="hasGoogle">Google account &mdash; {{ googleId }}</li>
        <li v-if="hasEmail">Email &amp; password &mdash; {{ emailId }}</li>
      </ul>
      <router-link
        class="button"
        v-if="!hasEmail"
        to="/register/account-link"
      >Link email &amp; password</router-link>
      <GoogleSignIn v-else-if="!hasGoogle" link-mode />
      <div v-if="hasGoogle && hasEmail" id="unlink" class="row">
        <button
          class="button"
          @click="unlink($event, 'google.com')"
        >Unlink Google account</button>
        <button
          class="button"
          @click="unlink($event, 'password')"
        >Unlink email &amp; password</button>
      </div>
    </section>
  </main>
</template>

<script>
import GoogleSignIn from '@/components/GoogleSignIn.vue';
import PasswordField from '@/components/PasswordField.vue';
import { resetProgress } from '@/store';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  components: { GoogleSignIn, PasswordField },
  data: function() {
    return {
      email: '',
      hasGoogle: undefined,
      hasEmail: undefined,
      erased: false,
      form: {
        current: '',
        new1: '',
        new2: '',
        errors: []
      }
    }
  },
  computed: {
    googleId: function() {
      return this.hasGoogle.displayName;
    },
    emailId: function() {
      return this.hasEmail.email;
    }
  },
  methods: {
    // To make it reactive when things change
    evaluate: function(user) {
      const { providerData } = user;

      this.email = user.email;
      this.hasGoogle = providerData.find(p => p.providerId == 'google.com');
      this.hasEmail = providerData.find(p => p.providerId == 'password');
    },
    signout: function() {
      firebase.auth().signOut().catch(error => {
        console.error(error);
        alert("An error occured. Could not sign out.");
      });
    },
    reset: function() {
      if (
        confirm("Are you super sure you want to reset progress?") &&
        confirm("Last chance! Reset account progress?")
      ) {
        resetProgress();
        this.erased = true;
      }
    },
    unlink: function(event, providerId) {
      firebase.auth().currentUser.unlink(providerId).then(user => {
        this.evaluate(user);
      });
    },
    changePassword: function() {
      // verify form input

      const credential = firebase.auth
        .EmailAuthProvider
        .credential(firebase.auth().currentUser.email, this.form.current);

      firebase.auth()
        .currentUser
        .reauthenticateWithCredential(credential)
        .then(usercred => usercred.user.updatePassword());
    },
    passwordToggle: function(value) {
      this.$refs.password1.set(value);
      this.$refs.password2.set(value);
      this.$refs.password3.set(value);
    }
  },
  mounted: function() {
    this.evaluate(firebase.auth().currentUser);
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
@media (min-width: 770px) {
  main {
    min-width: initial;
    width: calc(40rem + 5vw);
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

h2 {
  margin-bottom: 0;
}

h2+p {
  margin: 0.5rem 0 1.5rem;
  text-align: center;
  font-style: italic;
  font-size: 0.75em;
}

section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

section:last-of-type {
  margin-bottom: 0;
}

section:last-of-type>:last-child {
  margin-bottom: 0;
}

li {
  margin: 0.8em 0;
}

form {
  margin: 0 auto;
  max-width: 25rem;
}

.button {
  margin-left: auto;
  margin-right: auto;
}

#progress p {
  text-align: center;
}
</style>