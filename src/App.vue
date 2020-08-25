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
}

:root {
  font-family: 'Epilogue', Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.065ch;
  color: var(--body-text);
  background-color: #312626;
}

@media screen and (max-width: 400px) {
  :root {
    font-size: 12px;
  }
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Calamity', 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: initial;
}

a, a:visited {
  font: inherit;
  color: inherit;
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
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 4rem;
  background-color: #00000077;
}

nav a, nav button {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

nav a:first-child {
  margin-right: auto;
}
</style>