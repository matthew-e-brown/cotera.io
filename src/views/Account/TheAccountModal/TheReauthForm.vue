<template>
  <p>
    It's been a while since you last signed in; please sign in again so we
    know it's actually you.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: [ 'cancel' ],
  setup() {
    
  }
});

// function useReauthentication() {
//   const done = ref(false);

//   const email = ref("");
//   const password = ref("");
//   const errors = ref<string[]>([]);

//   const { authExecutor } = useAuthFlow({ errors });

//   const validate = () => {
//     errors.value = [];

//     if (email.value.length == 0)
//       errors.value.push("Please enter an email address.");

//     if (password.value.length == 0)
//       errors.value.push("Please enter a password.");

//     return errors.value.length == 0;
//   }

//   const submit = async () => {
//     if (!validate()) return;

//     const cred = firebase.auth
//       .EmailAuthProvider
//       .credential(email.value, password.value);

//     const success = await authExecutor(
//       user.value.reauthenticateWithCredential(cred));

//     if (success) {
//       refreshUser();
//       done.value = true;
//     }
//   }

//   return {
//     reauthForm: reactive({ email, password, errors, submit, done })
//   };
// }
</script>