<template>
  <main class="sticky-box">
    <h2>Your Account</h2>
    <p>Currently signed in as {{ email }}</p>
    <section>
      <h3>Sign-in Methods</h3>
      <p>Currently registered sign-in methods:</p>
      <ul>
        <li v-if="hasGoogle">Google Account ({{ googleId }})</li>
        <li v-if="hasEmail">Email &amp; password ({{ emailId }})</li>
      </ul>
      <router-link
        class="button"
        v-if="!hasEmail"
        to="/register/account-link"
      >Link email &amp; password</router-link>
      <GoogleSignIn v-else-if="!hasGoogle" />
    </section>
    <button id="signout" class="button" @click="signout">Sign out</button>
  </main>
</template>

<script>
import firebase from '@/firebase';
import GoogleSignIn from '@/components/GoogleSignIn.vue';

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
      return providerData.find(p => p.providerId == 'email');
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

#signout {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
}
</style>