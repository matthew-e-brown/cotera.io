<template>
  <div class="split-buttons">

    <button class="icon-button" @click="googleClick">
      <fa-icon :icon="[ 'fab', 'google' ]" fixed-width />
      <span v-if="hasGoogle">Unlink Google account</span>
      <span v-else>Link Google account</span>
    </button>

    <button class="icon-button" @click="emailClick">
      <fa-icon icon="envelope" fixed-width />
      <span v-if="hasEmail">Unlink email &amp; password</span>
      <span v-else>Link email &amp; password</span>
    </button>

  </div>

  <ul class="errors" v-if="errors.length > 0">
    <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';

import { useAuthFlow, useThirdPartyAuth } from '@/auth-hooks';
import user, { hasEmail, hasGoogle, refreshUser, errorHandler } from '../user';
import { ModalReason, ModalPayloadKey } from '../types';

export default defineComponent({
  setup() {
    const modalPayload = inject(ModalPayloadKey, ref(null));

    const errors = ref<string[]>([]);

    const { link } = useThirdPartyAuth();
    const { authExecutor } = useAuthFlow({ errors, errorHandler });

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

        const execute = async () => {
          const success = await authExecutor(user.value.unlink('google.com'));
          if (success) refreshUser();
        }

        modalPayload.value = {
          reason: ModalReason.UnlinkProvider,
          extraData: {
            unlinking: "Google account",
            others: "email & password"
          },
          callback: () => {
            execute().catch(() => {
              modalPayload.value = {
                reason: ModalReason.Reauthorize,
                callback: async () => {
                  await execute();
                  modalPayload.value = null;
                }
              }
            });
          }
        }
      }

      // !hasGoogle; linking
      else {
        const execute = async () => {
          const success = await authExecutor(link());
          if (success) refreshUser();
        }

        execute().catch(() => {
          modalPayload.value = {
            reason: ModalReason.Reauthorize,
            callback: async () => {
              await execute();
              modalPayload.value = null;
            }
          }
        });
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

        const execute = async () => {
          const success = await authExecutor(user.value.unlink('password'));
          if (success) refreshUser();
        }

        modalPayload.value = {
          reason: ModalReason.UnlinkProvider,
          extraData: {
            unlinking: "email & password",
            others: "Google account"
          },
          callback: () => {
            execute().catch(() => {
              modalPayload.value = {
                reason: ModalReason.Reauthorize,
                callback: async () => {
                  await execute();
                  modalPayload.value = null;
                }
              }
            });
          }
        }
      }

      // linking email
      else {
        modalPayload.value = { reason: ModalReason.LinkEmailPassword };
      }
    }

    return { hasEmail, hasGoogle, googleClick, emailClick, errors };
  }
});
</script>