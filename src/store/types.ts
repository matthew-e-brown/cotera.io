import { Armor } from '@/armor';
import { ArmorType, ArmorLevel } from '@/types/armor';


export type Subscription = (() => void) | undefined;


export enum SortChoice { Type = 'type', Sets = 'sets' };
export const toggleSort = (e: SortChoice): SortChoice => {
  switch (e) {
    case SortChoice.Type: return SortChoice.Sets;
    case SortChoice.Sets: return SortChoice.Type;
  }
}


export type ListID = `list-${number}`;
export const isListID = (str: string): str is ListID => {
  return /^list-\d+$/.test(str);
}


export interface ListInfo {
  id: ListID;
  name: string;
}

export const isListInfo = (obj: any): obj is ListInfo => {
  return (
    obj.hasOwnProperty('id')
      && typeof obj.id === 'string' && isListID(obj.id)
    && obj.hasOwnProperty('name')
      && typeof obj.name === 'string'
  );
}


export type Progress = { [ key in ArmorType ]: ArmorLevel[]; };

export const isProgress = (obj: any): obj is Progress => {
  return (
    [ 'head', 'body', 'legs' ].every(k => k in obj) &&
    [ obj.head, obj.body, obj.legs ].every(Array.isArray) &&
    [ obj.head, obj.body, obj.legs ].every(arr =>
      arr.every((el: any) => typeof el == 'number' && el <= 4 && el >= 0)
    )
  );
}


export interface Settings {
  sortOrder: SortChoice;
  selectedList: ListID;
  showAmiibo: boolean;
}

export const isSettings = (obj: any): obj is Settings => {
  return (
    [ 'sortOrder', 'selectedList', 'showAmiibo' ].every(k => k in obj) &&
    [ 'type', 'sets' ].some(k => obj.sortOrder == k) &&
    typeof obj.showAmiibo == 'boolean'
  );
}


export interface AppState {
  userID: string | null;
  selected: Armor | null;
  progress: Progress;
  settings: Settings;
}