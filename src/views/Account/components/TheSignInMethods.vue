<template>
  <div class="split-buttons">

    <button
      class="icon-button"
      @click="googleClick"
      :tabindex="sessionOpen ? 0 : -1"
      :disabled="!sessionOpen"
    >
      <fa-icon :icon="[ 'fab', 'google' ]" fixed-width />
      <span v-if="hasGoogle">Unlink Google account</span>
      <span v-else>Link Google account</span>
    </button>

    <button
      class="icon-button"
      @click="emailClick"
      :tabindex="sessionOpen ? 0 : -1"
      :disabled="!sessionOpen"
    >
      <fa-icon icon="envelope" fixed-width />
      <span v-if="hasEmail">Unlink email &amp; password</span>
      <span v-else>Link email &amp; password</span>
    </button>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useAuthFlow, useThirdPartyAuth } from '@/auth/hooks';
import { sessionOpen } from '@/auth/session';

import user, { hasEmail, hasGoogle, refreshUser } from '../user';
import { ModalPayload, ModalReasons } from '../types';

export default defineComponent({
  emits: {
    'open-modal': (payload: ModalPayload) => {
      return (payload as object).hasOwnProperty('reason');
    }
  },
  setup(_, { emit }) {
    const errors = ref<string[]>([]);

    const { link } = useThirdPartyAuth();
    const { authExecutor } = useAuthFlow({ errors });

    const googleClick = async () => {
      errors.value = [];

      // hasGoogle; unlinking
      if (hasGoogle.value) {
        if (!hasEmail.value) {
          errors.value.push(
            "Please add an email & password to your account before unlinking " +
            "your Google account."
          );
          return;
        }

        emit('open-modal', {
          reason: ModalReasons.UnlinkProvider,
          data: "Google account",
          callback: async () => {
            const success = await authExecutor(user.value.unlink('google.com'));
            if (success) refreshUser();
          },
        });
      }

      // !hasGoogle; linking
      else {
        const success = await authExecutor(link());
        if (success) refreshUser();
      }
    }

    const emailClick = async () => {
      errors.value = [];

      // unlinking email
      if (hasEmail.value) {
        if (!hasGoogle.value) {
          errors.value.push(
            "Please link a Google account before unlinking your email & " +
            "password."
          );
          return;
        }

        emit('open-modal', {
          reason: ModalReasons.UnlinkProvider,
          data: "email & password",
          callback: async () => {
            const success = await authExecutor(user.value.unlink('password'));
            if (success) refreshUser();
          },
        })
      }

      // linking email
      else {
        emit('open-modal', { reason: ModalReasons.LinkEmailPassword });
      }
    }

    return { hasEmail, hasGoogle, sessionOpen, googleClick, emailClick };
  }
});
</script>