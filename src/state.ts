import { reactive, toRefs } from 'vue';
import debounce from 'lodash/debounce';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { Armor, ArmorType, ArmorLevel, counts } from '@/armor';

type Subscription = (() => void) | undefined;

type Progress = {
  [ key in ArmorType ]: ArmorLevel[];
};

type SerializedProgress = {
  [ key in ArmorType ]: string;
}

export enum SortChoice { type = 'type', sets = 'sets', };
export const nextSortChoice = (choice: SortChoice): SortChoice => {
  if (choice == SortChoice.type) return SortChoice.sets;
  else return SortChoice.type;
}

type Preferences = {
  sortOrder: SortChoice;
  showAmiibo: boolean;
};


/**
 * Local, session-only state required for the app to run.
 */
export const localState = reactive<{
  userID: string | undefined;
  selected: Armor | undefined;
  readonly isSignedIn: boolean;
}>({
  userID: undefined,
  selected: undefined,
  get isSignedIn() { return this.userID != undefined }
});


/**
 * Gets 'user-progress' from localStorage.
 * @returns The user's saved progress from localStorage if it exists; false
 * otherwise.
 */
const getLocalProgress = (): Progress | false => {
  const str = localStorage.getItem('user-progress');
  return str ? JSON.parse(str) as Progress : false;
}


/**
 * Gets 'user-preferences' from localStorage.
 * @returns The user's saved preferences from localStorage if it exists; false
 * otherwise.
 */
const getLocalPreferences = (): Preferences | false => {
  const str = localStorage.getItem('user-preferences');
  return str ? JSON.parse(str) as Preferences : false;
}


/**
 * Takes a progress object and serializes its arrays into strings to lower
 * storage size.
 * @param data Standard progress data from syncedState.
 * @returns Serialized progress data, ready to be stored in Firestore or
 * localStorage.
 */
const serializeProgress = (data: Progress): SerializedProgress =>
  Object.entries(data)
    .map( ([type, arr]) => ({ [type]: arr.join('') }) )
    .reduce( (acc, cur) => ({ ...acc, ...cur }) ) as SerializedProgress;


/**
 * Takes a progress object with strings as its values and returns ones with
 * arrays instead.
 * @param data Serialized progress data from localStorage or Firestore.
 * @returns The deserialized progress data.
 */
const deserializeProgress = (data: SerializedProgress): Progress =>
  Object.entries(data)
    .map( ([type, str]) => ({ [type]: str.split('').map(n => Number(n)) }) )
    .reduce( (acc, cur) => ({ ...acc, ...cur }) , {}) as Progress;


/**
 * Stringifies the user's current progress and stores it in localStorage.
 */
const setLocalProgress = (): void => {
  const json = JSON.stringify(syncedState.progress as any);
  localStorage.setItem('user-progress', json);
}


/**
 * Stringifies the user's current preferences and stores it in localStorage.
 */
const setLocalPreferences = () => {
  const json = JSON.stringify(syncedState.preferences as any);
  localStorage.setItem('user-preferences', json);
}


const instantUploadProgress = () => firebase.app().firestore()
  .collection('user-progress')
  .doc(localState.userID)
  .set(serializeProgress(syncedState.progress));

const instantUploadPreferences = () => firebase.app().firestore()
  .collection('user-preferences')
  .doc(localState.userID)
  .set(syncedState.preferences);

const uploadProgress = debounce(instantUploadProgress, 900);
const uploadPreferences = debounce(instantUploadPreferences, 900);


/**
 * The default state of the user's progress before they've added any levels to
 * their armor; everything at zeroes.
 */
const DEFAULT_PROGRESS: Progress = {
  head: Array(counts.head).fill(0),
  body: Array(counts.body).fill(0),
  legs: Array(counts.legs).fill(0)
};

/**
 * The default options for user settings.
 */
const DEFAULT_PREFERENCES: Preferences = {
  sortOrder: SortChoice.type,
  showAmiibo: false
};


/**
 * App state that maps to properties in Firestore.
 */
export const syncedState = reactive<{
  progress: Progress,
  preferences: Preferences
}>({
  progress: getLocalProgress() || { ...DEFAULT_PROGRESS },
  preferences: getLocalPreferences() || { ...DEFAULT_PREFERENCES }
});


export const setArmorLevel = (armor: Armor, level: ArmorLevel): void => {
  syncedState.progress[armor.type][armor.indx] = level;
  if (localState.isSignedIn) uploadProgress();
  else setLocalProgress();
}

export const setPreference = <T extends keyof Preferences>(
  key: T,
  value: Preferences[T]
): void => {
  syncedState.preferences[key] = value;
  if (localState.isSignedIn) uploadPreferences();
  else setLocalPreferences();
}

let unsubProgress: Subscription = undefined;
let unsubPreferences: Subscription = undefined;


export const deleteProgress = (): Promise<void> => {
  if (localState.isSignedIn) {
    uploadProgress.cancel();
    unsubProgress?.();

    syncedState.progress = { ...DEFAULT_PROGRESS };

    return firebase.app().firestore()
      .collection('user-progress')
      .doc(localState.userID)
      .delete();
  } else {
    throw new Error("Cannot delete progress while not signed in.");
  }
}

export const deletePreferences = (): Promise<void> => {
  if (localState.isSignedIn) {
    uploadPreferences.cancel();
    unsubPreferences?.();

    syncedState.preferences = { ...DEFAULT_PREFERENCES };

    return firebase.app().firestore()
      .collection('user-preferences')
      .doc(localState.userID)
      .delete();
  } else {
    throw new Error("Cannot delete preferences while not signed in.");
  }
}


/**
 * Wrapper function for subscribing to Firestore
 * @param collectionName The collection on Firestore to subscribe to
 * @param dataFound Callback to run when updated data is found
 * @param otherwise Callback to run when no data is found. Happens when a new
 * user registers and first creates document.
 * @returns A function to call when ready to unsubscribe
 */
const subscribeHelper = (
  collectionName: 'user-progress' | 'user-preferences',
  dataFound: (data: firebase.firestore.DocumentData) => void,
  otherwise: () => void
): Subscription => firebase.app().firestore()
  .collection(collectionName)
  .doc(localState.userID)
  .onSnapshot(document => {
    const data = document.data();
    if (data) dataFound(data);
    else otherwise();
  });


/**
 * A callback to be registered to Firebase once the app is initialized. Used to
 * update store when auth-state changes.
 * @param user The new auth-state of the app.
 */
export const storeAuthChange = (user: firebase.User | null): void => {

  // They are signed in
  if (user) {
    localState.userID = user.uid;

    unsubProgress = subscribeHelper('user-progress',
      data => {
        const progress = deserializeProgress(data as SerializedProgress);
        syncedState.progress = { ...progress };
        // (Object.keys(progress) as ArmorType[]).forEach(type => {
        //   syncedState.progress[type] = progress[type];
        // });
      },
      () => {
        instantUploadProgress();
        localStorage.removeItem('user-progress');
      }
    );

    unsubPreferences = subscribeHelper('user-preferences',
      data => {
        const preferences = data as Preferences;
        syncedState.preferences = { ...preferences };
        // (Object.keys(preferences) as (keyof Preferences)[]).forEach(key => {
        //   setPreference(key, preferences[key]);
        // });
      },
      () => {
        instantUploadPreferences();
        localStorage.removeItem('user-preferences');
      }
    );

  }

  // They are signed out
  else {
    localState.userID = undefined;

    unsubProgress?.();
    unsubPreferences?.();

    syncedState.progress = { ...DEFAULT_PROGRESS };
    syncedState.preferences = { ...DEFAULT_PREFERENCES };
  }
}


export const allState = { ...toRefs(localState), ...toRefs(syncedState) };