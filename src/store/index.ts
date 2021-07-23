import { reactive } from 'vue';
import firebase from 'firebase/app';

import { Armor } from '@/armor';
import { ArmorLevel } from '@/types/armor';

import * as LocalStorage from './local';
import * as CloudStorage from './cloud';
import { AppState, ListID, Settings, SortChoice, toggleSort } from './types';
import {
  defaults, importers, onLoad, subscribers, unsubscribe
} from './helpers';


const store = {
  debug: (process.env?.NODE_ENV ?? '') === 'development',


  // values when the app loads
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

    const userID = this.state.userID;
    const listID = this.state.settings.selectedList;
    if (userID !== null) {
      CloudStorage.setItem(userID, listID, this.state.progress);
    } else {
      LocalStorage.setItem(listID, this.state.progress);
    }
  },


  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    if (this.debug)
      console.log(`setSettings triggered with '${key}: ${value}' k:v pair.`);

    this.state.settings[key] = value;

    const userID = this.state.userID;

    if (userID !== null) {
      CloudStorage.setItem(userID, 'user-settings', this.state.settings);
    } else {
      LocalStorage.setItem('user-settings', this.state.settings);
    }

    // If they changed the selected list...
    if (key === 'selectedList') {
      if (userID !== null) {
        // re-subscribe using the new value in the state
        subscribers.progress(userID);
      } else {
        // grab the other list from localStorage
        importers.progress(
          LocalStorage.getItem(value as ListID) ?? defaults.progress()
        );
      }
    }
  },

};


export const onAuthStateChanged = (user: firebase.User | null): void => {

  // They just signed in
  if (user !== null) {
    const { uid } = user;

    store.setUserID(uid);
    subscribers.settings(uid);
    subscribers.listInfo(uid);
    subscribers.progress(uid);
  }

  // They just signed out
  else {
    store.setUserID(null);

    // Stop listening to Firestore
    unsubscribe();

    // Reset all the levels back to zero
    importers.settings(defaults.settings());
    importers.listInfo(defaults.listInfo());
    importers.progress(defaults.progress());
  }

};


export default store;
export { SortChoice, toggleSort };