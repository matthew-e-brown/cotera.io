<template>
  <div id="app">
    <nav>
      <router-link to="/" id="home-link">
        <h1>Cotera<span>.io</span></h1>
      </router-link>
      <router-link to="/about">about</router-link>
      <router-link to='/login' v-if="!state.signedin">log in</router-link>
      <router-link to="/account" v-else>account</router-link>
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
  }
}
</script>

<style scoped>
h1 {
  margin: 0;
  font-size: 2.4rem;
}

h1 span {
  font-size: 40%;
}

nav {
  box-sizing: content-box;
  padding: 1rem 4rem;
  height: 3rem;
  position: sticky;
  z-index: 5;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: var(--block-color);
}

nav a {
  text-decoration: none;
}

nav a:first-child {
  margin-right: auto;
}

nav a:not(:first-child) {
  cursor: pointer;
  color: var(--body-text);
  margin-left: 1.85em;
  padding-top: 0.225em;
}

@media (max-width: 770px) {
  nav {
    border-bottom: 0.3rem double var(--block-border);
    padding: 1rem 2rem;
  }

  nav {
    align-items: flex-end;
  }

  nav a:not(:first-child) {
    padding-bottom: 0.25em;
  }
}

@supports (backdrop-filter: blur(10px)) {
  nav {
    background-color: var(--block-color-t);
    backdrop-filter: blur(10px);
  }
}
</style>