import { StorageKey, StorageItem, isStorageItem } from './types';



/**
 * Grabs an item from localStorage, verifying that it's the right type and
 * shape.
 * @param key Which item to get from localStorage.
 */
export function getItem<T extends StorageKey>(
  key: T
): StorageItem<T> | undefined {

  const str = localStorage.getItem(key);
  if (str === null) return undefined;

  const item = JSON.parse(str);

  if (isStorageItem(key, item)) {
    return item as StorageItem<T>;
  } else {
    throw new Error("Invalid data in localStorage.");
  }

}


/**
 * Sets an item in localStorage with type-guarding in place.
 * @param key The item in localStorage to set.
 * @param data The item to set it to.
 */
export function setItem<T extends StorageKey>(
  key: T,
  data: StorageItem<T>
): void {

  return localStorage.setItem(key, JSON.stringify(data));

}

/**
 * Removes an item from localStorage.
 * @param key The item to remove.
 */
export function removeItem(key: StorageKey): void {

  return localStorage.removeItem(key);

}

/**
 * Clears LocalStorage.
 */
export function clear(): void {

  return localStorage.clear();

}