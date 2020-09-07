<template>
  <button class="button icon-button" @click="submit">
    <fa-icon :icon="[ 'fab', 'google' ]" />
    <span>{{ text }}</span>
  </button>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'GoogleSignIn',
  props: {
    mode: { type: String, required: false, default: "normal" }
  },
  computed: {
    submit: function() {
      switch (this.mode) {
        case 'normal': return this.signin;
        case 'link': return this.link;
        case 'unlink': return this.unlink;
      }
    },
    text: function() {
      switch (this.mode) {
        case 'normal': return "Sign in with Google";
        case 'link': return "Link Google account";
        case 'unlink': return "Unlink Google account";
      }
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
        });
    },
    unlink: function() {
      firebase.auth()
        .currentUser
        .unlink('google.com')
        .then(() => this.$emit('finish'));
    }
  }
}
</script>