import { Unsubscribe } from 'firebase/firestore';

import { counts } from '@/types/armor';
import { ListInfo, Progress, Settings, SortChoice, StorageKey } from './types';

import store from './index';
import { getItem } from './local';
import { setItem, subscribe } from './cloud';


type HelperMode = 'get' | 'set' | 'sub' | 'unsub';
type GetterSetter<Type, Mode extends HelperMode> =
  Mode extends 'get' ? (           ) => Type :
  Mode extends 'set' ? (value: Type) => void :
  Mode extends 'sub' ? (uid: string) => void :
  Unsubscribe | null;


interface Helper<Mode extends HelperMode> {
  progress: GetterSetter<Progress, Mode>,
  settings: GetterSetter<Settings, Mode>,
  listInfo: GetterSetter<ListInfo[], Mode>,
}


const defaults: Helper<'get'> = {
  progress() {
    return {
      head: Array(counts.head).fill(0),
      body: Array(counts.body).fill(0),
      legs: Array(counts.legs).fill(0)
    };
  },

  settings() {
    return {
      sortOrder: SortChoice.Sets,
      selectedList: 'list-0',
      showAmiibo: false,
    }
  },

  listInfo() {
    return [
      { id: 'list-0', name: "Default List" },
    ];
  },
}


const onLoad: Helper<'get'> = {
  progress() {
    const list = (getItem('user-settings') ?? this.settings()).selectedList;
    return getItem(list) ?? defaults.progress();
  },

  settings() {
    return getItem('user-settings') ?? defaults.settings();
  },

  listInfo() {
    return getItem('list-info') ?? defaults.listInfo();
  },
}


const importers: Helper<'set'> = {
  progress(value) {
    (Object.keys(store.state.progress) as (keyof Progress)[]).forEach(key => {
      (store.state.progress[key] as unknown) = [ ...value[key] ];
    });
  },

  settings(value) {
    (Object.keys(store.state.settings) as (keyof Settings)[]).forEach(key => {
      store.setSetting(key, value[key]);
    });
  },

  listInfo(value) {
    store.state.listInfo = value.map(info => ({ ...info }));
  },
}


const subscriptions: Helper<'unsub'> = {
  progress: null,
  settings: null,
  listInfo: null,
}


/**
 * A factory function which returns a function to run when a Firestore query
 * returns empty data. It will get the default data for the given 'getter' and
 * then add it to the database and app state.
 * @param uid The userID (Firestore doc) to set when uploading the new data
 * @param key Which data in Firestore we're settings
 * @param getter The key into the Helper object we're using
 * @returns The onEmpty function
 */
const onEmpty = (
  uid: string,
  key: StorageKey,
  getter: keyof Helper<'get'>
) => () => {
  const value = defaults[getter]();  // get the default value for this key
  // @ts-ignore to avoid *crazy* casting; Helper<'get'> === Helper<'set'>
  importers[getter](value);          // import it to app's local store
  setItem(uid, key, value);          // add it to Firestore
}


const subscribers: Helper<'sub'> = {
  progress(uid: string) {
    const list = store.state.settings.selectedList;

    subscriptions.progress?.();
    subscriptions.progress = subscribe(
      uid, list,
      importers.progress, onEmpty(uid, list, 'progress')
    );
  },

  settings(uid: string) {
    subscriptions.settings?.();
    subscriptions.settings = subscribe(
      uid, 'user-settings',
      importers.settings, onEmpty(uid, 'user-settings', 'settings')
    );
  },

  listInfo(uid: string) {
    subscriptions.listInfo?.();
    subscriptions.listInfo = subscribe(
      uid, 'list-info',
      importers.listInfo, onEmpty(uid, 'list-info', 'listInfo')
    );
  }
}

const unsubscribe = () => {
  Object.values(subscriptions).forEach(unsub => unsub?.());
}


export { defaults, onLoad, importers, subscribers, unsubscribe };