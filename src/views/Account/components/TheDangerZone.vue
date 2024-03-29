<template>
  <p>These actions are irreversible.</p>

  <div class="split-buttons">

    <button
      type="button"
      class="danger-button"
      ref="resetButton"
      @click="deleteData"
    >Delete data</button>

    <button
      type="button"
      class="danger-button"
      ref="deleteButton"
      @click="deleteUser"
    >Delete account</button>

  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

import router from '@/router';

import store from '@/store';
import { removeLists, removeUserData } from '@/store/cloud';
import { useAuthFlow } from '@/auth-hooks';
import { errorHandler } from '../recent-handler';
import { ModalPayloadKey, ModalReason, UserDataKey } from '../types';

export default defineComponent({
  setup() {
    const { user } = inject(UserDataKey)!;
    const modalPayload = inject(ModalPayloadKey)!;

    const deleteButton = ref<HTMLButtonElement>();
    const resetButton = ref<HTMLButtonElement>();

    const { authExecutor } = useAuthFlow({ errorHandler });

    const deleteData = () => {
      resetButton.value?.blur();

      modalPayload.value = {
        reason: ModalReason.WarningReset,
        callback: async () => {
          // assert non-null since this cannot be null while signed in
          await Promise.all([
            removeLists(
              store.state.userID!,
              store.state.listInfo.map(info => info.id)
            ),
            removeUserData(
              store.state.userID!
            )
          ]);

          modalPayload.value = null;
        }
      }
    }

    const deleteUser = () => {
      deleteButton.value?.blur();

      modalPayload.value = {
        reason: ModalReason.WarningDelete,
        callback: () => {
          modalPayload.value = {
            reason: ModalReason.WarningDeleteFinal,
            callback: async () => {
              await Promise.all([
                removeLists(
                  store.state.userID!,
                  store.state.listInfo.map(info => info.id)
                ),
                removeUserData(
                  store.state.userID!
                )
              ]);

              const execute = async () => {
                const success = await authExecutor(user.value.delete());
                if (success) await router.push({ name: 'Home' });
              }

              execute().catch(() => {
                modalPayload.value = {
                  reason: ModalReason.Reauthorize,
                  callback: execute
                }
              });
            }
          }
        }
      }
    }

    return { deleteData, deleteUser, resetButton, deleteButton }
  }
});
</script>