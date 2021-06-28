<template>

  <div class="account-row">
    <div>Email</div>

    <div v-if="!emailShown">{{ providerEmail }}</div>
    <form @submit.prevent="emailForm.submit" v-else>

    </form>

    <button
      v-if="!emailShown"
      @click="emailShown = true"
      class="button"
    >Change</button>
  </div>

  <div class="account-row">
    <div>Password</div>

    <div v-if="!passwordShown" v-html="'&ast;'.repeat(10)"></div>
    <form @submit.prevent="passwordForm.submit" v-else>

    </form>

    <button
      v-if="!passwordShown"
      @click="passwordShown = true"
      class="button"
    >Change</button>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useAuthFlow } from '@/auth-hooks';
import user, { refreshUser } from "./user";

function useChangeEmailForm() {
  const shown = ref(false);

  const newEmail = ref("");
  const password = ref("");
  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (newEmail.value.length == 0)
      errors.value.push("Please a new email address.");

    if (password.value.length == 0)
      errors.value.push("Please enter your password.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate()) return;

    const success = await authExecutor(
      user.value.updateEmail(newEmail.value)
    );

    if (success) refreshUser();
  }

  return {
    emailShown: shown,
    emailForm: { newEmail, password, errors, submit },
    providerEmail: user.value.providerData
      .find(p => p!.providerId == 'password')! // hasEmail guard -> (!)
      .email
  };
}


function useChangePasswordForm() {
  const shown = ref(false);

  const old = ref("");
  const new1 = ref("");
  const new2 = ref("");
  const errors = ref<string[]>([]);

  const { authExecutor } = useAuthFlow({ errors });

  const validate = () => {
    errors.value = [];

    if (old.value.length == 0)
      errors.value.push("Please enter your old.");

    if (new1.value.length == 0)
      errors.value.push("Please enter a new password.");
    else if (new2.value.length == 0)
      errors.value.push("Please verify your password.");
    else if (new1.value != new2.value)
      errors.value.push("Sorry, those passwords do not match.");

    return errors.value.length == 0;
  }

  const submit = async () => {
    if (!validate()) return;

    const success = await authExecutor(
      user.value.updatePassword(new1.value)
    );

    if (success) refreshUser();
  }

  return {
    passwordShown: shown,
    passwordForm: { old, new1, new2, errors, submit },
  };
}


export default defineComponent({
  setup() {
    return { user, ...useChangeEmailForm(), ...useChangePasswordForm() };
  }
});
</script>

<style lang="scss" scoped>
.account-row {
  display: grid;
  grid-template-columns: 7em 2fr 1fr;
  column-gap: 1em;
}
</style>