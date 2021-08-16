<template>

  <nav>
    <router-link to="/">
      <h1>Cotera<span>.io</span></h1>
    </router-link>
    <router-link to="/about">about &amp; faq</router-link>
    <router-link to="/login" v-if="!isSignedIn">log in</router-link>
    <router-link to="/account" v-else>account</router-link>
  </nav>

  <router-view />

  <footer v-if="showFooter">

    <div class="footer-links">
      <router-link to="/about">about &amp; faq</router-link>
      <router-link to="/login" v-if="!isSignedIn">log in</router-link>
      <router-link to="/account" v-else>account</router-link>
    </div>

    <div class="footer-links">
      <a href="https://buymeacoffee.com/matthewbrown" target="_blank">donate</a>
      <a href="https://github.com/matthew-e-brown/cotera.io/issues" target="_blank">report a bug</a>
      <a href="https://github.com/matthew-e-brown/cotera.io" target="_blank">view source code</a>
      <a href="mailto:matthew.e.brown.17@gmail.com?subject=Question/Concern about Cotera.io" target="_blank">contact</a>
    </div>

    <div class="copyright">
      <em>The Legend of Zelda</em> and <em>amiibo</em> are trademarks of
      Nintendo.
    </div>
    <div class="copyright">&copy; 2020-2021 Matthew Brown.</div>

    <div class="version">
      v{{ semver }} &middot; <a :href="tree">{{ shortCommit }}</a>
    </div>

  </footer>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import store from '@/store';

import router from '@/router';

export default defineComponent({
  name: 'Cotera.io',
  setup() {
    const isSignedIn = computed(() => store.state.userID !== null);

    const showFooter = computed(() => {
      return (
        router.currentRoute.value.name == 'Home' ||
        router.currentRoute.value.name == 'About'
      );
    });

    const commit: string = process.env.VUE_APP_COMMIT;
    const semver: string = process.env.VUE_APP_SEMVER;

    const shortCommit = commit.substring(0, 7);
    const tree = `https://github.com/matthew-e-brown/cotera.io/tree/${commit}`;

    return { isSignedIn, showFooter, semver, shortCommit, tree };
  }
});
</script>

<style scoped lang="scss">
h1 {
  margin: 0;
  font-size: 2.4rem;

  span {
    font-size: 40%;
  }
}

nav {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  height: var(--nav-height);
  padding: 1rem 4rem;

  position: sticky;
  z-index: 5;
  top: 0;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }

  a {
    text-decoration: none;

    // "Cotera.io" link
    &:first-child {
      margin-right: auto;
    }

    // Other nav links
    &:not(:first-child) {
      cursor: pointer;
      color: $fg-color;
      margin-left: 1.85em;
      padding-top: 0.225em;
      white-space: nowrap;

      @media (max-width: $break-small + 40px) {
        font-size: 86%;
      }
    }
  }

  @media (max-width: $break-mobile) {
    border-bottom: 0.3rem double $border-color;
    padding: 1rem 2rem;

    align-items: flex-end;
  }

  @media (max-width: $break-small) {
    padding: 0.80rem 1.35rem;
  }

  @media (max-width: $break-tiny + 10px) {
    h1 {
      font-size: 1.6rem;
    }

    a:not(:first-child) {
      margin-left: 1.25em;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }
}

footer {
  text-align: center;

  color: $fg-color-dim;
  background-color: $bg-color;

  font-size: 86%;
  padding: 3.25em 3.5em 1em;
  margin-top: 5.50rem;

  .footer-links {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;

    a { margin: 0.75rem 1rem; }

    max-width: max-content;
    margin: 1rem auto 0;
    padding: 0 1rem;

    +.footer-links {
      padding-top: 1rem;
      border-top: 0.1rem solid $bg-color-accent;
    }
  }

  .copyright {
    color: adjust-color($fg-color-dimmer, $lightness: 12%);

    margin: 2rem 0 0;
    +.copyright { margin: 0.5rem 0 2.25rem; }
  }
}
</style>