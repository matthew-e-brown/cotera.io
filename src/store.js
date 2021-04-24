import { reactive } from 'vue';
import debounce from 'lodash.debounce';
import firebase from '@/firebase';

import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo-armor.json';

let progressUnsubscribe = undefined;
let preferencesUnsubscribe = undefined;
const allArmor = [ ...rawArmorList, ...rawAmiiboList ];


/**
 * The default state of the user's progress before they've added any levels to
 * their armor; everything at zeroes.
 */
const DEFAULT_PROGRESS = {
  head: Array( allArmor.filter(a => a.tag.startsWith('head')).length ).fill(0),
  body: Array( allArmor.filter(a => a.tag.startsWith('body')).length ).fill(0),
  legs: Array( allArmor.filter(a => a.tag.startsWith('legs')).length ).fill(0)
};


/**
 * The default options for user settings
 */
const DEFAULT_PREFERENCES = {
  sortOrder: 'type',
  showAmiibo: false
};


/**
 * Reactive state for this current browsing session
 */
const localState = reactive({
  userID: undefined,    // Firebase Auth user-id for signed in user
  selected: undefined,  // The currently selected armor
  get isSignedIn() { return this.userID != undefined; }
});


/**
 * Reactive state for things that are synced to Firebase,
 */
const syncedState = reactive({
  progress: JSON.parse(localStorage.getItem('user-progress')) ||
    { ...DEFAULT_PROGRESS },
  preferences: JSON.parse(localStorage.getItem('user-preferences')) ||
    { ...DEFAULT_PREFERENCES }
});



/**
 * Takes a progress object with the levels as an array of numbers and turns
 * those arrays into strings with characters of the numbers
 * @param {Object} progress The object to serialize
 * @returns The serialized object
 */
const serializeProgress = progress => Object.entries(progress)
  .map(([armorType, levelArr]) => ( { [armorType]: levelArr.join('') } ))
  .reduce((acc, cur) => ( { ...acc, ...cur } ), {});


/**
 * Takes a progress object with levels represented as strings and turns them
 * into an object with those levels as an array of numbers instead
 * @param {Object} data Source object from Firebase or localStorage
 * @returns The deserialized object
 */
const deserializeProgress = data => Object.entries(data)
  .map(([armorType, levelStr]) => ( {
    [armorType]: levelStr.split('').map(n => Number(n))
  } ))
  .reduce((acc, cur) => ( { ...acc, ...cur } ), {});


/**
 * Uploads the user's current progress to firebase
 * @returns A promise that resolves once the document is set
 */
const uploadProgress = () => firebase.firestore()
  .collection('user-progress')
  .doc(localState.userID)
  .set(serializeProgress(syncedState.progress));


/**
 * Uploads the user's current preferences to firebase
 * @returns A promise that resolves once the document is set
 */
const uploadPreferences = () => firebase.firestore()
  .collection('user-preferences')
  .doc(localState.userID)
  .set(syncedState.preferences);

const d_uploadProgress = debounce(uploadProgress, 900);
const d_uploadPreferences = debounce(uploadPreferences, 900);


/**
 * Finds an armor-item in the progress state and updates it, then uploads the
 * changes to Firestore
 * @param {Armor} armor The armor to update the level of
 * @param {Number} level The level to set to
 */
const setArmorLevel = (armor, level) => {
  syncedState.progress[armor.type][armor.indx] = level;

  if (localState.isSignedIn) {
    d_uploadProgress();
  } else {
    localStorage.setItem(
      'user-progress',
      JSON.stringify(syncedState.progress)
    );
  }
}


/**
 * Updates a user's preference, then uploads the changes to Firestore
 * @param {String} key The preference to update
 * @param {any} value The new value
 */
const setPreference = (key, value) => {
  syncedState.preferences[key] = value;

  if (localState.isSignedIn) {
    d_uploadPreferences();
  } else {
    localStorage.setItem(
      'user-preferences',
      JSON.stringify(syncedState.preferences)
    );
  }
}


/**
 * Changes the syncedState progress to match the default progress
 */
const resetLocalProgress = () => Object.entries(DEFAULT_PROGRESS)
  .forEach(([type, arr]) => syncedState.progress[type] = arr);


/**
 * Deletes the user's progress data from Firestore
 * @returns A promise that resolves once the document has been deleted
 */
const deleteProgress = () => {
  if (localState.isSignedIn) {
    d_uploadProgress.cancel();
    if (progressUnsubscribe) progressUnsubscribe();

    resetLocalProgress();

    return firebase.firestore()
      .collection('user-progress')
      .doc(localState.userID)
      .delete();
  } else {
    throw Error("Cannot delete progress while not signed in.");
  }
}


/**
 * Changes the syncedState preferences to match the default preferences
 */
const resetLocalPreferences = () => Object.entries(DEFAULT_PREFERENCES)
  .forEach(([key, value]) => syncedState.preferences[key] = value);


/**
 * Deletes the user's preferences data from Firestore
 * @returns A promise that resolves once the document has been deleted
 */
const deletePreferences = () => {
  if (localState.isSignedIn) {
    d_uploadPreferences.cancel();
    if (preferencesUnsubscribe) preferencesUnsubscribe();

    resetLocalPreferences();

    return firebase.firestore()
      .collection('user-preferences')
      .doc(localState.userID)
      .delete();
  } else {
    throw Error("Cannot delete preferences while not signed in.");
  }
}


// ==== Set up for Firestore listeners once the user is authenticated ====


/**
 * A helper function to subscribe to documents based on the user's ID
 * @param {String} collection The name of the Firestore/localStorage collection
 * to subscribe to and pull from
 * @param {Function<DocumentData>} callback The function to call on-snapshot
 * with the new data passed to ti
 * @param {Function} uploader The function to call in the event no document was
 * found, and a local copy must be uploaded
 * @returns An un-subscription function from Firestore
 */
const subscribe = (collection, callback, uploader) => firebase.firestore()
  .collection(collection)
  .doc(localState.userID)
  .onSnapshot(document => {
    // This document is already in Firestore
    if (document.exists) callback(document.data());
    // They don't have this document in Firestore; they're a new user
    else {
      uploader();
      localStorage.removeItem(collection);
    }
  });


firebase.auth().onAuthStateChanged(user => {
  // Signed in
  if (user) {
    localState.userID = user.uid;

    progressUnsubscribe = subscribe('user-progress', data => {
      Object.entries(deserializeProgress(data))
        .forEach(([type, arr]) => syncedState.progress[type] = arr);
    }, uploadProgress);

    preferencesUnsubscribe = subscribe('user-preferences', data => {
      Object.entries(data)
        .forEach(([key, value]) => syncedState.preferences[key] = value);
    }, uploadPreferences);

  }

  // Signed out
  else {
    localState.userID = undefined;

    if (progressUnsubscribe) progressUnsubscribe();
    if (preferencesUnsubscribe) preferencesUnsubscribe();

    resetLocalProgress();
    resetLocalPreferences();
  }
});


export {
  localState, syncedState,
  setArmorLevel, setPreference,
  deleteProgress, deletePreferences
};