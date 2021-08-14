import { reactive } from 'vue';

import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { Armor } from '@/armor';
import { ArmorLevel } from '@/types/armor';

import * as LocalStorage from './local';
import * as CloudStorage from './cloud';
import {
  AppState, ListID, Settings, SortChoice, toggleSort, StorageItem, StorageKey
} from './types';
import {
  defaults, importers, onLoad, subscribers, unsubscribe
} from './helpers';


const store = {
  debug: (process.env?.NODE_ENV ?? '') === 'development',


  // values when the app loads: fetch user-data from localStorage or get
  // defaults
  state: reactive<AppState>({
    userID: null,
    selected: null,
    progress: onLoad.progress(),
    settings: onLoad.settings(),
    listInfo: onLoad.listInfo(),
  }),


  setUserID(value: string | null): void {
    if (this.debug)
      console.log(`setUserID triggered with '${value}' value.`);

    this.state.userID = value;
  },


  setSelected(value: Armor | null): void {
    if (this.debug)
      console.log('setSelected triggered with value:', value);

    this.state.selected = value;
  },


  setSelectedLevel(value: ArmorLevel): void {
    if (this.debug)
      console.log(`setSelectedLevel triggered with '${value}' value.`);

    if (this.state.selected === null)
      throw new Error("Cannot set selected level while nothing is selected.");

    const type = this.state.selected.type;
    const indx = this.state.selected.indx;

    this.state.progress[type][indx] = value;

    const listID = this.state.settings.selectedList;
    saveToStorage(listID, this.state.progress);
  },


  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    if (this.debug)
      console.log(`setSettings triggered with '${key}: ${value}' k:v pair.`);

    this.state.settings[key] = value;
    saveToStorage('user-settings', this.state.settings);

    // If they changed the selected list...
    if (key === 'selectedList') {
      this.state.selected = null; // de-select to prevent confusion

      if (this.state.userID !== null) {
        // re-subscribe using the new value in the state
        subscribers.progress(this.state.userID);
      } else {
        // grab the other list from localStorage
        importers.progress(
          LocalStorage.getItem(value as ListID) ?? defaults.progress()
        );
      }
    }
  },


  renameList(id: ListID, name: string): void {
    if (this.debug)
      console.log(`renameList triggered on ${id} with value ${name}`);

    const index = this.state.listInfo.findIndex(({ id: i }) => i == id);
    if (index == -1)
      throw new Error("Trying to rename invalid ID from listInfo");

    this.state.listInfo[index].name = name;
    saveToStorage('list-info', this.state.listInfo);
  },


  addNewList(name: string): void {
    if (this.debug)
      console.log(`addNewList triggered with value: ${name}`);

    if (this.state.listInfo.length >= 16)
      throw new Error("Cannot add more than 16 lists.");

    // Loop up to find the first available. As long as 'some' (any one) item in
    // the array has an ID that matches our newID, it's in use, and we need a
    // new one.

    let i = 1;
    let newID: ListID = `list-0`;

    while (this.state.listInfo.some(({ id }) => newID == id)) {
      newID = `list-${i++}`;
    }

    this.state.listInfo.push({ id: newID, name });
    saveToStorage('list-info', this.state.listInfo);
  },


  removeList(id: ListID): void {
    if (this.debug)
      console.log(`removeListInfo triggered for ID '${id}'`);

    if (id == this.state.settings.selectedList)
      throw new Error("Cannot remove the currently selected list.");

    const index = this.state.listInfo.findIndex(({ id: i }) => i == id);

    if (index == -1)
      throw new Error("Trying to remove invalid ID from listInfo.");

    this.state.listInfo.splice(index, 1);

    // Save the newly updated list-info
    saveToStorage('list-info', this.state.listInfo);
    // Delete the data from storage
    if (this.state.userID !== null) {
      CloudStorage.removeLists(this.state.userID, [ id ]);
    } else {
      LocalStorage.removeItem(id);
    }
  },


  reorderListInfo(targetIndx: number, placeAt: number): void {
    if (this.debug)
      console.log(`reorderListInfo triggered with ${targetIndx}→${placeAt}`);

    // Remove from the array and re-add at the right place
    const item = this.state.listInfo.splice(targetIndx, 1)[0];
    this.state.listInfo.splice(placeAt, 0, item);

    saveToStorage('list-info', this.state.listInfo);
  }

};



/**
 * Wraps the 'if signed in, cloud; otherwise, local' saving step.
 * @param key The item to save
 * @param item The item
 */
function saveToStorage<K extends StorageKey>(key: K, item: StorageItem<K>) {
  const userID = store.state.userID;
  if (userID !== null) {
    return CloudStorage.setItem(userID, key, item);
  } else {
    return LocalStorage.setItem(key, item);
  }
}


onAuthStateChanged(auth, user => {

  // They are signed in
  if (user !== null) {
    const { uid } = user;

    store.setUserID(uid);

    // Subscribe to Firebase and remove local copy
    subscribers.listInfo(uid);
    subscribers.settings(uid);
    subscribers.progress(uid);
    LocalStorage.clear();
  }

  // They are signed out; but check that this isn't during start-up: no need to
  // import defaults if that's the case (we'd overwrite their onLoads)
  else if (store.state.userID !== null) {
    store.setUserID(null);

    // Stop listening to Firestore
    unsubscribe();

    // Reset all the levels back to zero
    importers.settings(defaults.settings());
    importers.listInfo(defaults.listInfo());
    importers.progress(defaults.progress());
  }

});


export default store;
export { SortChoice, toggleSort };