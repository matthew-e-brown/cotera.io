<template>
  <div id="app">
    <nav>
      <router-link to="/"><h1>Cotera<span>.io</span></h1></router-link>
      <router-link v-if="!state.signedin" to="/login">Log in</router-link>
      <button v-else @click="signout">Sign out</button>
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
    return {
      state
    }
  },
  methods: {
    signout: async function() {
      try {
        await firebase.auth().signOut();
      } catch (error) {
        console.error(error);
        alert("An error occured. Could not sign out.");
      }
    }
  }
}
</script>

<style>
/* Small CSS Reset */
button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
}

label, input, button {
  font: inherit;
}

body {
  margin: 0;
  padding: 0;
}

:root {
  --red-text: #ff7170;
  --body-text: #fdfbe2;
  --block-color: rgb(14, 10, 6);
  --block-color-t: rgba(14, 10, 6, 0.85);
  --block-color-a: rgba(249, 237, 180, 0.10);
  --block-border: rgba(249, 237, 180, 0.40);
}

:root {
  font-family: 'Epilogue', Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.065ch;
  color: var(--body-text);
  background-color: #312626;
}

#app {
  position: relative;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Calamity', 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: initial;
}

main.middle-box {
  background-color: #00000077;
  margin: 2rem auto;
  padding: 2.4rem 2.75rem;
  border-radius: 1rem;
  max-width: calc(20rem + 5vw);
}

.middle-box h2 {
  margin-top: 0;
  font-size: 1.8rem;
}

a, a:visited {
  font: inherit;
  color: inherit;
}

span.num {
  background-color: var(--block-color);
  color: var(--body-text);
  font-weight: bold;
  padding: 0.25em 0.75em 0.075em 0.75em;
  border: 0.1rem solid var(--block-border);
  border-radius: 0.2em;
}

.button {
  box-sizing: border-box;
  display: block;
  text-decoration: none;
  text-align: center;
  padding: 0.75rem 1rem;
  color: black;
  font-weight: 700;
  background-color: white;
  border-radius: 0.4rem;
  cursor: pointer;
  min-width: 10rem;
  margin: 0.5rem;
}

.separator {
  box-sizing: border-box;
  width: 80%;
  margin: 2rem auto;
  font-family: 'Epilogue', Helvetica, Arial, sans-serif;
  font-style: italic;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.separator>* {
  margin-left: 1em;
  margin-right: 1em;
}

.separator::before, .separator::after {
  content: "";
  flex: 1 1 0;
  height: 0.1em;
  background-color: var(--body-text);
  border-radius: 9999px;
}

div.separator {
  cursor: default;
}

@media screen and (max-width: 430px) {
  :root {
    font-size: 12px;
  }
}
</style>

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
  text-decoration: none;
  color: inherit;
}

@media (max-width: 770px) {
  nav {
    border-bottom: 0.3rem double var(--block-border);
  }
}

@supports (backdrop-filter: blur(10px)) {
  nav {
    background-color: var(--block-color-t);
    backdrop-filter: blur(10px);
  }
}
</style>