import { reactive } from 'vue';
import firebase from 'firebase/app';

import { Armor } from '@/armor';
import { ArmorLevel, counts } from '@/types/armor';

import * as LocalStorage from './local';
import * as CloudStorage from './cloud';
import {
  AppState, isListID, ListID, ListInfo, Progress, Settings, SortChoice,
  StorageItem, StorageKey
} from './types';


/**
 * The fallback values to populate the store with if no other data can be found.
 */
namespace defaults {
  export const progress = (): Progress => {
    return {
      head: Array(counts.head).fill(0),
      body: Array(counts.body).fill(0),
      legs: Array(counts.legs).fill(0)
    };
  }

  export const settings = (): Settings => {
    return {
      sortOrder: SortChoice.Sets,
      selectedList: 'list-0',
      showAmiibo: false,
    };
  }

  export const listInfo = (): ListInfo[] => {
    return [
      { id: 'list-0', name: "Default List" },
    ];
  }
}

/**
 * Returns the initial state on every load of the page.
 */
namespace onLoad {
  export const progress = (): Progress => {
    const list = LocalStorage.getItem('user-settings')?.selectedList
      ?? defaults.settings().selectedList;

    return LocalStorage.getItem(list) ?? defaults.progress();
  }

  export const settings = (): Settings => {
    return LocalStorage.getItem('user-settings') ?? defaults.settings();
  }

  export const listInfo = (): ListInfo[] => {
    return LocalStorage.getItem('list-info') ?? defaults.listInfo();
  }
}


type SubscriptionType = 'currentList' | 'userSettings' | 'listInfo';
type Subscriptions = { [key in SubscriptionType]: CloudStorage.Subscription };

const subscriptions: Subscriptions = {
  currentList: undefined, userSettings: undefined, listInfo: undefined
};

const keyToSubscription = (key: StorageKey): SubscriptionType => {
  if (isListID(key)) return 'currentList';
  else if (key === 'list-info') return 'listInfo';
  else return 'userSettings';
}

const keyToImporter = (
  key: StorageKey
): (value: StorageItem<typeof key>) => void => {
  type R = (value: StorageItem<typeof key>) => void;

  if (isListID(key)) return importProgress as R;
  else if (key === 'list-info') return importListInfo as R;
  else return importSettings as R;
}

const keyToDefault = (key: StorageKey): () => StorageItem<typeof key> => {
  if (isListID(key)) return defaults.progress;
  else if (key === 'list-info') return defaults.listInfo;
  else return defaults.settings;
}


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

    // If they changed the selected list, get the new one from the localStore or
    // subscribe to the one in Firebase
    if (key === 'selectedList') {
      if (userID !== null) {
        subscribe(userID, this.state.settings.selectedList);
      } else {
        importProgress(
          LocalStorage.getItem(value as ListID) ?? defaults.progress()
        );
      }
    }
  },

};


function importProgress(value: Progress): void {
  if (store.debug) console.log(`importProgress triggered.`);
  store.state.progress.head = [ ...value.head ];
  store.state.progress.body = [ ...value.body ];
  store.state.progress.legs = [ ...value.legs ];
}


function importSettings(value: Settings): void {
  if (store.debug) console.log(`importSettings triggered.`);
  Object.entries(value).forEach(([ key, value ]) => {
    type K = keyof Settings;
    store.setSetting(key as keyof Settings, value as Settings[K]);
  });
}


function importListInfo(value: ListInfo[]): void {
  if (store.debug) console.log(`importListInfo triggered.`);
  store.state.listInfo = [ ...value ].map(o => ({ ...o }));
}


function subscribe(userID: string, key: StorageKey): void {
  const subTo = keyToSubscription(key);

  subscriptions[subTo]?.();
  subscriptions[subTo] = CloudStorage.subscribe(
    userID, key, keyToImporter(key), () => {
      const value = keyToDefault(key)();
      CloudStorage.setItem(userID, key, value);
      keyToImporter(key)(value);
    }
  );
}


export const onAuthStateChanged = (user: firebase.User | null): void => {

  // They just signed in
  if (user !== null) {
    const id = user.uid;

    store.setUserID(id);
    subscribe(id, 'list-info');
    subscribe(id, 'user-settings');
    subscribe(id, store.state.settings.selectedList);
  }

  // They just signed out
  else {
    store.setUserID(null);

    // Stop listening to Firestore
    subscriptions.userSettings?.();
    subscriptions.currentList?.();
    subscriptions.listInfo?.();

    // Reset all the levels back to zero
    importListInfo(defaults.listInfo());
    importProgress(defaults.progress());
    importSettings(defaults.settings());
  }
};


export default store;