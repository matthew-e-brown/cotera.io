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
        case 're-auth': return this.reauthenticate;
      }
    },
    text: function() {
      switch (this.mode) {
        case 're-auth':
        case 'normal': return "Sign in with Google";
        case 'link': return "Link Google account";
      }
    }
  },
  methods: {
    signin: async function() {
      const provider = new firebase.auth.GoogleAuthProvider();

      try {
        try {
          await firebase.auth().signInWithPopup(provider);
        } catch (error) {
          if (error.code == 'auth/popup-blocked') {
            await firebase.auth().signInWithRedirect(provider);
          } else throw error;
        }
      } catch (error) {
        this.$emit('error', error);
        alert("Could not sign into Google account. Please try again later.");
      }
      
      this.$emit('finish');
    },
    link: async function() {
      const provider = new firebase.auth.GoogleAuthProvider();

      try {
        try {
          await firebase.auth()
            .currentUser
            .linkWithPopup(provider);
        } catch (error) {
          if (error.code == 'auth/popup-blocked') {
            await firebase.auth()
              .currentUser
              .linkWithRedirect(provider);
          } else throw error;
        }
      } catch (error) {
        this.$emit('error', error);
        alert("Could not sign into Google account. Please try again later.");
      }

      this.$emit('finish');
    },
    reauthenticate: async function() {
      const provider = new firebase.auth.GoogleAuthProvider();

      try {
        try {
          await firebase.auth()
            .currentUser
            .reauthenticateWithPopup(provider);
        } catch (error) {
          if (error.code == 'auth/popup-blocked') {
            await firebase.auth()
              .currentUser
              .reauthenticateWithRedirect(provider);
          } else throw error;
        }
      } catch (error) {
        this.$emit('error');
        alert("Could not sign into Google account. Please try again later.");
      }
    }
  },
  mounted: async function() {
    try {
      const userCred = await firebase.auth().getRedirectResult();
      if (userCred.user) {
        this.$emit('finish');
      } // else, do nothing because there was no redirect
    } catch (error) {
      this.$emit('error', error);
      alert("Could not sign into Google account. Please try again later");
    }
  }
}
</script>