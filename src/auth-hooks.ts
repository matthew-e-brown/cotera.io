import { Ref } from 'vue';

import { auth } from '@/firebase';
import {
  getRedirectResult, signInWithPopup, signInWithRedirect, linkWithPopup,
  linkWithRedirect, reauthenticateWithPopup, reauthenticateWithRedirect,
  GoogleAuthProvider, AuthProvider, User, UserCredential
} from 'firebase/auth';

interface AuthOptions {
  errors?: Ref<string[]>;
  errorHandler?: (error: any) => void;
}


/**
 * Contains the "polite" error messages for any error code that could be caused
 * by *user* error. Anything else should be handled as an error normally instead
 * of simply presented to the user.
 */
const errorMessages = new Map<string, string>([

  [ 'auth/email-already-in-use',
    "Sorry, an account with that email address already exists." ],

  [ 'auth/invalid-email',
    "Please use a valid email address." ],

  [ 'auth/weak-password',
    "Please use a stronger password (of at least six characters)." ],

  [ 'auth/user-not-found',
    "No account with that email address could be found." ],

  [ 'auth/wrong-password',
    "Sorry, that password is incorrect." ],

  [ 'auth/cancelled-popup-request',
    "Only one popup window can be use at a time: please use the most " +
    "recently opened one." ],

  [ 'auth/timeout',
    "Sorry, your request timed out before the action was completed. " +
    "Please try again." ]

]);


/**
 * An error-handler to use when you've done basically everything else, and
 * you're not sure what else to account for. This is the "fatal" error handler:
 * it presents it to the user as "something went wrong."
 * @param error The error from Firebase.
 */
export const fallbackHandler = (error: any): void => {
  console.log("An unexpected error occurred. See it logged below:");
  console.error(error);
  alert(
    "Something unexpected went wrong. Please check the console for details."
  );
}


/**
 * Hook for executing auth methods with error handling. When an error occurs, it
 * is checked against one of the "polite" values in the above Map. If one is
 * found, it is pushed to the provided reference array and false is returned. If
 * not, it is treated as an actual error and handled with the default handler or
 * optionally provided one.
 * @param options The options to shape this hook.
 * @param options.errors A reference to an array of strings to insert the errors
 * into.
 * @param options.errorHandler The function to pass errors to.
 * @returns A set of functions which return 'true' on success and 'false' on
 * error.
 */
export function useAuthFlow(options?: AuthOptions) {

  const catcher = (error: any): void => {
    const message = errorMessages.get(error.code) ?? false;

    // if there's a 'polite' error message
    if (message && options?.errors) options.errors.value.push(message);
    // if there was a secondary error handler provided
    else if (options?.errorHandler) options.errorHandler(error);
    // otherwise...
    else fallbackHandler(error);
  }

  /**
   * Executes a Firebase Auth Action with error handling.
   * @param call The promise to wait for.
   * @param retValRef Optionally, a reference to be filled with the return value
   * of the above call.
   * @returns A promise of either true or false, depending on success.
   */
  const authExecutor = async (
    call: Promise<UserCredential | void> | Promise<User>,
    retValRef?: Ref<UserCredential | undefined> | Ref<User>
  ) => {
    try {
      const result = await call;

      if (retValRef !== undefined && result !== undefined) {
        retValRef.value = result;
      }

      // If call went through without throwing
      return true;
    } catch (error) {
      catcher(error);
      return false;
    }
  }

  const handleRedirection = async () => {
    try {
      const userCred = await getRedirectResult(auth);

      // If a redirect actually happened, and no error got thrown
      if (userCred?.user) return true;
      else return undefined as void;
    } catch (error) {
      catcher(error);
      return false;
    }
  }

  return { authExecutor, handleRedirection };
}


/**
 * Hook for generating Firebase Auth Google functions. These simply wrap the
 * popup-or-redirect-if-failed flow.
 * @param provider The AuthProvider to use for the third party functions. If
 * nothing is passed, Google will be used.
 * @returns The new functions to use.
 */
export function useThirdPartyAuth(provider?: AuthProvider) {

  const prov = provider ?? new GoogleAuthProvider();

  /**
   * Helper function for creating the wrapped redirect-if-popup-failed flow.
   * @param popup A function to run that will return a promise from a Firebase
   * method.
   * @param redirect A function that will run a Firebase method and trigger a
   * redirection.
   * @returns The new function.
   */
  const factory = (
    popup: () => Promise<UserCredential | void>,
    redirect: () => Promise<never>
  ) => {

    return async () => {
      try {
        return await popup();
      } catch (error) {
        if (error.code == 'auth/popup-blocked') return await redirect();
        else if (error.code != 'auth/popup-closed-by-user') throw error;
      }
    }

  }

  /**
   * @note
   *
   * auth.currentUser is asserted non-null in the applicable instances below
   * because the functions are expected to be used in a route which is guarded
   * by route.meta.requiredAuthState.
   */

  /**
   * Signs the user into a Google account.
   */
  const signIn = factory(
    () => signInWithPopup(auth, prov),
    () => signInWithRedirect(auth, prov)
  );

  /**
   * Signs the user into a Google account for the purpose of re-authenticating.
   */
  const reauthenticate = factory(
    () => reauthenticateWithPopup(auth.currentUser!, prov),
    () => reauthenticateWithRedirect(auth.currentUser!, prov)
  );

  /**
   * Links the user's email-and-password account with their Google account.
   */
  const link = factory(
    () => linkWithPopup(auth.currentUser!, prov),
    () => linkWithRedirect(auth.currentUser!, prov)
  );

  return { signIn, reauthenticate, link };
}