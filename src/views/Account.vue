<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <section>
      <h3>Email &amp; Password</h3>
      <template v-if="hasEmail">
        <div class="account-row">
          <span>Email</span>
          <span>{{ emailAddress }}</span>
          <button class="button">Change</button>
        </div>
        <div class="account-row">
          <span>Password</span>
          <span>&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;</span>
          <button class="button">Change</button>
        </div>
      </template>
    </section>
    <section>
      <h3>Progress</h3>
    </section>
    <section>
      <h3>Sign-in Methods</h3>
    </section>
  </main>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  computed: {
    hasEmail: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.some(p => p.providerId == 'password');
    },
    emailAddress: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.find(p => p.providerId == 'password').email;
    }
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

.account-row {
  margin: 0.85rem 0;
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
  column-gap: 1em;
  align-items: center;
}

.account-row>:nth-child(2) {
  color: var(--body-text-1);
  overflow-x: hidden;
  word-wrap: none;
  text-overflow: ellipsis;
}

h3 {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 1.25em;
}

h3::after {
  content: "";
  display: block;
  width: 100%;
  height: 0.1em;
  margin-left: 1em;
  margin-bottom: 0.1em;
  border-radius: 100px;
  flex: 1 1 0;
  align-self: flex-end;
  background-color: var(--block-color-a);
}

@media (max-width: 770px) {
  .account-row {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "h h h"
      "e e b";
  }

  .account-row>*:nth-child(1) { grid-area: h; }
  .account-row>*:nth-child(2) { grid-area: e; }
  .account-row>*:nth-child(3) { grid-area: b; }
}
</style>