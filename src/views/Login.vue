<template>
  <main id="login">
    <h2>Log in</h2>
    <form @submit.prevent="login">
      <div class="row">
        <div>
          <!-- <label for="email">Email address</label> -->
          <input
            id="email"
            type="text"
            name="email"
            placeholder="Email address"
            autocomplete="email"
            v-model="loginForm.email"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <!-- <label for="password">Password</label> -->
          <input
            id="password"
            name="password"
            :type="passtype"
            placeholder="Password"
            autocomplete="current-password"
            v-model="loginForm.password"
          >
        </div>
      </div>
      <button class="button" type="submit">Log in</button>
    </form>
    <div class="separator"><span>or</span></div>
    <div id="bottom-buttons">
      <button class="button" @click="google">Sign in with Google</button>
      <router-link to="/register">Create a new account</router-link>
    </div>
  </main>
</template>

<script>
import '@/assets/styles/forms.css';

export default {
  data: function() {
    return {
      passtype: 'password',
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    google: function() {
      return undefined;
    }
  }
}
</script>

<style scoped>
/* See @/assets/styles/forms for CSS for both Login and Register */
</style>