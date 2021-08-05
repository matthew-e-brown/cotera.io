import { ref } from 'vue';

const TIMEOUT_TIME = 15 * 60 * 1000; // 15m00s before timeout
const STORAGE_KEY = 'authed-time';
let timeout: number | undefined;


/**
 * @note
 * The session control stuff in this file is not very secure, but it doesn't
 * have to be. This is all just a wrapper around Firebase's built in
 * `auth/requires-recent-login` error. All it does is make sure they've signed
 * in *recently*. Using my own thing let's me ask *before* the user attempts to
 * do things, as opposed to Firebase's approach of letting the first attempt
 * fail.
 */


/**
 * Checks sessionStorage for whether or not 
 * @returns Whether or not the user has recently authorized.
 */
const checkTimeAuthed = (): boolean => {
  const lastTime = sessionStorage.getItem(STORAGE_KEY);

  // If they didn't have a timestamp in sessionStorage, they aren't authed
  if (lastTime === null) return false;

  const timestamp = parseInt(lastTime);

  if (isNaN(timestamp)) {
    sessionStorage.removeItem(STORAGE_KEY); // remove the junk value
    return false;
  }

  const t0 = (new Date(timestamp)).getTime();
  const t1 = Date.now();

  return t1 - t0 < TIMEOUT_TIME;
}


export const sessionOpen = ref(checkTimeAuthed());


/**
 * Clears the timeout and sets the state to locked.
 */
export const lock = (): void => {
  clearTimeout(timeout);
  sessionStorage.removeItem(STORAGE_KEY);
  sessionOpen.value = false;
}


/**
 * Sets a timeout and unlocks the state ref to allow access to buttons in the
 * Account.
 */
export const unlock = (): void => {
  // Set a timestamp in localStorage that will expire in 10 minutes
  const timestamp = Date.now().toString();
  sessionStorage.setItem(STORAGE_KEY, timestamp);
  sessionOpen.value = true;

  // If they keep their window open for TIMEOUT_TIME minutes, re-lock. If they
  // don't, this timeout will be unloaded and nothing will happen
  clearTimeout(timeout);
  timeout = setTimeout(lock, TIMEOUT_TIME);
}