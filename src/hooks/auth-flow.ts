import { Ref } from 'vue';
import { NavigationFailure, RouteRecordName } from 'vue-router';
import router from '@/router';

import firebase from 'firebase/app';
import 'firebase/auth';

type AuthProvider = firebase.auth.AuthProvider;
type UserCredential = firebase.auth.UserCredential;

interface AuthOptions {
  errors: Ref<string[]>;
  errorHandler?: ((error: any) => void);
  redirectName?: RouteRecordName;
}


/**
 * Contains the "polite" error messages for any error code that could be caused
 * by *user* error. Anything else should be handled as an error normally instead
 * of simply presented to the user.
 */
export const errorMessages = new Map<string, string>([
  [ 'auth/email-already-in-use',
    "An account with that email address already exists." ],
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
  console.error(error);
  alert(
    `Something went wrong. Please notify the developer that ` +
    `${error.code || error.message || error} occurred.`
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
 * @param options.redirectName The name of the NamedRoute to redirect to upon
 * completion. Should it be absent, no redirect will happen.
 * @returns A set of functions which return 'true' on success, 'false' on error,
 * 'NavigationFailure' when the error occurs specifically when trying to
 * redirect.
 */
export function useAuthFlow(options: AuthOptions) {

  const redirect = options.redirectName !== undefined;

  const authExecutor = async (call: Promise<UserCredential | void>) => {
    try {

      await call;

      if (redirect) {
        const reResult = await router.push({ name: options.redirectName });
        if ((reResult as NavigationFailure)?.type !== undefined)
          return reResult as NavigationFailure;
      }

      return true;

    } catch (error) {
      const message = errorMessages.get(error.code) ?? false;

      if (message) options.errors.value.push(message);
      else (options.errorHandler ?? fallbackHandler)(error);

      return false;
    }
  }

  const handleRedirection = async () => {
    try {
      const userCred = await firebase.auth().getRedirectResult();

      // If a redirect actually happened
      if (userCred.user !== null) {
        if (redirect) {
          const reResult = await router.replace({ name: options.redirectName });
          if ((reResult as NavigationFailure)?.type !== undefined)
            return reResult as NavigationFailure;
          else return true;
        } else return true;
      }

    } catch (error) {
      const message = errorMessages.get(error.code) ?? false;

      if (message) options.errors.value.push(message);
      else (options.errorHandler ?? fallbackHandler)(error);

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

  const prov = provider ?? new firebase.auth.GoogleAuthProvider();

  /**
   * Helper function for creating the wrapped redirect-if-popup-failed flow.
   * @param popupAction A getter function which will return a Firebase Auth
   * action to use for the popup flow.
   * @param redirectAction A getter function which will return the Firebase Auth
   * action to use for the redirect flow, should the popup flow fail (like on
   * mobile/PWA).
   * @returns The new function.
   * @note Getters are used for popupAction and redirectAction because we want
   * to make sure we have an up to date instance of firebase.auth() when we run
   * them.
   */
  const authFactory = (
    popupAction: () => ((p: AuthProvider) => Promise<UserCredential | void>),
    redirectAction: () => ((p: AuthProvider) => Promise<void>)
  ): (() => Promise<UserCredential | void>) => {
    return async () => {
      try {
        return await popupAction().call(firebase.auth(), prov);
      } catch (error) {
        if (error.code == 'auth/popup-blocked')
          return await redirectAction().call(firebase.auth(), prov);
        else throw error;
      }
    }
  }

  /**
   * @note
   *
   * auth().currentUser is asserted non-null in the applicable instances below
   * because the functions are expected to be used in a route which is guarded
   * by route.meta.requiredAuthState.
   */

  /**
   * Signs the user into a Google account.
   */
  const signIn = authFactory(
    () => firebase.auth().signInWithPopup,
    () => firebase.auth().signInWithRedirect
  );

  /**
   * Signs the user into a Google account for the purpose of reauthenticating.
   */
  const reauthenticate = authFactory(
    () => firebase.auth().currentUser!.reauthenticateWithPopup,
    () => firebase.auth().currentUser!.reauthenticateWithRedirect
  );

  /**
   * Links the user's email-and-password account with their Google account.
   */
  const link = authFactory(
    () => firebase.auth().currentUser!.linkWithPopup,
    () => firebase.auth().currentUser!.linkWithRedirect
  );

  return { signIn, reauthenticate, link };
}