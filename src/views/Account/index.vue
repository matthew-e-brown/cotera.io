<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <ul v-if="errors.length > 0" class="errors">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <section id="email-and-password" v-if="hasEmail">
      <h3 class="line">Email &amp; Password</h3>
      <TheEmailPassword />
    </section>

    <section id="sign-in-methods">
      <h3 class="line">Sign-in Methods</h3>
      <TheSignInMethods />
    </section>

    <section id="danger-zone">
      <h3 class="line">The Danger Zone</h3>
      <TheDangerZone />
    </section>

    <template v-if="modalPayload != null">
      <ConfirmModal
        :no-buttons="noButtonModal"
        :swap-buttons="modalPayload.reason == ModalReason.WarningDeleteFinal"
        :container-class="modalPayload.reason"
        @confirm="modalConfirm"
        @cancel="modalPayload = null"
      >

        <h3 v-if="!noButtonModal">Are you sure?</h3>

        <TheReauthForm
          v-if="modalPayload.reason == ModalReason.Reauthorize"
        />

        <TheLinkForm
          v-else-if="modalPayload.reason == ModalReason.LinkEmailPassword"
        />

        <p v-else-if="modalPayload.reason == ModalReason.UnlinkProvider">
          You will no longer be able to log in using your
          {{ modalPayload.extraData.unlinking }}, and will instead need to use
          your {{ modalPayload.extraData.others }}.
        </p>

        <p v-else-if="modalPayload.reason == ModalReason.WarningReset">
          This will delete all armor's levels in all the custom lists you've
          created, as well as clear your settings. You cannot undo this
          action.
        </p>

        <p v-else-if="modalPayload.reason == ModalReason.WarningDelete">
          This will delete all progress- and settings-related data from the
          database then delete your account. You cannot undo this action; you
          will be able to remake your account.
        </p>

        <p v-else-if="modalPayload.reason == ModalReason.WarningDeleteFinal">
          Are you really, <strong>really</strong> sure? This is your last
          chance.
        </p>

        <template
          v-if="modalPayload.reason == ModalReason.WarningDeleteFinal"
          #cancel
        >On second thought&hellip;</template>
        <template
          v-if="modalPayload.reason == ModalReason.WarningDeleteFinal"
          #submit
        >Yes, I'm sure</template>

      </ConfirmModal>
    </template>

  </main>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed, provide } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';

import {
  ModalPayload, ModalReason, ModalPayloadKey, UserDataKey
} from './types';

import ConfirmModal from '@/components/ConfirmModal.vue';

import TheReauthForm from './components/TheReauthForm.vue';
import TheEmailPassword from './components/TheEmailPassword.vue';
import TheSignInMethods from './components/TheSignInMethods.vue';
import TheDangerZone from './components/TheDangerZone.vue';
import TheLinkForm from './components/TheLinkForm.vue';

import '@/assets/styles/forms.scss';


function useUserData() {

  const user: Ref<firebase.User> = ref(firebase.auth().currentUser!);

  const refreshUser = () => {

    /**
     * @note
     * In Vue 2 (with options API, of course), we used
     * ```
     * this.$set(this.user, firebase.auth().currentUser)
     * ```
     * to do this. The $set is supposedly no longer necessary now that we have
     * Proxies, but there's something broken. "Refreshing" the ref's properties
     * by re-assigning it doesn't seem to work as expected. Perhaps this is
     * intended, and is documented somewhere? I would like to see where. To get
     * around it, we set it to 'null' for a brief second so we can re-assign all
     * the properties and trigger our computed and template refreshes.
     *
     * This is probably a bug, if I had to guess.
     */

    // @ts-ignore to unset the value temporarily and trigger a real re-render
    user.value = null;
    user.value = firebase.auth().currentUser!;
  }

  const hasEmail = computed(() => {
    return user.value.providerData.some(p => p?.providerId == 'password');
  });

  const hasGoogle = computed(() => {
    return user.value.providerData.some(p => p?.providerId == 'google.com');
  });

  provide(UserDataKey, { user, hasEmail, hasGoogle, refreshUser });

  return { user, hasEmail, hasGoogle };
}


export default defineComponent({
  name: 'Account',
  components: {
    ConfirmModal, TheReauthForm, TheLinkForm,
    TheEmailPassword, TheSignInMethods, TheDangerZone
  },
  setup() {
    const errors = ref<string[]>([]);
    const { authExecutor } = useAuthFlow({ errors });

    const modalPayload = ref<ModalPayload | null>(null);

    provide(ModalPayloadKey, modalPayload);

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }

    const noButtonModal = computed(() => {
      const reason = modalPayload.value?.reason;
      return (
        reason == ModalReason.Reauthorize ||
        reason == ModalReason.LinkEmailPassword
      );
    });

    const modalConfirm = () => modalPayload.value?.callback?.();

    return {
      ...useUserData(),
      signOut, errors,
      modalPayload, modalConfirm, noButtonModal, ModalReason
    };
  }
});
</script>

<style scoped lang="scss">
@use 'sass:math';
@include standalone-sticky(calc(45rem + 5vw), 4.5rem, 2rem);

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

:deep(h3) {
  margin-top: 0;
  text-align: center;
}

section {
  margin-top: 2.25rem;
  h3 { margin: 1.25em 0; }
}

section {
  font-size: 95%;
}

// overridden widths with class-names from ../types.ts
:deep(.modal-container).reauthorize {
  width: clamp(13.5rem, 75%, 25rem);
}

// Make the split buttons stack when they run out of room
section>:deep(.split-buttons) {
  @media (max-width: math.div($break-mobile + $break-tiny, 2)) {
    flex-flow: column nowrap;
    align-items: center;
    justify-content: stretch;

    >* {
      margin-left: 0;
      margin-right: 0;

      flex: 1 1 auto;
      width: 100%;
    }
  }
}
</style>