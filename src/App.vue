<template>
  <div id="app">
    <nav>
      <router-link to="/"><h1>Cotera<span>.io</span></h1></router-link>
      <router-link to="/login">Log in</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
/* Small CSS Reset */
button {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  background: none;
}

body {
  margin: 0;
  padding: 0;
}

:root {
  --red-text: #ff7170;
  --body-text: #fdfbe2;
}

:root {
  font-family: Lato, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: var(--body-text);
  background-color: #312626;
}
</style>

<style scoped>
h1 {
  margin: 0;
  font-size: 2.4em;
}

nav {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 4rem;
  background-color: #00000077;
}

nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

nav a:first-child {
  margin-right: auto;
}

h1 span {
  font-size: 40%;
  /* font-style: italic; */
}
</style>