import { ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

// assert non-null (!) because this route is guarded by a navigation guard
const user = ref(firebase.auth().currentUser!);

/**
 * Refreshes the App's reference of all the user's properties. Must be called
 * after anything that alters the user (like a change to email address)
 * occurs.
 */
const refreshUser = () => user.value = firebase.auth().currentUser!;

export default user;
export { refreshUser };