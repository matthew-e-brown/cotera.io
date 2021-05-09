import { reactive } from 'vue';
import { debounce } from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { Armor, ArmorType, ArmorLevel, counts } from '@/armor';

type Prefs = { sortOrder: SortChoice, showAmiibo: boolean };
type Progress = { [ key in ArmorType ]: ArmorLevel[] }; // as stored
type RawProgress = { [ key in ArmorType ]: string }; // from Firestore
type Subscription = (() => void) | undefined; // Firestore's "unsubscribe" funcs

export enum SortChoice { Type = 'type', Sets = 'sets' };
export const iterChoice = (e: SortChoice): SortChoice => {
  switch (e) {
    case SortChoice.Type: return SortChoice.Sets;
    case SortChoice.Sets: return SortChoice.Type;
  }
}

interface State {
  userID: string | null;
  selected: Armor | null;
  progress: Progress;
  prefs: Prefs;
  readonly isSignedIn: boolean;
};


/**
 * User-defined type-guard for Progress interface.
 * @param obj An object to check.
 * @returns Whether or not the object correctly represents user progress.
 */
const isProgress = (obj: any): obj is Progress => {
  return (
    ('head' in obj && 'body' in obj && 'legs' in obj) &&
    Array.isArray(obj.head) &&
    Array.isArray(obj.body) &&
    Array.isArray(obj.legs) &&
    obj.head.every((el: any) => typeof el == 'number' && el <= 4 && el >= 0) &&
    obj.body.every((el: any) => typeof el == 'number' && el <= 4 && el >= 0) &&
    obj.legs.every((el: any) => typeof el == 'number' && el <= 4 && el >= 0)
  );
}


/**
 * User-defined type-guard for Prefs interface.
 * @param obj An object to check.
 * @returns Whether or not the object correctly represents user preferences.
 */
const isPrefs = (obj: any): obj is Prefs => {
  return (
    ('sortOrder' in obj && 'showAmiibo' in obj) &&
    (obj.sortOrder == 'type' || obj.sortOrder == 'sets') &&
    typeof obj.showAmiibo == 'boolean'
  )
}


/**
 * Gets the progress that the app should start up with at load-time.
 * @returns The initial state of the app's progress, be it from localStorage or
 * the default.
 */
const initialProgress = (): Progress => {
  const existing = localStorage.getItem('user-progress');
  const unset: Progress = {
    head: new Array<ArmorLevel>(counts.head).fill(0),
    body: new Array<ArmorLevel>(counts.body).fill(0),
    legs: new Array<ArmorLevel>(counts.legs).fill(0)
  };

  if (existing !== null) {
    const obj = JSON.parse(existing);
    if (isProgress(obj)) return obj;
    else return unset;
  } else return unset;
}


/**
 * Gets the preferences for the app to start up with.
 * @returns The initial state of the preferences the app should use, be they
 * from localStorage or the default ones.
 */
const initialPreferences = (): Prefs => {
  const existing = localStorage.getItem('user-preferences');
  const unset: Prefs = {
    sortOrder: SortChoice.Sets,
    showAmiibo: false
  }

  if (existing !== null) {
    const obj = JSON.parse(existing);
    if (isPrefs(obj)) return obj;
    else return unset;
  } else return unset;
}


/**
 * Holds the Firebase functions for unsubscribing from onSnapshot. These need to
 * be called if the user signs out.
 */
const unsubscribe = {
  progress: <Subscription>undefined,
  prefs: <Subscription>undefined
};


/**
 * Holds functions that can be used to upload an object to Firestore. There's
 * one for Progress and one for Preferences.s
 */
const uploaders = {
  progress: async (data: Progress, doc: string) => {
    const head = data.head.join('');
    const body = data.body.join('');
    const legs = data.legs.join('');

    return firebase.firestore()
      .collection('user-progress').doc(doc).set({ head, body, legs });
  },
  prefs: async (data: Prefs, doc: string) => {
    return firebase.firestore()
      .collection('user-preferences').doc(doc).set(data);
  },
};


/**
 * A "proxy" to `uploaders` that has the same functions, debounced by 900 ms.
 */
const debounced = {
  progress: debounce(uploaders.progress, 900),
  prefs: debounce(uploaders.prefs, 900)
};


/**
 * The main store object. Holds information that the app may need to have access
 * to at any given time.
 */
const store = {
  debug: false, //(process.env?.NODE_ENV ?? '') != 'production',

  state: reactive<State>({
    userID: null,
    selected: null,
    progress: initialProgress(),
    prefs: initialPreferences(),
    get isSignedIn(): boolean { return this.userID !== null; }
  }),

  setUserID(value: string | null): void {
    if (this.debug)
      console.log(`setUserID triggered with ${value} value.`);
    this.state.userID = value;
  },

  setSelected(value: Armor | null): void {
    if (this.debug)
      console.log(`setSelected triggered with ${value?.name ?? 'null'} value.`);
    this.state.selected = value;
  },

  setSortOrder(value: SortChoice): void {
    if (this.debug)
      console.log(`setSortOrder triggered with ${value} value.`);
    this.state.prefs.sortOrder = value;

    if (this.state.isSignedIn)
      debounced.prefs(this.state.prefs, this.state.userID!);
    else
      localStorage.setItem('user-preferences', JSON.stringify(this.state.prefs));
  },

  setShowAmiibo(value: boolean): void {
    if (this.debug)
      console.log(`setShowAmiibo triggered with ${value} value.`);
    this.state.prefs.showAmiibo = value;

    if (this.state.isSignedIn)
      debounced.prefs(this.state.prefs, this.state.userID!);
    else
      localStorage.setItem('user-preferences', JSON.stringify(this.state.prefs));
  },

  setArmorLevel(value: ArmorLevel): void {
    if (this.debug)
      console.log(`setArmorLevel triggered with ${value} value.`);
    if (this.state.selected === null)
      throw new Error(`Cannot set null's level to ${value}.`);

    const type: ArmorType = this.state.selected.type;
    const indx: number = this.state.selected.indx;

    this.state.progress[type][indx] = value;

    if (this.state.isSignedIn)
      debounced.progress(this.state.progress, this.state.userID!);
    else
      localStorage.setItem('user-progress', JSON.stringify(this.state.progress));
  },

  importProgress(value: Progress): void {
    if (this.debug) console.log(`importProgress triggered.`);
    this.state.progress.body = [ ...value.body ];
    this.state.progress.head = [ ...value.head ];
    this.state.progress.legs = [ ...value.legs ];
  },

  importPrefs(value: Prefs): void {
    if (this.debug) console.log(`importPrefs triggered.`);
    this.state.prefs.showAmiibo = value.showAmiibo;
    this.state.prefs.sortOrder = value.sortOrder;
  }
};

export default store;


/**
 * A callback for handling a user's authorization state changing: exported here,
 * and expected to be registered once the app is initialized in order to listen
 * for changes.
 * @param user The user that has just logged in or out of Firebase.
 */
export const handleAuthChange = (user: firebase.User | null): void => {

  // They just signed in
  if (user !== null) {

    store.setUserID(user.uid);

    unsubscribe.progress = firebase.firestore()
      .collection('user-progress')
      .doc(user.uid)
      .onSnapshot(doc => {

        /**
         * @note
         *
         * This use of metadata.hasPendingWrites seems to go against the
         * Firestore docs' words: it suggests that you should simply always
         * listen to the snapshot, since it will be called immediately upon any
         * local .set() calls. However: since I want to *debounce* the uploads
         * to save on document writes, I am updating the local state and the
         * Firestore copy separately (since, if I didn't, local changes would
         * not appear until the debounce finished waiting). That means I have to
         * ignore the updates caused by that debounced copy.
         *
         * Basically, this condition says, "only run this code when the update
         * comes from the server, not locally."
         */

        // If the document exists and isn't the result of the debounced upload
        // we just did, import it into our local state.
        if (doc.exists && !doc.metadata.hasPendingWrites) {
          const rawData = doc.data() as RawProgress;
          const processed = {
            'head': <number[]>[],
            'body': <number[]>[],
            'legs': <number[]>[]
          };

          (<ArmorType[]>[ 'head', 'body', 'legs' ]).forEach(type => {
            processed[type] = rawData[type].split('').map(n => Number(n));
          });

          if (isProgress(processed)) {
            store.importProgress(processed as Progress);
          } else {
            console.error("Received invalid data from Firestore.", rawData);
            throw new Error("Attempting to import invalid data to store.");
          }
        }

        // If the document doesn't exist, that means that it's their first time
        // signing in: we need to make a document for them. So we, upload their
        // current progress, whatever it may be (like, from localStorage, if
        // applicable).
        else if (!doc.exists) {
          uploaders.progress(store.state.progress, user.uid);
        }

      });

    unsubscribe.prefs = firebase.firestore()
      .collection('user-preferences')
      .doc(user.uid)
      .onSnapshot(doc => {

        if (doc.exists && !doc.metadata.hasPendingWrites) {
          const rawData = doc.data() as Prefs;

          if (isPrefs(rawData))
            store.importPrefs(rawData as Prefs);
          else {
            console.error("Received invalid data from Firestore.", rawData);
            throw new Error("Attempting to import invalid data to store.");
          }
        }

        else if (!doc.exists) {
          uploaders.prefs(store.state.prefs, user.uid);
        }

      });

  }

  // They just signed out
  else {
    store.setUserID(null);
    // Remove FireStore listeners
    unsubscribe.progress?.();
    unsubscribe.prefs?.();
    // Reset to either blank progress or their local progress
    store.importProgress(initialProgress());
    store.importPrefs(initialPreferences());
  }

}