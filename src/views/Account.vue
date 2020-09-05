<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
  </main>
</template>

<script>
export default {
  name: 'Account',
  data: function() {
    return {}
  }
}
</script>

<style scoped src="@/assets/styles/forms.css"></style>
<style scoped>
@media (min-width: 770px) {
  main {
    min-width: initial;
    width: calc(45rem + 5vw);
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>