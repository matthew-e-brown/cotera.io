<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>
    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-password">
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
              v-model:hidden="passwordDone.hidden"
            ></PasswordField>
            <PasswordField
              id="new-password-1"
              name="new-password-1"
              placeholder="New password"
              autocomplete="new-password"
              v-model:value="passwordForm.new1"
              v-model:hidden="passwordDone.hidden"
            ></PasswordField>
            <PasswordField
              id="new-password-2"
              name="new-password-2"
              placeholder="Re-type password"
              autocomplete="new-password"
              v-model:value="passwordForm.new2"
              v-model:hidden="passwordDone.hidden"
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

      <form
        v-else-if="showLinkForm"
        class="update-form"
        @submit.prevent="linkSubmit"
      >

        <input
          id="link-email"
          type="text"
          name="link-email"
          placeholder="Email address"
          autocomplete="email"
          v-model="linkForm.email"
        />

        <PasswordField
          id="link-password-1"
          name="link-password-1"
          placeholder="New password"
          autocomplete="new-password"
          v-model:value="linkForm.password1"
          v-model:hidden="linkForm.hidden"
        />
        <PasswordField
          id="link-password-2"
          name="link-password-2"
          placeholder="Re-type password"
          autocomplete="new-password"
          v-model:value="linkForm.password2"
          v-model:hidden="linkForm.hidden"
        />

        <ul class="errors" v-if="linkForm.errors.length > 0">
          <li v-for="(error, i) in linkForm.errors" :key="i">
            {{ error }}
          </li>
        </ul>

        <div class="form-buttons">
          <button
            class="button"
            type="button"
            @click="showLinkForm = false"
          >Cancel</button>
          <button
            class="button"
            type="submit"
          >Save</button>
        </div>

      </form>

      <!-- if !has-email -->
      <div v-else>

        Email &amp; Password are not linked.

      </div>

    </section>

    <section id="methods">
      <h3 class="line">Sign-in Methods</h3>

    </section>

    <section id="danger-zone">
      <h3 class="line">Danger Zone</h3>

    </section>

  </main>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, Ref, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import PasswordField from '@/components/PasswordField.vue';
import { useAuthFlow } from '@/hooks/auth-flow';


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
    form: reactive({ newEmail, password, errors, hidden }),
    done, submit
  };
}


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
    form: reactive({ old, new1, new2, errors, hidden }),
    done, submit
  };
}


function useLinkAccount() {
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
      done.value = true;
    }
  }

  return {
    form: reactive({ email, password1, password2, errors, hidden }),
    done, submit
  };
}


export default defineComponent({
  name: 'Account',
  components: { PasswordField },
  setup() {
    const showEmailForm = ref(false);
    const showPasswordForm = ref(false);
    const showLinkForm = ref(false);

    const { authExecutor } = useAuthFlow();

    // assert non-null (!) because this route is guarded by a navigation guard
    const user = computed(() => firebase.auth().currentUser!);

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
      // guard, therefore assert non-null
      if (hasEmail.value) {
        const p = user.value.providerData.find(p => p!.providerId == 'password');
        return p!.email!;
      } else return false;
    });

    const {
      form: emailForm, submit: emailSubmit, done: emailDone
    } = useChangeEmail(rawEmail);

    const {
      form: passwordForm, submit: passwordSubmit, done: passwordDone
    } = useChangePassword(rawEmail);

    const {
       form: linkForm, submit: linkSubmit, done: linkDone
    } = useLinkAccount();

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) router.push({ name: 'Home '});
    }

    return {
      user, hasGoogle, hasEmail, rawEmail,
      showEmailForm, emailForm, emailSubmit, emailDone,
      showPasswordForm, passwordForm, passwordSubmit, passwordDone,
      showLinkForm, linkForm, linkSubmit, linkDone,
      signOut
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
  word-wrap: none;

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
</style>