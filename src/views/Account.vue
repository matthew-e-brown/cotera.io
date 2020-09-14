<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <section>
      <h3 class="line">Email &amp; Password</h3>
      <!-- !! Start of hasEmail !! -->
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
      <!-- !! End of hasEmail !! -->
    </section>
    <section>
      <h3 class="line">Sign-in Methods</h3>
      <div id="sign-in">
        <GoogleSignIn v-if="!hasGoogle" @finish="refresh" mode="link" />
        <button v-else @click="unlinkGoogle" class="button icon-button">
          <fa-icon :icon="[ 'fab', 'google' ]" />
          <span>Unlink Google account</span>
        </button>
        <router-link
          v-if="!hasEmail"
          to="/register/account-link"
          class="button icon-button"
        >
          <fa-icon icon="envelope" class="fa-fw" />
          <span>Link email &amp; password</span>
        </router-link>
        <button v-else @click="unlinkEmail" class="button icon-button">
          <fa-icon icon="envelope" class="fa-fw" />
          <span>Unlink email &amp; password</span>
        </button>
      </div>
      <ul class="errors" v-if="showSignInErrors">
        <li v-if="!hasGoogle">
          Please link a Google account before unlinking your email address.
        </li>
        <li v-if="!hasEmail">
          Please link an email address before unlinking your Google account.
        </li>
      </ul>
    </section>
    <section>
      <h3 class="line">Danger Zone</h3>
      <p>These actions are irreversible.</p>
      <div id="danger-zone">
        <button @click="resetProgress" class="button danger">
          Reset progress
        </button>
        <button @click="deleteAccount" class="button danger">
          Delete account
        </button>
      </div>
    </section>
    <transition name='fade'>
      <ConfirmModal
        v-if="modal.show"
        @confirm="modal.confirm"
        @cancel="modal.show = false"
        :show-confirm="modal.showConfirm"
      >
        <h4>Are you sure?</h4>
        <p v-if="modal.message == 'unlink-email'">
          You will need to use your Google account to sign in from now on. You
          can always re-link your email address and password later.
        </p>
        <p v-else-if="modal.message == 'unlink-google'">
          You will need to use your email and password to sign in from now on.
          You can always re-link your Google account later.
        </p>
        <p v-else-if="modal.message == 'reset-progress'">
          This will reset the level on all the pieces of armor on your account
          to zero.
        </p>
        <p v-else-if="modal.message == 'delete-account-1'">
          This will delete your account as well as remove all progress-related
          data from the database.
        </p>
        <p v-else-if="modal.message == 'delete-account-2'">
          Are you <strong>really</strong> sure? Last chance.
        </p>
        <template v-else-if="modal.message == 're-auth'">
          <template v-if="hasEmail && !hasGoogle">
            <p>
              Account deletion failed. Sorry&hellip; since it's been a while
              since you authenticated, please confirm it's you by entering your
              password.
            </p>
            <PasswordField
              id="re-auth-password"
              name="re-auth-password"
              placeholder="Your password"
              autocomplete="current-password"
              v-model="modal.reAuthPassword"
            />
          </template>
          <template v-else-if="!hasEmail && hasGoogle">
            <p>
              Account deletion failed. Sorry&hellip; since it's been a while
              since you authenticated, please confirm it's you by signing in
              with Google account.
            </p>
            <GoogleSignIn @finish="modal.confirm" mode="re-auth" />
            <p class="google-warning">
              If your browser has popups disabled, you will need to go through
              these account deletion steps again once Google is finished and the
              page refreshes. All that matters is that you have signed in
              recently.
            </p>
          </template>
          <template v-else>
            <p>
              Account deletion failed. Sorry&hellip; since it's been a while
              since you authenticated, please confirm it's you by
              re-authenticating with Google or entering your password.
            </p>
            <GoogleSignIn @finish="modal.confirm" mode="re-auth" />
            <p class="google-warning">
              If your browser has popups disabled, you will need to go through
              these account deletion steps again once Google is finished and the
              page refreshes. All that matters is that you have signed in
              recently.
            </p>
            <div class="separator"><span>or</span></div>
            <PasswordField
              id="re-auth-password"
              name="re-auth-password"
              placeholder="Your password"
              autocomplete="current-password"
              v-model="modal.reAuthPassword"
            />
          </template>
        </template>
        <template v-if="modal.message == 're-auth'" v-slot:confirm>
          Submit
        </template>
      </ConfirmModal>
    </transition>
  </main>
</template>

<script>
import PasswordField from '@/components/PasswordField.vue';
import GoogleSignIn from '@/components/GoogleSignIn.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

import { resetProgress, deleteProgress } from '@/store';

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Account',
  components: { PasswordField, GoogleSignIn, ConfirmModal },
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
      modal: {
        show: false,
        confirm: undefined, // set to a function
        showConfirm: true,
        message: "",
        reAuthPassword: ""
      },
      showSignInErrors: false,
    }
  },
  computed: {
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
        this.emailForm.errors.push("Something went wrong: " + err.message);
      }

      this.cancelEmailChange(); // reset fields
      this.$parent.$forceUpdate(); // update email in nav-bar
      this.emailForm.state = 'success';
      return true;
    },
    unlinkEmail: function() {
      if (!this.hasGoogle) {
        this.showSignInErrors = true;
        return false;
      } else {
        this.modal.message = 'unlink-email';
        this.modal.show = true;
        this.modal.confirm = async () => {
          await firebase.auth().currentUser.unlink('password');
          this.refresh();
        }
      }
    },
    unlinkGoogle: function() {
      if (!this.hasEmail) {
        this.showSignInErrors = true;
        return false;
      } else {
        this.modal.message = 'unlink-google';
        this.modal.show = true;
        this.modal.confirm = async () => {
          await firebase.auth().currentUser.unlink('google.com');
          this.refresh();
        }
      }
    },
    resetProgress: function() {
      this.modal.message = 'reset-progress';
      this.modal.show = true;
      this.modal.confirm = async () => {
        await resetProgress();
        this.modal.show = false;
      }
    },
    deleteAccount: function() {
      this.modal.message = 'delete-account-1';
      this.modal.show = true;
      this.modal.confirm = () => {
        this.modal.message = 'delete-account-2';

        this.modal.confirm = async () => {
          await deleteProgress(); // imported
          try {
            await firebase.auth().currentUser.delete();
          } catch (error) {
            if (error.code == 'auth/requires-recent-login') {
              this.modal.message = 're-auth';
              this.modal.confirm = async () => {
                await firebase.auth().currentUser.delete();
              }

              if (this.hasGoogle && !this.hasEmail) {
                // the "confirm" button is just the GoogleSignIn
                this.modal.showConfirm = false;
              }
            } else throw error;
          }
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
  margin-bottom: 1.25em;
}

section {
  font-size: 0.9em;
}

strong {
  font-style: italic;
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
  align-items: stretch;
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

#sign-in+.errors {
  font-size: 100%;
}

.modal-wrapper p, .modal-wrapper button:not(.icon-button) {
  font-size: 92.5%;
}

.modal-wrapper .icon-button {
  margin-left: auto;
  margin-right: auto;
}

.modal-wrapper .hide-input {
  margin-bottom: 0.8em;
}

.modal-wrapper p.google-warning {
  font-size: 70%;
  color: var(--body-text-1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 80ms linear;
}

.fade-enter-to, .fade-leave {
  opacity: 1;
}

.fade-leave-to, .fade-enter {
  opacity: 0;
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