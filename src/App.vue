<template>
  <div id="app">
    <h1>Breath of the Wild Armor Tracker</h1>
    <router-view />
  </div>
</template>

<style>
/* CSS Reset */
button {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  background: none;
}

:root {
  --red: #ff7170;
  --body: #fdfbe2;
}

:root {
  font-family: "Calamity Sans", Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: var(--body);
  background-color: gray;
}

h1 {
  font-size: 2.4em;
  text-align: center;
}
</style>
