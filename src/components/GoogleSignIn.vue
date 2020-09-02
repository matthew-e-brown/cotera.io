<template>
  <button class="button" @click="submit">{{ text }}</button>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'GoogleSignIn',
  props: {
    linkMode: { type: Boolean, required: false, default: false }
  },
  computed: {
    submit: function() {
      return this.linkMode ? this.link : this.signin;
    },
    text: function() {
      return this.linkMode ? "Link Google account" : "Sign in with Google";
    }
  },
  methods: {
    signin: function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth()
        .signInWithRedirect(provider)
        .then(() => this.$emit('finish'))
        .catch(error => {
          this.$emit('error', error);
          alert("Could not sign into Google account. Please try again later.");
        });
    },
    link: function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth()
        .currentUser
        .linkWithRedirect(provider)
        .then(() => this.$emit('finish'))
        .catch(error => {
          this.$emit('error', error);
          alert("Could not sign into Google account. Please try again later.");
        })
    }
  }
}
</script>