import { reactive } from 'vue';

import { counts } from '@/types/armor';

import LocalStorage from './local';
import CloudStorage from './cloud';
import { AppState, Progress, Settings, SortChoice } from './types';


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
}



const store = {
  debug: (process.env?.NODE_ENV ?? '') === 'development',

  // values when the app loads
  state: reactive<AppState>({
    userID: null,
    selected: null,
    progress: onLoad.progress(),
    settings: onLoad.settings(),
  }),


};

export default store;