<template>
  <h3>Link email &amp; password</h3>

  <form @submit.prevent="submit">

    <div class="row">
      <input
        id="email"
        type="text"
        placeholder="Email address"
        autocomplete="email"
        v-model="email"
      />
    </div>

    <div class="row">
      <PasswordField
        id="password-1"
        name="password-1"
        placeholder="Password"
        autocomplete="new-password"
        passwordrules="minlength: 12; required: lower; required: upper; required: digit;"
        v-model:value="password1"
        v-model:hidden="hidden"
      />
      <PasswordField
        id="password-2"
        name="password-2"
        placeholder="Re-type password"
        autocomplete="new-password"
        passwordrules="minlength: 12; required: lower; required: upper; required: digit;"
        v-model:value="password2"
        v-model:hidden="hidden"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <button type="submit" class="button">Link</button>

  </form>

  <div class="bottom-buttons">

    <button
      type="button"
      class="button"
      @click="modalPayload = null"
    >Cancel</button>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useAuthFlow } from '@/auth-hooks';
import user, { refreshUser, errorHandler } from '../user';
import { ModalPayloadKey, ModalReason } from '../types';

import PasswordField from '@/components/PasswordField.vue';

export default defineComponent({
  components: { PasswordField },
  setup() {
    const modalPayload = inject(ModalPayloadKey, ref(null));

    const email = ref("");
    const password1 = ref("");
    const password2 = ref("");
    const errors = ref<string[]>([]);

    const hidden = ref(true);

    const { authExecutor } = useAuthFlow({ errors, errorHandler });

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

    const submit = () => {
      if (!validate()) return;

      const execute = async () => {
        const cred = firebase.auth.EmailAuthProvider
          .credential(email.value, password1.value);

        const success = await authExecutor(user.value.linkWithCredential(cred));

        if (success) {
          refreshUser();
          modalPayload.value = null;
        }
      }

      execute().catch(() => {
        modalPayload.value = {
          reason: ModalReason.Reauthorize,
          callback: execute
        }
      });
    }

    return {
      email, password1, password2, errors, hidden, submit, modalPayload
    };
  }
});
</script>

<style scoped lang="scss">
.bottom-buttons button:last-child {
  border: none;
}
</style>