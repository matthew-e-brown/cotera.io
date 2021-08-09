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
import { defineComponent, ref, computed, provide } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';

import user, { hasEmail } from './user';
import { ModalPayload, ModalReason, ModalPayloadKey } from './types';

import ConfirmModal from '@/components/ConfirmModal.vue';

import TheReauthForm from './components/TheReauthForm.vue';
import TheEmailPassword from './components/TheEmailPassword.vue';
import TheSignInMethods from './components/TheSignInMethods.vue';
import TheDangerZone from './components/TheDangerZone.vue';
import TheLinkForm from './components/TheLinkForm.vue';

import '@/assets/styles/forms.scss';


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

    const modalConfirm = async () => {
      await modalPayload.value?.callback?.();  // run callback
    }

    return {
      user, hasEmail, signOut, errors,
      modalPayload, modalConfirm, noButtonModal, ModalReason
    };
  }
});
</script>

<style scoped lang="scss">
@use 'sass:color';
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

section, #locked, #unlocked {
  font-size: 95%;
}

:deep(.split-buttons) {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  >* { margin-left: 0.85rem; margin-right: 0.85rem; }
  >:first-child { margin-left: 0; }
  >:last-child { margin-right: 0; }

  button { flex: 1 1 50%; }
  .icon-button span { font-size: unset; }
}

#lock-wrapper {
  position: relative;
  // while unlocked, remove margin on first section
  &.open section:first-of-type { margin-top: 0; }
}

#locked {
  position: absolute;
  inset: -1em;
  z-index: 4;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(15px)) {
    background-color: opacify($bg-color-transparent, 0.075);
    backdrop-filter: blur(15px);
  }

  padding: 1em 2em;
  border-radius: 0.35em;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    font-style: italic;
    color: $fg-color-dim;
  }

  button {
    font-size: 75%;
    margin-left: auto;
    margin-right: auto;
  }
}

#unlocked {
  margin: 2rem 0;

  span, button {
    vertical-align: baseline;
  }

  span {
    font-style: italic;
    color: $fg-color-dim;
  }

  button {
    $bg: opaque-mix($bg-color-accent, $bg-color);

    width: 3em;
    height: 2.15em;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 0.5em;
    margin-right: 1.00em;
    margin-bottom: 0.80em;

    color: $fg-color;
    background-color: $bg;

    @media (hover: hover) {
      transition: 125ms linear;
      transition-property: background-color;

      &:hover {
        background-color: color.scale($bg, $lightness: 10%);
      }
    }
  }
}

// overridden widths with class-names from ../types.ts
:deep(.modal-container).reauthorize {
  width: clamp(13.5rem, 75%, 25rem);
}
</style>