<template>
  <main class="sticky-box">
    <h2>Your Account</h2>
    <p>Currently signed in as {{ email }}</p>
    <button id="signout" class="button" @click="signout">Sign out</button>
    <h3 class="separator"><span>Account Operations</span></h3>
    <section>
      <h4>Sign-in Methods</h4>
      <p>Currently registered sign-in methods:</p>
      <ul>
        <li v-if="hasGoogle">Google Account &mdash; {{ googleId }}</li>
        <li v-if="hasEmail">Email &amp; password &mdash; {{ emailId }}</li>
      </ul>
      <router-link
        class="button"
        v-if="!hasEmail"
        to="/register/account-link"
      >Link email &amp; password</router-link>
      <GoogleSignIn v-else-if="!hasGoogle" link-mode />
    </section>
  </main>
</template>

<script>
import GoogleSignIn from '@/components/GoogleSignIn.vue';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  components: { GoogleSignIn },
  computed: {
    email: function() {
      return firebase.auth().currentUser.email;
    },
    hasGoogle: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.find(p => p.providerId == 'google.com');
    },
    hasEmail: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.find(p => p.providerId == 'password');
    },
    googleId: function() {
      return this.hasGoogle.displayName;
    },
    emailId: function() {
      return this.hasEmail.email;
    }
  },
  methods: {
    signout: function() {
      firebase.auth().signOut().catch(error => {
        console.error(error);
        alert("An error occured. Could not sign out.");
      });
    }
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
@media (min-width: 770px) {
  main {
    min-width: initial;
    width: calc(40rem + 5vw);
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
  margin-bottom: 2.5rem;
}

li {
  margin: 0.8em 0;
}

#signout {
  margin-left: auto;
  margin-right: auto;
}
</style>