import Vue from 'vue';
import firebase from '@/firebase-init';
import debounce from 'lodash.debounce';

// General state for the app itself
const state = Vue.observable({
  userid: undefined,
  selected: undefined,
  get signedin() { return this.userid != undefined; },
  // Don't need to bother syncing this one to firestore
  _sortOrder: localStorage.getItem('sort-order') || 'set',
  get sortOrder() { return this._sortOrder },
  set sortOrder(value) {
    this._sortOrder = value;
    localStorage.setItem('sort-order', value);
  },
  _showAmiibo: localStorage.getItem('show-amiibo') || true,
  get showAmiibo() { return this._showAmiibo },
  set showAmiibo(value) {
    this._showAmiibo = value;
    localStorage.setItem('show-amiibo', value);
  },
});

// State for user progress
const DEFAULT_PROGRESS = {
  head: Array(30).fill(0),
  body: Array(20).fill(0),
  legs: Array(21).fill(0)
}

const userProgress = Vue.observable(
  // Check if exists in localStorage
  JSON.parse(localStorage.getItem('user-progress')) || { ...DEFAULT_PROGRESS }
);

const uploadToFirebase = () => firebase.firestore()
  .collection('user-progress')
  .doc(state.userid)
  .set(
    Object.entries(userProgress)
      // Turn arrays to strings
      .map(([k, v]) => ({ [k]: v.join('') }))
      // Re-join [ {head: ""}, {body: ""} ] -> { head: "", body: "" }
      .reduce((acc, cur) => ({ ...acc, ...cur }))
  );

const debouncedUpload = debounce(uploadToFirebase, 900);

const setArmorLevel = (armor, level) => {
  Vue.set(userProgress[armor.type], armor.indx, level);
  if (state.signedin) debouncedUpload();
  else localStorage.setItem('user-progress', JSON.stringify(userProgress));
}

const resetProgress = () => {
  Object.entries(DEFAULT_PROGRESS)
    .forEach(([k, v]) => Vue.set(userProgress, k, v));
  return uploadToFirebase();
}

let unsubscribe = undefined;

// Unsubscribes from and removes the document entirely, instead of just setting
// it to all zeroes
const deleteProgress = () => {
  debouncedUpload.cancel();
  if (unsubscribe) unsubscribe();
  return firebase.firestore()
    .collection('user-progress')
    .doc(state.userid)
    .delete();
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    state.userid = user.uid;

    // If they've just signed in, overwrite the blank progress object with their
    // firestore data
    unsubscribe = firebase.firestore()
      .collection('user-progress')
      .doc(state.userid)
      .onSnapshot(doc => {
        // Doc won't exist if they're a new user
        if (doc.exists) {
          Object.entries(doc.data())
            .forEach(([k, v]) =>
              // Get the numbers out of the string
              Vue.set(userProgress, k, v.split('').map(n => Number(n)))
            );
        } else {
          // If new user, upload what they had, then remove the local copy
          uploadToFirebase();
          localStorage.removeItem('user-progress');
        }
      });
  } else {
    state.userid = undefined;

    if (unsubscribe) unsubscribe();

    // Reset to default values
    Object.entries(DEFAULT_PROGRESS)
      .forEach(([k, v]) => Vue.set(userProgress, k, v));
  }
});

export default state;
export { userProgress, setArmorLevel, resetProgress, deleteProgress };