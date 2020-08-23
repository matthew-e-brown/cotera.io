<template>
  <main id="login">
    <form @submit.prevent="signIn">
      <div>
        <label for="username">Username</label>
        <input type="text" name="username" v-model="formData.username">
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" v-model="formData.password">
      </div>
    </form>
  </main>
</template>

<script>
export default {
  data: function() {
    return {
      state: 'login',
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signIn: function() {

    }
  }
}
</script>