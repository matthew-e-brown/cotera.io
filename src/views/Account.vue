<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <section>
      <h3>Email &amp; Password</h3>
      <!-- !! ------------------ Start of hasEmail ------------------ !! -->
      <!-- Email row -->
      <template v-if="hasEmail">
        <div class="account-row" :class="{ update: emailForm.state == 'update' }">
          <div><strong>Email</strong></div>
          <div v-if="emailForm.state == 'initial'">{{ emailAddress }}</div>
          <div v-else-if="emailForm.state == 'success'" class="success">
            Email address changed successfully!
          </div>
          <form v-else @submit.prevent="changeEmail">
            <input
              id="new-email"
              type="text"
              name="email"
              placeholder="New email address"
              autocomplete="off"
              v-model="emailForm.new"
            >
            <PasswordField
              id="email-password"
              name="email-password"
              placeholder="Current password"
              autocomplete="current-password"
              v-model="emailForm.password"
            />
            <ul v-if="emailForm.errors.length" class="errors">
              <li v-for="(error, i) in emailForm.errors" :key="i">
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
                @click="cancelEmailChange"
              >Cancel</button>
            </div>
          </form>
          <button
            v-if="emailForm.state != 'update'"
            class="button"
            @click="emailForm.state = 'update'"
          >Change</button>
        </div>
        <!-- Password Row -->
        <div class="account-row" :class="{ update: passwordForm.state == 'update' }">
          <div><strong>Password</strong></div>
          <div v-if="passwordForm.state == 'initial'">
            &ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;&ast;
          </div>
          <div v-else-if="passwordForm.state == 'success'" class="success">
            Password changed successfully!
          </div>
          <form v-else @submit.prevent="changePassword">
            <PasswordField
              ref="password1"
              id="old-password"
              name="old-password"
              placeholder="Current password"
              autocomplete="current-password"
              v-model="passwordForm.old"
              @change="passwordToggle"
            />
            <PasswordField
              ref="password2"
              id="new-password-1"
              name="new-password-1"
              placeholder="New password"
              autocomplete="new-password"
              v-model="passwordForm.new1"
              @change="passwordToggle"
            />
            <PasswordField
              ref="password3"
              id="new-password-2"
              name="new-password-2"
              placeholder="Re-type new password"
              autocomplete="new-password"
              v-model="passwordForm.new2"
              @change="passwordToggle"
            />
            <ul v-if="passwordForm.errors.length" class="errors">
              <li v-for="(error, i) in passwordForm.errors" :key="i">
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
            v-if="passwordForm.state != 'update'"
            class="button"
            @click="passwordForm.state = 'update'"
          >Change</button>
        </div>
      </template>
      <div v-else id="no-email-row">
        <div>
          Sign in with an email &amp; password in addition to Google
        </div>
        <router-link class="button" to="/register/account-link">
          Link
        </router-link>
      </div>
      <!-- !! ------------------ End of hasEmail ------------------ !! -->
    </section>
    <section>
      <h3>Sign-in Methods</h3>
      <div id="sign-in">
        <GoogleSignIn :mode="hasGoogle ? 'unlink' : 'link'" @finish="refresh" />
        <router-link
          v-if="!hasEmail"
          to="/register/account-link"
          class="button icon-button"
        >
          <fa-icon icon="envelope" class="fa-fw" />
          <span>Link email &amp; password</span>
        </router-link>
        <button v-else class="button icon-button" @click="unlinkEmail">
          <fa-icon icon="envelope" class="fa-fw" />
          <span>Unlink email &amp; password</span>
        </button>
      </div>
    </section>
    <section>
      <h3>Danger Zone</h3>
      <div id="danger-zone">
        <button
          class="button"
          :class="{ confirm: reset.state == 'confirm' }"
          @click="resetProgress"
          v-html="resetText"
        />
        <button
          class="button"
          :class="{ confirm: accDelete.state == 'confirm' }"
          @click="deleteAccount"
          v-html="deleteText"
        />
      </div>
    </section>
  </main>
</template>

<script>
import PasswordField from '@/components/PasswordField.vue';
import GoogleSignIn from '@/components/GoogleSignIn.vue';

import { resetProgress, deleteProgress } from '@/store';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  components: { PasswordField, GoogleSignIn },
  data: function() {
    return {
      // declare here to be reactive for computed props
      user: firebase.auth().currentUser,
      emailForm: {
        state: 'initial',
        new: '',
        password: '',
        errors: []
      },
      passwordForm: {
        state: 'initial',
        old: '',
        new1: '',
        new2: '',
        errors: []
      },
      reset: {
        state: 'initial',
        timer: null
      },
      accDelete: {
        state: 'initial',
        timer: null
      },
      needsReauth: false
    }
  },
  computed: {
    resetText: function() {
      switch (this.reset.state) {
        case 'initial': return 'Reset progress';
        case 'confirm': return 'Are you sure?';
        case 'success': return 'Done.';
      }
    },
    deleteText: function() {
      switch(this.accDelete.state) {
        case 'initial': return "Delete account";
        case 'confirm': return "Are you sure?";
      }
    },
    hasEmail: function() {
      const { providerData } = this.user;
      return providerData.some(p => p.providerId == 'password');
    },
    hasGoogle: function() {
      const { providerData } = this.user;
      return providerData.some(p => p.providerId == 'google.com');
    },
    emailAddress: function() {
      const { providerData } = this.user;
      return providerData.find(p => p.providerId == 'password').email;
    }
  },
  methods: {
    refresh: function() {
      this.$set(this.user, firebase.auth().currentUser);
    },
    passwordToggle: function(value) {
      this.$refs.password1.set(value);
      this.$refs.password2.set(value);
      this.$refs.password3.set(value);
    },
    cancelPasswordChange: function() {
      this.passwordForm.state = 'initial';
      this.passwordForm.old = '';
      this.passwordForm.new1 = '';
      this.passwordForm.new2 = '';
    },
    cancelEmailChange: function() {
      this.emailForm.state = 'initial';
      this.emailForm.new = '';
    },
    changePassword: async function() {
      this.passwordForm.errors = [];

      if (this.passwordForm.old == '')
        this.passwordForm.errors.push("Please type your current password.");
      else if (this.passwordForm.new1 == '')
        this.passwordForm.errors.push("Please enter a password.");
      else if (this.passwordForm.new2 == '')
        this.passwordForm.errors.push("Please verify your password.");
      else if (this.passwordForm.new1 != this.passwordForm.new2)
        this.passwordForm.errors.push("Those passwords do not match.");

      if (this.passwordForm.errors.length != 0) return false;

      const { email } = firebase.auth().currentUser;
      const credential = firebase.auth
        .EmailAuthProvider
        .credential(email, this.passwordForm.old);

      try {
        await firebase.auth()
          .currentUser
          .reauthenticateWithCredential(credential);
      } catch (err) {
        if (err.code == 'auth/wrong-password') {
          this.passwordForm.errors.push("Your current password is incorrect.");
        } else {
          console.log(err);
          this.passwordForm.errors.push("Something went wrong: " + err.message);
        }

        return false;
      }

      try {
        await firebase.auth()
          .currentUser
          .updatePassword(this.passwordForm.new1);
      } catch (err) {
        console.log(err);
        this.passwordForm.errors.push("Something went wrong: " + err.message);
        return false;
      }

      this.cancelPasswordChange(); // reset fields
      this.passwordForm.state = 'success';
      return true;
    },
    changeEmail: async function() {
      this.emailForm.errors = [];

      if (this.emailForm.new.length == 0)
        this.emailForm.errors.push("Please enter an email address.");

      if (this.emailForm.errors.length != 0) return false;

      const change = async () => {
        await firebase.auth().currentUser.updateEmail(this.emailForm.new);
        firebase.auth().currentUser.sendEmailVerification();
      }

      try {
        try {
          await change();
        } catch (err) {
          if (err.code == 'auth/requires-recent-login') {
            // Re-auth and try again
            const { email } = firebase.auth().currentUser;
            const credential = firebase.auth
              .EmailAuthProvider
              .credential(email, this.emailForm.password);

            await firebase.auth()
              .currentUser
              .reauthenticateWithCredential(credential);

            await change();
          } else throw err;
        }
      } catch (err) {
        console.log(err);
        this.emailForm.errors.push(err.message);
      }

      this.cancelEmailChange(); // reset fields
      this.$parent.$forceUpdate(); // update email in nav-bar
      this.emailForm.state = 'success';
      return true;
    },
    unlinkEmail: async function() {
      await firebase.auth().currentUser.unlink('password');
      this.refresh();
    },
    resetProgress: function() {
      if (this.reset.state == 'initial') {
        // Set it to "Are you sure?", but change back after 5s
        this.reset.state = 'confirm';
        this.reset.timer = setTimeout(() => {
          this.reset.state = 'initial';
        }, 5000);
      } else if (this.reset.state == 'confirm') {
        // Cancel the timer, so it doesn't expire while confirming
        clearTimeout(this.reset.timer);
        this.reset.timer = null;

        if (confirm("Are you really sure?")) {
          resetProgress();
          this.reset.state = 'success';
        } else {
          this.reset.state = 'initial';
        }
      }
    },
    deleteAccount: async function() {
      if (this.accDelete.state == 'initial') {
        this.accDelete.state = 'confirm';
        this.accDelete.timer = setTimeout(() => {
          this.accDelete.state = 'initial';
        }, 5000);
      } else {
        clearTimeout(this.accDelete.timer);
        this.accDelete.timer = null;

        if (confirm("Are you really sure?")) {
          await deleteProgress();
          try {
            await firebase.auth().currentUser.delete();
          } catch (error) {
            if (error.code == 'auth/needs-recent-login') {
              this.needsReauth = true;
              this.accDelete.state = 'initial';
            }
          }
        } else {
          this.accDelete.state = 'initial';
        }
      }

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
    padding: 2rem 5rem;
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

.account-row, #no-email-row {
  margin: 0.85rem 0;
  display: grid;
  grid-template-columns: 7em 2fr 1fr;
  column-gap: 1em;
  align-items: flex-start;
}

.account-row>div {
  margin-top: 1.4em;
}

.account-row>div:nth-child(2) {
  color: var(--body-text-1);
}

.account-row div.success {
  color: #6cd40d;
}

.account-row>:nth-child(3) {
  justify-self: flex-end;
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

#no-email-row {
  margin: 0;
  align-items: center;
  color: var(--body-text-1);
}

#no-email-row>:first-child {
  grid-column: 1 / span 2;
}

#no-email-row>:last-child {
  justify-self: flex-end;
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

#sign-in, #danger-zone {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

#sign-in .button, #danger-zone .button {
  flex: 1 1 50%;
}

#sign-in>:first-child, #danger-zone>:first-child {
  margin-left: 0;
}

#sign-in>:last-child, #danger-zone>:last-child {
  margin-right: 0;
}

.button:active, .button:focus {
  color: #70b3ff;
  border-color: currentColor;
}

#danger-zone .confirm,
#danger-zone .button:active,
#danger-zone .button:focus {
  color: var(--red-text);
  border-color: currentColor;
}

@media (hover: hover) {
  .button {
    transition:
      color 125ms linear,
      border-color 125ms linear;
  }

  .button:hover {
    color: #70b3ff;
    border-color: currentColor;
  }

  #danger-zone .button:hover {
    color: var(--red-text);
    border-color: currentColor;
  }
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

  #no-email-row {
    grid-template-columns: initial;
    grid-template-rows: 1fr 2fr;
    row-gap: 0.85em;
  }

  #no-email-row>:first-child {
    grid-column: initial;
  }

  .form-buttons {
    justify-content: flex-end;
  }
}
</style>