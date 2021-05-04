<template>
  <main id="about-and-faq" class="sticky-box">
    <h2>About &amp; FAQ</h2>

    <section id="about">
      <h3>About</h3>
    </section>

    <section id="faq">
      <h3>FAQ</h3>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
});
</script>

<style scoped lang="scss">
@include standalone-sticky(calc(50rem + 5vw), 4.5rem);

h3 {
  text-align: center;
}
</style>