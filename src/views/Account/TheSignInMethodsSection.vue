<template>
  <div>
    <button class="icon-button" @click="googleClick">
      <fa-icon :icon="[ 'fab', 'google' ]" />
      <span v-if="hasGoogle">Unlink Google account</span>
      <span v-else>Link Google Account</span>
    </button>

    <button class="icon-button" @click="emailClick">
      <fa-icon icon="envelope" />
      <span v-if="hasEmail">Unlink email &amp; password</span>
      <span v-else>Link email &amp; password</span>
    </button>
  </div>

  <ul v-if="errors.length > 0" class="errors">
    <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useAuthFlow, useThirdPartyAuth } from '@/auth-hooks';
import user, { refreshUser, hasGoogle, hasEmail, errorHandler } from './user';

export default defineComponent({
  emits: [ 'open-link-form', 'needs-re-auth' ],
  setup(_, { emit }) {
    const errors = ref<string[]>([]);

    const { link } = useThirdPartyAuth();
    const { authExecutor, handleRedirection } = useAuthFlow({
      errors,
      errorHandler
    });

    const googleClick = async () => {
      let success = false;
      errors.value = [];

      try {
        // Unlink
        if (hasGoogle.value) {
          if (!hasEmail.value) {
            errors.value.push(
              "Please add an email & password to your account before " +
              "unlinking your Google account."
            );
            return;
          }

          success = await authExecutor(user.value.unlink('google.com'));
        }

        // Link
        else {
          success = await authExecutor(link());
        }
      } catch {
        emit('needs-re-auth');
        return;
      }

      if (success) refreshUser();
    };

    const emailClick = async () => {
      let success = false;
      errors.value = [];

      try {
        // Unlink
        if (hasEmail.value) {
          if (!hasGoogle.value) {
            errors.value.push(
              "Please add a Google account to your account before unlinking " +
              "your email & password."
            );
            return;
          }

          success = await authExecutor(user.value.unlink('password'));
        }

        // Link
        else {
          emit('open-link-form');
        }
      } catch {
        emit('needs-re-auth');
        return;
      }

      if (success) refreshUser();
    }


    handleRedirection().then(success => {
      if (success === true) refreshUser();
    });


    return { user, hasGoogle, hasEmail, googleClick, emailClick, errors };
  }
});
</script>

<style lang="scss" scoped>
div {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}

button {
  flex: 1 1 50%;
  span { font-size: unset; }
}
</style>