<template>
  <div id="modal" v-if="view != ModalViews.Hidden">

    <div v-if="view == ModalViews.LinkAccount">
      <h4>Link an email &amp; password</h4>
      <TheLinkForm @cancel="$emit('close-me')" />
    </div>


    <div v-if="view == ModalViews.Reauthorize">
      <h4>Please sign in again</h4>
      <TheReauthForm @cancel="$emit('close-me')" />
    </div>


    <div v-else-if="isUnlinkWarning">
      <h4>Are you sure?</h4>

      <Warning>
        <template #default v-if="view == ModalViews.UnlinkWarning1 ">
          You'll need to use your Google account to sign in from now on. You
          can always re-link your email address and password later.
        </template>
        <template #default v-else>
          You'll need to use your email &amp; password to sign in from now on.
          You can always re-link your Google account later.
        </template>
        <template #confirm>Yes, I'm sure</template>
        <template #cancel>No, go back</template>
      </Warning>
    </div>


    <div v-else-if="view == ModalViews.ResetWarning">
      <h4>Are you sure?</h4>

      <Warning @cancel="$emit('close-me')" @confirm="resetAccount">
        <template #default>
          This will reset the level of all the pieces of armor on your account
          to zero.
        </template>
        <template #confirm>Yes, I'm sure</template>
        <template #cancel>No, go back</template>
      </Warning>
    </div>


    <div v-else-if="view == ModalViews.DeletionWarning1">
      <h4>Are you sure?</h4>

      <Warning @cancel="$emit('close-me')" @confirm="$emit('next-delete')">
        <template #default>
          This will delete your account as well as all associated data.
        </template>
        <template #confirm>Yes, I'm sure</template>
        <template #cancel>No, go back</template>
      </Warning>
    </div>


    <div v-else-if="view == ModalViews.DeletionWarning2">
      <h4>Are you <strong>really</strong> sure?</h4>

      <Warning @cancel="$emit('close-me')" swapped>
        <template #default>This is your last chance to change mind.</template>
        <template #confirm>Yes, I'm really sure</template>
        <template #cancel>On second thought&hellip;</template>
      </Warning>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import { ModalViews } from '../types';

import TheLinkForm from './TheLinkForm.vue';
import TheReauthForm from './TheReauthForm.vue';
import Warning from './Warning.vue';

export default defineComponent({
  components: { TheLinkForm, TheReauthForm, Warning },
  props: {
    view: { type: Number as PropType<ModalViews>, required: true }
  },
  emits: [ 'close-me', 'next-delete' ],
  setup(props) {
    // Just to keep lines short within the template ^-^
    const isUnlinkWarning = computed(() => {
      return (
        props.view == ModalViews.UnlinkWarning1 ||
        props.view == ModalViews.UnlinkWarning2
      );
    });

    return { ModalViews, isUnlinkWarning };
  },
});
</script>


<style scoped lang="scss">
#modal {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }

  >div {
    margin: 5em auto;
    width: 72.5%;
  }
}

h4 {
  text-align: center;
}
</style>