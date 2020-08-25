<template>
  <button class="button" @click="google">Sign in with Google</button>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'GoogleSignIn',
  methods: {
    google: async function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);
      } catch (error) {
        console.error(error);
        alert("Could not sign in.");
      }

      this.$emit('finish');
    }
  }
}
</script>