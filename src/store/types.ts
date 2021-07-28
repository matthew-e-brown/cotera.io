import { Armor } from '@/armor';
import { ArmorType, ArmorLevel } from '@/types/armor';


/**
 * The options which may be selected for the sort-order of the main list
 */
export enum SortChoice { Type = 'type', Sets = 'sets' };
export const toggleSort = (e: SortChoice): SortChoice => {
  switch (e) {
    case SortChoice.Type: return SortChoice.Sets;
    case SortChoice.Sets: return SortChoice.Type;
  }
}


/**
 * The identifiers used to index each list
 */
export type ListID = `list-${number}`;
export const isListID = (str: any): str is ListID => {
  return typeof str == 'string' && /^list-\d+$/.test(str);
}


/**
 * Mapping between ListIDs and list names
 */
export interface ListInfo {
  id: ListID;
  name: string;
}

export const isListInfo = (obj: any): obj is ListInfo[] => {
  return (
    Array.isArray(obj) &&
    obj.every(o =>
      o.hasOwnProperty('id') && typeof o.id == 'string' && isListID(o.id) &&
      o.hasOwnProperty('name') && typeof o.name == 'string'
    )
  );
}


/**
 * A set of arrays which hold the levels for the user's armor items
 */
export type Progress = { [ key in ArmorType ]: ArmorLevel[]; };

export const isProgress = (obj: any): obj is Progress => {
  return (
    obj !== undefined &&
    [ 'head', 'body', 'legs' ].every(k => k in obj) &&
    [ obj.head, obj.body, obj.legs ].every(Array.isArray) &&
    [ obj.head, obj.body, obj.legs ].every(arr =>
      arr.every((el: any) => typeof el == 'number' && el <= 4 && el >= 0)
    )
  );
}


/**
 * All of the options which are synced across clients
 */
export interface Settings {
  sortOrder: SortChoice;
  selectedList: ListID;
  showAmiibo: boolean;
}

export const isSettings = (obj: any): obj is Settings => {
  return (
    obj !== undefined &&
    [ 'sortOrder', 'selectedList', 'showAmiibo' ].every(k => k in obj) &&
    [ 'type', 'sets' ].some(k => obj.sortOrder == k) &&
    typeof obj.showAmiibo == 'boolean'
  );
}


export type StorageKey =
  ListID |          // each list identified by its 'list-0' id
  'list-info' |     // the list names and stuff
  'user-settings';  // the settings

export type StorageItem<T extends StorageKey> =
  T extends ListID ? Progress :
  T extends 'list-info' ? ListInfo[] :
  T extends 'user-settings' ? Settings : never;

export const isStorageItem = <T extends StorageKey>(
  key: T,
  value: any
): value is StorageItem<T> => {

  if (value === undefined) return false;
  const validProgress = isListID(key) && isProgress(value);
  const validListInfo = (key === 'list-info') && isListInfo(value);
  const validSettings = (key === 'user-settings') && isSettings(value);

  return validProgress || validListInfo || validSettings;

}


/**
 * The shape of the app's local state
 */
export interface AppState {
  userID: string | null;
  selected: Armor | null;
  listInfo: ListInfo[];
  progress: Progress;
  settings: Settings;
}