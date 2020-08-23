<template>
  <div id="app">
    <h1>Cotera<span>.io</span></h1>
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

:root {
  --red-text: #ff7170;
  --body-text: #fdfbe2;
}

:root {
  font-family: "Calamity Sans", Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: var(--body);
  background-color: gray;
}
</style>
