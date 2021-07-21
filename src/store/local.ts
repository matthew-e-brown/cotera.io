import {
  isListID, isListInfo, isProgress, isSettings,
  ListID, ListInfo, Progress, Settings
} from './types';


namespace LocalStorage {
  type Key =
    ListID |          // each list identified by its 'list-0' id
    'list-info' |     // the list names and stuff
    'user-settings';  // the settings

  /**
   * Grabs an item from localStorage, verifying that it's the right type and
   * shape.
   * @param key Which item to get from localStorage.
   */
  export function getItem(key: 'user-settings'): Settings | undefined;
  export function getItem(key: 'list-info'): ListInfo[] | undefined;
  export function getItem(key: ListID): Progress | undefined;
  export function getItem(key: Key): any {

    const toss = () => { throw new Error("Invalid data in localStorage."); }

    const str = localStorage.getItem(key);
    if (str === null) return undefined;

    const item = JSON.parse(str);

    if (isListID(key)) {

      if (isProgress(item)) return item;
      else toss();

    } else if (key === 'list-info') {

      if (Array.isArray(item) && item.every(isListInfo)) return item;
      toss();

    } else if (key === 'user-settings') {

      if (isSettings(item)) return item;
      else toss();

    } else {

      toss();

    }

  }


  /**
   * Sets an item in localStorage with type-guarding in place.
   * @param key The item in localStorage to set.
   * @param data The item to set it to.
   */
  export function setItem(key: 'user-settings', data: Settings): void;
  export function setItem(key: 'list-info', data: ListInfo[]): void;
  export function setItem(key: ListID, data: Progress): void;
  export function setItem(key: Key, data: any): void {

    return localStorage.setItem(key, JSON.stringify(data));

  }

  /**
   * Removes an item from localStorage.
   * @param key The item to remove.
   */
  export function removeItem(key: Key): void {

    return localStorage.removeItem(key);

  }
}


export default LocalStorage;