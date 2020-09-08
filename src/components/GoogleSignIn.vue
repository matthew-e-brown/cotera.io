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
          await firebase.auth().currentUser.linkWithPopup(provider);
        } catch (error) {
          if (error.code == 'auth/popup-blocked') {
            await firebase.auth().currentUser.linkWithRedirect(provider);
          } else throw error;
        }
      } catch (error) {
        this.$emit('error', error);
        alert("Could not sign into Google account. Please try again later.");
      }

      this.$emit('finish');
    },
    unlink: async function() {
      await firebase.auth().currentUser.unlink('google.com');
      this.$emit('finish');
    }
  },
  mounted: async function() {
    try {
      const userCred = await firebase.auth().getRedirectResult();
      if (userCred.user) {
        this.$emit('finish');
      }
    } catch (error) {
      this.$emit('error', error);
      alert("Could not sign into Google account. Please try again later");
    }
  }
}
</script>