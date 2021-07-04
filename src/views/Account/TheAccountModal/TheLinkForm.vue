<template>
  <p>
    This will let you sign in by using an email address &amp; password in
    addition to your Google account.
  </p>

  <form>
    <div class="row">
      <input
        id="email"
        type="text"
        name="email"
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
        v-model:value="password1"
        v-model:hidden="hidePasswords"
      />
      <PasswordField
        id="password-2"
        name="password-2"
        placeholder="Re-type password"
        autocomplete="new-password"
        v-model:value="password2"
        v-model:hidden="hidePasswords"
      />
    </div>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>
  </form>

  <div class="split-buttons">
    <button class="button" @click="submit">Confirm</button>
    <button class="button" @click="cancel">Cancel</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import PasswordField from '@/components/PasswordField.vue';
import { useAuthFlow } from '@/auth-hooks';

export default defineComponent({
  components: { PasswordField },
  emits: [ 'cancel' ],
  setup(_, { emit }) {
    const email = ref("");
    const password1 = ref("");
    const password2 = ref("");
    const errors = ref<string[]>([]);

    const hidePasswords = ref(true);

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
    }

    const cancel = () => {
      email.value = "";
      password1.value = "";
      password2.value = "";
      errors.value = [];
      emit('cancel');
    }

    return {
      email, password1, password2, hidePasswords, errors, submit, cancel
    };
  }
});
</script>