import { debounce } from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { StorageKey, StorageItem, isStorageItem, isListID } from './types'

namespace CloudStorage {

  /**
   * The functions returned from Firestore subscriptions to stop listening for
   * updates.
   */
  export type Subscription = (() => void) | undefined;


  /**
   * Generates a path for accessing documents in Firestore.
   * @param userID The userID to generate a path with
   * @param key The document to generate a path with
   * @returns A path pointing to a document in Firestore
   */
  function getPath<T extends StorageKey>(userID: string, key: T) {
    let path: string;

    if (isListID(key)) path = `/user-progress/${userID}/progress/${key}`;
    else if (key == 'list-info') path = `/user-progress/${userID}/lists`;
    else if (key == 'user-settings') path = `/user-settings/${userID}`;
    else { throw new Error("Invalid StorageKey"); }

    return path;
  }


  /**
   * Subscribes to a document reference in Firestore.
   * @param userID The ID of the user whose data is to be listened to
   * @param key The item that is being listened to
   * @param onValue The handler function to run once data is confirmed to be
   * valid
   * @param onError The handler function to be run if either there is invalid
   * data in Firestore, or if there is no data in Firestore. These two scenarios
   * will have 'invalid-data' or 'no-data' passed to the handler respectively.
   * @returns A function which can be called to unsubscribe from the listener.
   */
  export function subscribe<T extends StorageKey>(
    userID: string,
    key: T,
    onValue: (item: StorageItem<T>) => void,
    onError: (code: 'invalid-data' | 'no-data') => void,
  ): Subscription {

    const path = getPath(userID, key);

    return firebase.firestore()
      .doc(path)
      .onSnapshot(snapshot => {

        /**
         * @note
         *
         * This use of metadata.hasPendingWrites seems to go against the
         * Firestore docs' words: it suggests that you should simply always
         * listen to the snapshot, since it will be called immediately upon any
         * local .set() calls. However: since I want to *debounce* the uploads
         * to save on document writes, I am updating the local state and the
         * Firestore copy separately (since, if I didn't, local changes would
         * not appear until the debounce finished waiting). That means I have to
         * ignore the updates caused by that debounced copy.
         *
         * Basically, this condition says, "only run this code when the update
         * comes from the server, not locally."
         */

        // If the document exists and isn't the result of the debounced upload
        // we just did, run the handler (for importing it into the local state)
        if (snapshot.exists && !snapshot.metadata.hasPendingWrites) {
          const data = snapshot.data();

          if (isStorageItem(key, data)) return onValue(data);
          else return onError?.('invalid-data');
        }

        // If the document doesn't exist, that means that it's their first time
        // signing in: we need to make a document for them. We pass this off to
        // the calling function.
        else return onError?.('no-data');

      });

  }


  function __setItem__<T extends StorageKey>(
    userID: string,
    key: T,
    item: StorageItem<T>
  ): Promise<void> {

    const path = getPath(userID, key);
    return firebase.firestore().doc(path).set(item);

  }


  /**
   * Updates a document in Firestore.
   * @param userID The ID of the user whose data is to be updated
   * @param key The item in Firestore that is being updated
   * @param item The new data
   * @returns A promise which resolves when the set is complete
   */
  export const setItem = debounce(__setItem__, 900);

}


export default CloudStorage;