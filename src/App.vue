<template>
  <nav>
    <router-link to="/">
      <h1>Cotera<span>.io</span></h1>
    </router-link>

    <router-link to="/about">about &amp; faq</router-link>
    <router-link to="/login" v-if="true">log in</router-link>
    <router-link to="/account" v-else>account</router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'Cotera.io'
};
</script>

<style scoped lang="scss">
h1 {
  margin: 0;
  font-size: 2.4rem;

  span {
    font-size: 40%;
  }

  @media (max-width: $break-x-small - 30px) {
    font-size: 1.6rem;
  }
}


nav {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  height: $nav-height;
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

      @media (max-width: $break-medium) {
        padding-bottom: 0.25em;
      }

      @media (max-width: $break-small + 40px) {
        font-size: 90%;
      }

      @media (max-width: $break-x-small - 30px) {
        margin-left: 1.25em;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  @media (max-width: $break-medium) {
    border-bottom: 0.3rem double $border-color;
    padding: 1rem 2rem;

    align-items: flex-end;
  }
}
</style>
