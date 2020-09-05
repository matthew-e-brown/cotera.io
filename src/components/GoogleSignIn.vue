<template>
  <button class="button" @click="submit">
    <fa-icon :icon="[ 'fab', 'google' ]" />
    <span>Sign in with Google</span>
  </button>
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
    }
  }
}
</script>

<style scoped>
button {
  padding-left: 1.25em;
  padding-right: 1.25em;
  vertical-align: middle;
  display: flex;
  align-items: center;
}

svg {
  font-size: 1.35em;
}

span {
  margin-left: 1em;
}
</style>