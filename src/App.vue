<template>
  <div id="app">
    <nav>
      <router-link to="/"><h1>Cotera<span>.io</span></h1></router-link>
      <router-link to="/login" v-if="!state.signedin">Log in</router-link>
      <router-link to="/account" v-else>Your Account</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import state from '@/store';

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