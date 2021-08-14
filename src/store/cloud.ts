import debounce from 'lodash/debounce';

import { firestore } from '@/firebase';
import {
  doc, onSnapshot, deleteDoc, updateDoc, setDoc, Unsubscribe
} from 'firebase/firestore';

import {
  StorageKey, StorageItem, isStorageItem, ListID, isListID
} from './types'


/**
 * Since some of the keys are exposed directly on the user object (all except
 * progress), we need to wrap them with a key first to make sure we don't
 * overwrite the *entire* document.
 */
type WrappedItem<K extends StorageKey> =
  K extends ListID          ? StorageItem<K> :
  K extends 'list-info'     ? { lists: StorageItem<K> } :
  K extends 'user-settings' ? { settings: StorageItem<K> } : never;

/**
 * Wraps an item.
 * @param key The type of item being wrapped
 * @param item The item to wrap
 * @returns The item exposed as a field on an object with a key, should it
 * require one
 */
function wrapItem<K extends StorageKey>(
  key: K,
  item: StorageItem<K>
): WrappedItem<K> {
  if (isListID(key)) return item as WrappedItem<K>;
  else if (key == 'list-info') return { lists: item } as WrappedItem<K>;
  else return { settings: item } as WrappedItem<K>;
}


/**
 * Unwraps an item.
 * @param key The type of item being unwrapped
 * @param item The item to unwrap
 * @returns The StorageItem pulled out from inside the wrapper object
 */
function unwrapItem<K extends StorageKey>(
  key: K,
  item: WrappedItem<K>
): StorageItem<K> | undefined {
  if (isListID(key)) {
    return item as StorageItem<K>;
  } else if (key == 'list-info') {
    const cast = item as WrappedItem<'list-info'>;
    if (cast.hasOwnProperty('lists')) return cast.lists as StorageItem<K>;
    else return undefined;
  } else {
    const cast = item as WrappedItem<'user-settings'>;
    if (cast.hasOwnProperty('settings')) return cast.settings as StorageItem<K>;
    else return undefined;
  }
}


/**
 * Generates a path for accessing documents in Firestore.
 * @param userID The userID to generate a path with
 * @param key The document to generate a path with
 * @returns A path pointing to a document in Firestore
 */
function getPath(userID: string, key: StorageKey) {

  if (isListID(key)) return `/user-data/${userID}/progress/${key}`;
  else return `/user-data/${userID}`;

}


/**
 * Subscribes to a document reference in Firestore.
 * @param userID The ID of the user whose data is to be listened to
 * @param key The item that is being listened to
 * @param onValue The handler function to run once data is confirmed to be valid
 * @param onError The handler function to be run if either there is invalid data
 * in Firestore, or if there is no data in Firestore. These two scenarios will
 * have 'invalid-data' or 'no-data' passed to the handler respectively.
 * @returns A function which can be called to unsubscribe from the listener.
 */
export function subscribe<K extends StorageKey>(
  userID: string,
  key: K,
  onValue: (item: StorageItem<K>) => void,
  onEmpty: () => void,
): Unsubscribe {

  const path = getPath(userID, key);

  return onSnapshot(doc(firestore, path), snapshot => {

    /**
     * @note
     *
     * This use of metadata.hasPendingWrites seems to go against the Firestore
     * docs' words: it suggests that you should simply always listen to the
     * snapshot, since it will be called immediately upon any local .set()
     * calls. However: since I want to *debounce* the uploads to save on
     * document writes, I am updating the local state and the Firestore copy
     * separately (since, if I didn't, local changes would not appear until
     * the debounce finished waiting). That means I have to ignore the updates
     * caused by that debounced copy.
     *
     * Basically, this condition says, "only run this code when the update
     * comes from the server, not locally."
     */

    // If the document exists and isn't the result of the debounced upload we
    // just did, run the handler (for importing it into the local state)
    if (snapshot.exists() && !snapshot.metadata.hasPendingWrites) {
      const data = snapshot.data();

      // unwrap the list-info from the user-progress object (see @note below)
      const item = unwrapItem(key, data as WrappedItem<K>);
      if (item === undefined) return onEmpty();

      if (isStorageItem(key, item)) return onValue(item);
      else {
        throw new Error("Invalid data in Firestore.");
      }
    }

    // If the document doesn't exist, that means that it's their first time
    // signing in: we need to make a document for them. We pass this off to
    // the calling function.
    else if (!snapshot.exists) return onEmpty();

  });

}


function __setItem__<K extends StorageKey>(
  userID: string,
  key: K,
  item: StorageItem<K>
): Promise<void> {

  const document = doc(firestore, getPath(userID, key));
  const data = wrapItem(key, item);

  return updateDoc(document, data).catch(() => setDoc(document, data));

}


// Each debounce has separate queues: to avoid overwriting a write to one
// document with a write to another, we use a different function for each key.
const debounced = {
  progress: debounce(__setItem__, 1000),
  settings: debounce(__setItem__, 1000),
  listInfo: debounce(__setItem__, 1000),
}


/**
 * Updates a document in Firestore.
 * @param userID The ID of the user whose data is to be updated
 * @param key The item in Firestore that is being updated
 * @param item The new data
 * @returns A promise which resolves when the set is complete
 */
export const setItem = <K extends StorageKey>(
  userID: string,
  key: K,
  item: StorageItem<K>
) => {
  let func: typeof debounced.progress;

  if (isListID(key)) func = debounced.progress;
  else if (key == 'list-info') func = debounced.listInfo;
  else func = debounced.settings;

  return func(userID, key, item);
}


export async function removeUserData(userID: string) {

  const path = `/user-data/${userID}`;
  await deleteDoc(doc(firestore, path));

}


export async function removeLists(userID: string, lists: ListID[]) {

  await Promise.all(lists.map(async id => {
    const path = `/user-data/${userID}/progress/${id}`;
    await deleteDoc(doc(firestore, path));
  }));

}