import { cloneDeep } from 'lodash';

import { counts } from '@/types/armor';
import { ListInfo, Progress, Settings, SortChoice } from './types';

import store from './index';
import { getItem } from './local';
import { setItem, subscribe, FirestoreSubscription } from './cloud';


type HelperMode = 'get' | 'set' | 'sub' | 'unsub';
type GetterSetter<Type, Mode extends HelperMode> =
  Mode extends 'get' ? (           ) => Type :
  Mode extends 'set' ? (value: Type) => void :
  Mode extends 'sub' ? (uid: string) => void :
  FirestoreSubscription;


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
  progress(value) { store.state.progress = cloneDeep(value); },
  settings(value) { store.state.settings = cloneDeep(value); },
  listInfo(value) { store.state.listInfo = cloneDeep(value); },
}


const subscriptions: Helper<'unsub'> = {
  progress: undefined,
  settings: undefined,
  listInfo: undefined,
}


const subscribers: Helper<'sub'> = {
  progress(uid: string) {
    const list = store.state.settings.selectedList;

    subscriptions.progress?.();
    subscriptions.progress = subscribe(
      uid, list, importers.progress, () => {
        const value = defaults.progress();
        setItem(uid, list, value);
        importers.progress(value);
      }
    );
  },

  settings(uid: string) {
    subscriptions.settings?.();
    subscriptions.settings = subscribe(
      uid, 'user-settings', importers.settings, () => {
        const value = defaults.settings();
        setItem(uid, 'user-settings', value);
        importers.settings(value);
      }
    )
  },

  listInfo(uid: string) {
    subscriptions.listInfo?.();
    subscriptions.listInfo = subscribe(
      uid, 'list-info', importers.listInfo, () => {
        const value = defaults.listInfo();
        setItem(uid, 'list-info', value);
        importers.listInfo(value);
      }
    )
  }
}

const unsubscribe = () => {
  Object.values(subscriptions).forEach(unsub => unsub?.());
}


export { defaults, onLoad, importers, subscribers, unsubscribe };