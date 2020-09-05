<template>
  <div id="app">
    <nav>
      <router-link to="/" id="home-link"><h1>Cotera<span>.io</span></h1></router-link>
      <router-link to="/login" v-if="!state.signedin">Log in</router-link>
      <div id="account-links" v-else>
        <div>{{ userID }}</div>
        <div>
          <router-link to="/account" class="account-link">Settings</router-link>
          <button class="account-link" type="button" @click="signout">Sign out</button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import state from '@/store';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'App',
  data: function() {
    return { state }
  },
  computed: {
    userID: function() {
      return firebase.auth().currentUser.email;
    }
  },
  methods: {
    signout: async function() {
      try {
        await firebase.auth().signOut();
      } catch (error) {
        console.error(error);
        alert("Could not sign out. Please try again later.");
      }
    }
  }
}
</script>

<style scoped>
h1 {
  margin: 0;
  font-size: 2.4em;
}

h1 span {
  font-size: 40%;
}

nav {
  box-sizing: content-box;
  padding: 1rem 4rem;
  height: 3rem;
  position: sticky;
  z-index: 2;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  background-color: var(--block-color);
}

nav a, nav button {
  cursor: pointer;
}

nav div {
  text-align: right;
}

nav div .account-link {
  color: var(--body-text-1);
  text-decoration: underline;
  font-size: 80%;
  margin: 0 0.5em;
}

nav div .account-link:last-child {
  margin-right: 0;
}

nav a:not(.account-link) {
  text-decoration: none;
}

#account-links {
  max-width: 52.5%;
}

#account-links>div:first-child {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

@media (max-width: 770px) {
  nav {
    border-bottom: 0.3rem double var(--block-border);
    padding: 1rem 2rem;
  }
}

@supports (backdrop-filter: blur(10px)) {
  nav {
    background-color: var(--block-color-t);
    backdrop-filter: blur(10px);
  }
}
</style>