<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>
    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-and-password">
      <h3 class="line">Email &amp; Password</h3>

      <template v-if="hasEmail">

        <div class="account-row">
          <div class="header">Email</div>

          <form
            v-if="showEmailForm"
            class="update-form"
            @submit.prevent="emailSubmit"
          >

            <input
              id="new-email"
              type="text"
              name="new-email"
              placeholder="New email address"
              autocomplete="email"
              v-model="emailForm.newEmail"
            />
            <PasswordField
              id="email-password"
              name="email-password"
              placeholder="Current password"
              autocomplete="current-password"
              v-model="emailForm.password"
            />

            <ul class="errors" v-if="emailForm.errors.length > 0">
              <li v-for="(error, i) in emailForm.errors" :key="i">
                {{ error }}
              </li>
            </ul>

            <div class="form-buttons">
              <button
                class="button"
                type="button"
                @click="showEmailForm = false"
              >Cancel</button>
              <button
                class="button"
                type="submit"
              >Save</button>
            </div>

          </form>
          <div v-else class="preview" >{{ rawEmail }}</div>

          <button
            v-if="!showEmailForm"
            type="button"
            class="button"
            @click="showEmailForm = true"
          >Change</button>
        </div>
        <!-- end of email row -->

        <div class="account-row">
          <div class="header">Password</div>

          <form
            v-if="showPasswordForm"
            class="update-form"
            @submit.prevent="passwordSubmit"
          >

            <PasswordField
              id="old-password"
              name="old-password"
              placeholder="Current password"
              autocomplete="current-password"
              v-model:value="passwordForm.old"
              v-model:hidden="passwordForm.hidden"
            ></PasswordField>
            <PasswordField
              id="new-password-1"
              name="new-password-1"
              placeholder="New password"
              autocomplete="new-password"
              v-model:value="passwordForm.new1"
              v-model:hidden="passwordForm.hidden"
            ></PasswordField>
            <PasswordField
              id="new-password-2"
              name="new-password-2"
              placeholder="Re-type password"
              autocomplete="new-password"
              v-model:value="passwordForm.new2"
              v-model:hidden="passwordForm.hidden"
            ></PasswordField>

            <ul class="errors" v-if="passwordForm.errors.length > 0">
              <li v-for="(error, i) in passwordForm.errors" :key="i">
                {{ error }}
              </li>
            </ul>

            <div class="form-buttons">
              <button
                class="button"
                type="button"
                @click="showPasswordForm = false"
              >Cancel</button>
              <button
                class="button"
                type="submit"
              >Save</button>
            </div>

          </form>
          <div v-else class="preview" v-html="'&ast;'.repeat(10)"></div>

          <button
            v-if="!showPasswordForm"
            type="button"
            class="button"
            @click="showPasswordForm = true"
          >Change</button>
        </div>

      </template>
      <!-- end of if has-email -->

      <div v-else>Email &amp; Password are not linked.</div>

    </section>

    <section id="methods">
      <h3 class="line">Sign-in Methods</h3>

      <button
        v-if="hasGoogle"
        class="icon-button"
        @click="unlinkGoogle"
      >
        <fa-icon :icon="[ 'fab', 'google' ]" />
        <span>Unlink Google account</span>
      </button>
      <button
        v-else
        class="icon-button"
        @click="linkGoogle"
      >
        <fa-icon :icon="[ 'fab', 'google' ]" />
        <span>Link Google account</span>
      </button>

      <button
        v-if="hasEmail"
        class="icon-button"
        @click="unlinkEmailAndPassword"
      >
        <fa-icon icon="envelope" />
        <span>Unlink email and password</span>
      </button>
      <button
        v-else
        class="icon-button"
        @click="currentView = ModalView.LinkAccount"
      >
        <fa-icon icon="envelope" />
        <span>Link email and password</span>
      </button>

    </section>

    <section id="danger-zone">
      <h3 class="line">Danger Zone</h3>

      <button
        @click="currentView = ModalView.ResetWarning"
        class="danger-button"
      >Clear account progress</button>
      <button
        @click="currentView = ModalView.DeletionWarning"
        class="danger-button"
      >Delete account</button>

    </section>

    <div id="modal" v-show="currentView !== ModalView.None">
      <div>

        <!-- Link Account -->
        <form
          v-if="currentView === ModalView.LinkAccount"
          class="update-form"
          @submit.prevent="linkEmailSubmit"
        >

          <input
            id="link-email"
            type="text"
            name="link-email"
            placeholder="Email address"
            autocomplete="email"
            v-model="linkEmailForm.email"
          />

          <PasswordField
            id="link-password-1"
            name="link-password-1"
            placeholder="New password"
            autocomplete="new-password"
            v-model:value="linkEmailForm.password1"
            v-model:hidden="linkEmailForm.hidden"
          />
          <PasswordField
            id="link-password-2"
            name="link-password-2"
            placeholder="Re-type password"
            autocomplete="new-password"
            v-model:value="linkEmailForm.password2"
            v-model:hidden="linkEmailForm.hidden"
          />

          <ul class="errors" v-if="linkEmailForm.errors.length > 0">
            <li v-for="(error, i) in linkEmailForm.errors" :key="i">
              {{ error }}
            </li>
          </ul>

          <div class="form-buttons">
            <button
              class="button"
              type="button"
              @click="currentView = ModalView.None"
            >Cancel</button>
            <button
              class="button"
              type="submit"
            >Save</button>
          </div>

        </form>

        <!-- Reset Account Warning -->
        <div v-else-if="currentView === ModalView.ResetWarning"></div>

        <!-- Delete Account Warning -->
        <div v-else-if="currentView === ModalView.DeletionWarning"></div>

        <!-- Delete Account Final Warning -->
        <div v-else-if="currentView === ModalView.DeletionFinal"></div>

      </div>
    </div>

  </main>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, Ref, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow, useThirdPartyAuth } from '@/hooks/auth-flow';
import PasswordField from '@/components/PasswordField.vue';

import '@/assets/styles/forms.scss';


enum ModalView {
  None, LinkAccount, ResetWarning, DeletionWarning, DeletionFinal
}


/**
 * Provides the form data, validation, and execution for updating an email
 * address.
 * @param currentEmail A ref which points to the user's current email address.
 * Used for authenticating to complete the process.
 */
function useChangeEmail(currentEmail: Ref<string | false>) {
  const newEmail = ref("");
  const password = ref("");
  const errors = ref<string[]>([]);

  const hidden = ref(true);
  const done = ref(false);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (newEmail.value.length == 0)
      errors.value.push("Please enter an email address.");

    if (password.value.length == 0)
      errors.value.push("Please enter your password.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate() || currentEmail.value === false) return;

    const cred = firebase.auth.EmailAuthProvider
      .credential(currentEmail.value, password.value);

    let success = await authExecutor(firebase.auth().currentUser!
      .reauthenticateWithCredential(cred));

    if (!success) return;

    success = await authExecutor(firebase.auth().currentUser!
      .verifyBeforeUpdateEmail(newEmail.value));

    if (success) done.value = true;
  }

  return {
    emailForm: reactive({ newEmail, password, errors, hidden }),
    emailDone: done, emailSubmit: submit
  };
}


/**
 * Provides the form data, validation, and execution for updating an account
 * password.
 * @param currentEmail A ref which points to the user's current email address.
 * Used for authenticating to complete the process.
 */
function useChangePassword(currentEmail: Ref<string | false>) {
  const old = ref("");
  const new1 = ref("");
  const new2 = ref("");
  const errors = ref<string[]>([]);

  const hidden = ref(true);
  const done = ref(false);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (old.value.length == 0)
      errors.value.push("Please enter your old password.");
    else if (new1.value.length == 0)
      errors.value.push("Please enter a new password.");
    else if (new2.value.length == 0)
      errors.value.push("Please verify your new password.");
    else if (new1.value != new2.value)
      errors.value.push("Those passwords do not match.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate() || currentEmail.value === false) return;

    const cred = firebase.auth.EmailAuthProvider
      .credential(currentEmail.value, old.value);

    let success = await authExecutor(firebase.auth().currentUser!
      .reauthenticateWithCredential(cred));

    if (!success) return;

    success = await authExecutor(firebase.auth().currentUser!
      .updatePassword(new1.value));

    if (success) done.value = true;
  }

  return {
    passwordForm: reactive({ old, new1, new2, errors, hidden }),
    passwordDone: done, passwordSubmit: submit
  };
}


/**
 * Provides form data, validation, and execution for linking an email and
 * password to the current account.
 * @param currentView A ref which points to a modal's view state--preferably the
 * one this form will be used inside of.
 */
function useLinkEmailAccount(currentView: Ref<ModalView>) {
  const email = ref("");
  const password1 = ref("");
  const password2 = ref("");
  const errors = ref<string[]>([]);

  const hidden = ref(true);
  const done = ref(false);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (email.value.length == 0)
      errors.value.push("Please enter an email address.");

    if (password1.value.length == 0)
      errors.value.push("Please enter a password.");
    else if (password2.value.length == 0)
      errors.value.push("Please verify your password.");
    else if (password1.value != password2.value)
      errors.value.push("Those passwords do not match.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate()) return;

    const cred = firebase.auth.EmailAuthProvider
      .credential(email.value, password1.value);

    const success = await authExecutor(firebase.auth().currentUser!
      .linkWithCredential(cred));

    if (success) {
      await firebase.auth().currentUser!.sendEmailVerification();
      currentView.value = ModalView.None;
      done.value = true;
    }
  }

  return {
    linkEmailForm: reactive({ email, password1, password2, errors, hidden }),
    linkEmailDone: done, linkEmailSubmit: submit
  };
}


function useLinkGoogleAccount() {
  // Really just a sign-in with Google button, just needs the error handling
  const done = ref(false);
  const errors = ref<string[]>([]);

  const { link } = useThirdPartyAuth();
  const { handleRedirection } = useAuthFlow({ errors });

  handleRedirection().then(success => {
    if (success === true) done.value = true;
  });

  return { linkGoogleDone: done, linkGoogle: link };
}


function useUnlinkMethods(currentUser: Ref<firebase.User>) {
  const done = ref(false);

  const unlinkGoogle = async () => {
    await currentUser.value.unlink('google');
    done.value = true;
  }

  const unlinkEmailAndPassword = async () => {
    await currentUser.value.unlink('password');
    done.value = true;
  }

  return { unlinkGoogle, unlinkEmailAndPassword };
}


export default defineComponent({
  name: 'Account',
  components: { PasswordField },
  setup() {
    const showEmailForm = ref(false);
    const showPasswordForm = ref(false);

    // assert non-null (!) because this route is guarded by a navigation guard
    const user = ref(firebase.auth().currentUser!);

    // True/False for if Google is linked to their account
    const hasGoogle = computed(() => {
      return user.value.providerData.some(p => p?.providerId == 'google.com');
    });

    // True/False for if Email & Password are linked to their account
    const hasEmail = computed(() => {
      return user.value.providerData.some(p => p?.providerId == 'password');
    });

    // The email that comes from their Email & Password provider
    const rawEmail = computed(() => {
      // guarded by the above computed property, therefore assert non-null
      if (hasEmail.value) {
        const p = user.value.providerData.find(p => p!.providerId == 'password');
        return p!.email!;
      } else return false;
    });

    // The only "global" account setup we need -- everything else is from the
    // hooks defined above
    const { authExecutor } = useAuthFlow();

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }

    const currentView = ref<ModalView>(ModalView.None);

    return {
      user, rawEmail, signOut,
      hasGoogle, hasEmail,
      showEmailForm, ...useChangeEmail(rawEmail),
      showPasswordForm, ...useChangePassword(rawEmail),
      ModalView, currentView,
      ...useLinkEmailAccount(currentView),
      ...useLinkGoogleAccount(),
      ...useUnlinkMethods(user)
    };
  }
});
</script>

<style scoped lang="scss">
@include standalone-sticky(calc(45rem + 5vw), 5rem, 2rem);

h2 {
  margin-bottom: 1.5rem;
}

h2+p {
  font-size: 75%;
  text-align: center;
  color: $fg-color-dim;

  margin: 1rem 0;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;

  span { font-style: italic; }
}

h2~.button {
  margin: 1rem auto;
  font-size: 75%;
}

h3 {
  margin: 1.25em 0;
}

section {
  margin-top: 2.25rem;
  font-size: 0.9em;
}

.account-row {
  display: grid;
  grid-template-columns: 7em 2fr 1fr;
  align-items: flex-start;
  column-gap: 1em;

  margin: 0.85rem 0;

  &>:nth-child(-n + 2) { margin-top: 1.25em; }

  .header {
    font-weight: 700;
    font-style: italic;
  }

  .preview {
    color: $fg-color-dim;

    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  >.button {
    justify-self: flex-end;
  }
}

#modal {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }

  >div {
    margin: 5em auto;
    width: 72.5%;
  }
}
</style>