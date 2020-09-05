<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <section>
      <h3>Email &amp; Password</h3>
      <!-- !! ------------------ Start of hasEmail ------------------ !! -->
      <template v-if="hasEmail">
        <!-- Email row -->
        <div class="account-row" :class="{update: email.state == 'update'}">
          <div>Email</div>
          <div v-if="email.state != 'update'">{{ emailAddress }}</div>
          <form v-else @submit.prevent="changeEmail">
            <input
              id="new-email"
              type="text"
              name="email"
              placeholder="New email address"
              autocomplete="email"
              v-model="email.new"
            >
            <div class="form-buttons">
              <button
                class="button"
                type="submit"
              >Save</button>
              <button
                class="button"
                type="button"
                @click="cancelEmailChange"
              >Cancel</button>
            </div>
          </form>
          <button
            v-if="email.state != 'update'"
            class="button"
            @click="email.state = 'update'"
          >Change</button>
        </div>
        <!-- Password Row -->
        <div class="account-row" :class="{update: password.state == 'update'}">
          <div>Password</div>
          <div v-if="password.state == 'initial'">
            &ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;
          </div>
          <div v-else-if="password.state == 'success'" class="success">
            Password changed successfully!
          </div>
          <form v-else @submit.prevent="changePassword">
            <PasswordField
              ref="password1"
              id="old-password"
              name="old-password"
              placeholder="Current password"
              autocomplete="current-password"
              v-model="password.old"
              @change="passwordToggle"
            />
            <PasswordField
              ref="password2"
              id="new-password-1"
              name="new-password-1"
              placeholder="New password"
              autocomplete="new-password"
              v-model="password.new1"
              @change="passwordToggle"
            />
            <PasswordField
              ref="password3"
              id="new-password-2"
              name="new-password-2"
              placeholder="Re-type new password"
              autocomplete="new-password"
              v-model="password.new2"
              @change="passwordToggle"
            />
            <ul v-if="password.errors.length" class="errors">
              <li v-for="(error, i) in password.errors" :key="i">
                {{ error }}
              </li>
            </ul>
            <div class="form-buttons">
              <button
                class="button"
                type="submit"
              >Save</button>
              <button
                class="button"
                type="button"
                @click="cancelPasswordChange"
              >Cancel</button>
            </div>
          </form>
          <button
            v-if="password.state != 'update'"
            class="button"
            @click="password.state = 'update'"
          >Change</button>
        </div>
      </template>
      <!-- !! ------------------ End of hasEmail ------------------ !! -->
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
import PasswordField from '@/components/PasswordField.vue';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  components: { PasswordField },
  data: function() {
    return {
      email: {
        state: 'initial',
        new: '',
        errors: []
      },
      password: {
        state: 'initial',
        old: '',
        new1: '',
        new2: '',
        errors: [],
      }
    }
  },
  computed: {
    hasEmail: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.some(p => p.providerId == 'password');
    },
    emailAddress: function() {
      const { providerData } = firebase.auth().currentUser;
      return providerData.find(p => p.providerId == 'password').email;
    }
  },
  methods: {
    passwordToggle: function(value) {
      this.$refs.password1.set(value);
      this.$refs.password2.set(value);
      this.$refs.password3.set(value);
    },
    cancelPasswordChange: function() {
      this.password.state = 'initial';
      this.password.old = '';
      this.password.new1 = '';
      this.password.new2 = '';
    },
    cancelEmailChange: function() {
      this.email.state = 'initial';
      this.email.new = '';
    },
    changePassword: async function() {
      this.password.errors = [];

      if (this.password.old == '')
        this.password.errors.push("Please type your current password.");
      else if (this.password.new1 == '')
        this.password.errors.push("Please enter a password.");
      else if (this.password.new2 == '')
        this.password.errors.push("Please verify your password.");
      else if (this.password.new1 != this.password.new2)
        this.password.errors.push("Those passwords do not match.");

      const { email } = firebase.auth().currentUser;
      const credential = firebase.auth
        .EmailAuthProvider
        .credential(email, this.password.old);

      try {
        await firebase.auth()
          .currentUser
          .reauthenticateWithCredential(credential);
      } catch (err) {
        if (err.code == 'auth/wrong-password') {
          this.password.errors.push("Your current password is incorrect.");
        } else {
          console.log(err);
          this.password.errors.push("Something went wrong: " + err.message);
        }
        
        return false;
      }
      
      try {
        await firebase.auth().currentUser.updatePassword(this.password.new1);
      } catch (err) {
        console.log(err);
        this.password.errors.push("Something went wrong: " + err.message);
        return false;
      }

      this.password.state = 'success';
      return true;
    },
    changeEmail: function() {
      return false;
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
    padding: 2rem 5rem 4rem;
  }
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

section {
  font-size: 0.9em;
}

.account-row {
  margin: 0.85rem 0;
  display: grid;
  grid-template-columns: 7rem 2fr 1fr;
  column-gap: 1em;
  align-items: flex-start;
}

.account-row>div {
  margin-top: 1.4em;
}

.account-row>:nth-child(2) {
  color: var(--body-text-1);
}

.account-row:not(.update)>:nth-child(2) {
  overflow-x: hidden;
  word-wrap: none;
  text-overflow: ellipsis;
}

.account-row input,
.account-row >>> .hide-input {
  margin-top: 0.4em;
}

.account-row input+input,
.account-row >>> .hide-input+.hide-input {
  margin-top: 0.85em;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  flex-flow: row nowrap;
  margin-top: 1em;
}

.form-buttons button {
  margin: 0;
}

.form-buttons button:last-child {
  margin-left: 1em;
  border: none;
}

@media (max-width: 770px) {
  .account-row {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "h h h"
      "e e b";
  }

  .account-row.update {
    row-gap: 0.85em;
    grid-template-areas:
      "h h h"
      "e e e"
      "b b b"
  }

  .account-row>*:nth-child(1) { grid-area: h; }
  .account-row>*:nth-child(2) { grid-area: e; }
  .account-row>*:nth-child(3) { grid-area: b; }

  .form-buttons {
    justify-content: flex-end;
  }
}
</style>