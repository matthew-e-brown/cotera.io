<template>
  <main id="login" :class="{ 'signup': isSignUp }">
    <h2 v-if="!isSignUp">Log in</h2>
    <h2 v-else>Sign up</h2>
    <form v-if="!isSignUp" @submit.prevent="login">
      <div class="row">
        <div>
          <label for="email">Email address</label>
          <input
            id="email"
            type="text"
            name="email"
            autocomplete="email"
            v-model="loginForm.email"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            :type="passtype"
            autocomplete="current-password"
            v-model="loginForm.password"
          >
        </div>
      </div>
      <button class="button" type="submit">Log in</button>
    </form>
    <form v-else @submit.prevent="signup">
      <div class="row">
        <div>
          <label for="display-name">Display name</label>
          <input
            id="display-name"
            type="text"
            name="display-name"
            v-model="signupForm.displayName"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <label for="email-1">Email address</label>
          <input
            id="email-1"
            type="text"
            name="email-1"
            autocomplete="email"
            v-model="signupForm.email"
          >
        </div>
        <div>
          <label for="email-2">Re-type email address</label>
          <input
            id="email-2"
            type="text"
            name="email-2"
            autocomplete="email"
            v-model="signupForm.verifyEmail"
          >
        </div>
      </div>
      <div class="row">
        <div>
          <label for="password-1">Password</label>
          <input
            id="password-1"
            name="password-1"
            :type="passtype"
            autocomplete="new-password"
            v-model="signupForm.password"
          >
        </div>
        <div>
          <label for="password-2">Re-type password</label>
          <input
            id="password-2"
            name="password-2"
            :type="passtype"
            autocomplete="new-password"
            v-model="signupForm.verifyPassword"
          >
        </div>
      </div>
      <button class="button" type="submit">Create account</button>
    </form>
    <div class="separator"><span>or</span></div>
    <div id="bottom-buttons">
      <button v-if="!isSignUp" class="button" @click="toggle">Create a new account</button>
      <button v-else class="button" @click="toggle">Log into an existing account</button>
      <button class="button" @click="google">Sign in with Google</button>
    </div>
  </main>
</template>

<script>
export default {
  data: function() {
    return {
      isSignUp: false,
      passtype: 'password',
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        displayName: '',
        email: '',
        verifyEmail: '',
        password: '',
        verifyPassword: '',
      }
    }
  },
  methods: {
    toggle: function() {
      this.isSignUp = !this.isSignUp;
      this.passtype = 'password';
    },
    login: function() {

    },
    signup: function() {

    },
    google: function() {

    }
  }
}
</script>

<style scoped>
main {
  background-color: #00000077;
  margin: 2rem auto;
  padding: 2.4rem 2.75rem;
  border-radius: 1rem;
  max-width: calc(20rem + 5vw);
}

main.signup {
  max-width: calc(30rem + 5vw);
}

h2 {
  margin-top: 0;
  font-size: 1.8rem;
  text-align: center;
}

label, input {
  box-sizing: border-box;
  display: block;
  width: 100%;
}

label {
  padding-left: 0.75em;
  margin-bottom: 0.5em;
}

input {
  padding: 0.75em 1em;
  border-radius: 0.4rem;
  border: 0;
}

form button {
  margin-left: auto;
  margin-right: 0;
}

form .row {
  margin: 1.25rem 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

form .row>* {
  flex: 1 0 0;
  margin: 0 0.85rem;
}

form .row>*:first-child {
  margin-left: 0;
}

form .row>*:last-child {
  margin-right: 0;
}

div.separator {
  cursor: default;
  box-sizing: border-box;
  width: 80%;
  margin: 2rem auto;
  font-style: italic;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

div.separator span {
  margin-left: 1em;
  margin-right: 1em;
}

div.separator::before, div.separator::after {
  content: "";
  flex: 1 1 0;
  height: 0.1em;
  background-color: var(--body-text);
  border-radius: 9999px;
}

#bottom-buttons {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

#bottom-buttons button {
  width: 60%;
}
</style>