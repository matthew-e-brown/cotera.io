import { Ref } from 'vue';
import { NavigationFailure, RouteRecordName } from 'vue-router';
import router from '@/router';

import firebase from 'firebase/app';
import 'firebase/auth';

type EmailPasswordAuthFunction = (
  email: string,
  password: string
) => Promise<firebase.auth.UserCredential> | Promise<void>;

type ProviderAuthFunction = (
  provider: firebase.auth.AuthProvider
) => Promise<firebase.auth.UserCredential> | Promise<void>;

/**
 * @note
 *
 * auth().currentUser is asserted non-null in the applicable instances below
 * because the functions are expected to be used in a route which is guarded by
 * route.meta.requiredAuthState.
 *
 * In some cases, properties of the user is as well. For example,
 * auth().currentUser!.email! -- this App doesn't have anonymous users, and this
 * function will only be called if the user 
 */

/**
 * Contains the "polite" error messages for any error code that could be caused
 * by *user* error. Anything else should be handled as an error normally instead
 * of simply presented to the user.
 */
export const errorMessages = new Map<`auth/${string}`, string>([
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
 * A hook for the two other auth-flow hooks. This hook handles actually
 * executing the signIn, createAccount, etc. hooks exported by
 * useEmailPasswordAuth() and useGoogleAuth().
 * @param options Options about the route using this hook
 * @param options.errors A reference to the string array to dump user errors
 * into.
 * @param options.successForward The name of the route to forward to upon
 * success. If 'false', authExecutor will return 'true' on success.
 * @param options.errorHandler An optional function to pass errors to.
 * @returns Wrapper functions for handling auth.
 */
export function useFormSubmit(options: {
  errors: Ref<string[]>
  successForward: RouteRecordName | false,
  errorHandler?: ((error: any) => void)
}) {

  const defaultErrorHandler = (error: any): void => {
    console.error(error);
    alert(
      `Something went wrong. Please notify the developer that ` +
      `${error.code || error.message || error} occurred.`
    );
  }

  /**
   * Executes an auth action with error handling.
   * @param call A promise which resolves with the execution of a Firebase Auth
   * action, like those exported by the hooks below.
   * @returns If successForward was 'false', this function will return 'true' on
   * success. Otherwise, it will return a Promise for the RouteNavigation. It
   * will return 'false' on error.
   */
  const authExecutor = async (call: Promise<true | string | void>) => {
    try {
      const attempt = await call;
      if (attempt === true || attempt === undefined) {
        if (options.successForward)
          return router.push({ name: options.successForward });
        else return true;
      } else {
        options.errors.value.push(attempt);
        return false;
      }
    } catch (error) {
      if (options.errorHandler === undefined) defaultErrorHandler(error);
      else options.errorHandler(error);
      return false;
    }
  }

  /**
   * Checks if this page loaded with a redirection result.
   * @returns A promise which, upon success, will resolve to 'true' or to a
   * RouteNavigation, depending on options.successForward; and, on failure, will
   * resolve with 'false'.
   */
  const handleRedirection = () => firebase.auth().getRedirectResult()
    .then(async (userCred: firebase.auth.UserCredential) => {
      if (userCred.user !== null) {
        if (options.successForward)
          return router.replace({ name: options.successForward })
        else return true;
      }
    })
    .catch((error: any) => {
      const message = errorMessages.get(error.code);
      if (message !== undefined) options.errors.value.push(message);
      else if (options.errorHandler === undefined) defaultErrorHandler(error);
      else options.errorHandler(error);
      return false;
    });

  return { authExecutor, handleRedirection };
}


export function useEmailPasswordAuth() {

  /**
   * A helper function which generates a new function that performs the desired
   * Firebase action.
   * @param getAction A function which will return the Firebase function to
   * perform with the email and password.
   * @returns The new function.
   * @note A function is used to retrieve the Firebase action because we want to
   * make sure the auth() and auth().currentUser objects are what they should be
   * at the runtime of the final functions.
   * @note The functions returned by getAction should be bound to the
   * firebase.auth() context.
   */
  const authFunctionFactory = (
    getAction: (() => EmailPasswordAuthFunction)
  ) => {
    return async (email: string, password: string) => {
      try {
        await getAction()(email, password);
      } catch (error) {
        const message = errorMessages.get(error.code);
        if (message !== undefined) return message;
        else throw error;
      }
      return true;
    }
  }

  /**
   * Signs the user into their account.
   */
  const signIn = authFunctionFactory(
    () => firebase.auth().signInWithEmailAndPassword.bind(firebase.auth())
  );

  /**
   * Creates a new account which can be signed into with the provided email and
   * password.
   */
  const createAccount = authFunctionFactory(
    () => async (email: string, password: string) => {
      const userCred = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return await userCred.user?.sendEmailVerification();
    }
  );

  /**
   * Reauthenticates the user into an existing account.
   */
  const reauthenticate = authFunctionFactory(
    () => async (email: string, password: string) => {
      const cred = firebase.auth.EmailAuthProvider.credential(email, password);
      return await firebase
        .auth()
        .currentUser!
        .reauthenticateWithCredential(cred);
    }
  );

  /**
   * Links the email and password to an existing account with another provider,
   * like a Google account.
   */
  const link = authFunctionFactory(
    () => async (email: string, password: string) => {
      const cred = firebase.auth.EmailAuthProvider.credential(email, password);
      const userCred = await firebase
        .auth()
        .currentUser!
        .linkWithCredential(cred);
      return await userCred.user?.sendEmailVerification();
    }
  );

  return { signIn, createAccount, reauthenticate, link };
}


export function useGoogleAuth() {

  /**
   * Helper function for creating a new function which will perform the desired
   * Firebase Auth action using either the popup flow or the redirect flow (if
   * popup is not supported).
   * @param getPopupAction A function which will return the Firebase Auth
   * function to use when attempting the popup flow.
   * @param getRedirectAction A function which will return the Firebase Auth
   * function to use when attempting the redirection flow, should the popup flow
   * fail (like on mobile/PWA)
   * @returns The new function.
   * @note Functions are used for getPopupAction and getRedirectAction because
   * they involve calling firebase.auth(), a function: we want to do that at
   * run-time, not when the component using this hook is setup.
   * @note The functions returned from get(Popup|Redirect)Action must be bound
   * to the firebase.auth() context.
   */
  const authFunctionFactory = (
    getPopupAction: (() => ProviderAuthFunction),
    getRedirectAction: (() => ProviderAuthFunction)
  ) => {
    return async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await getPopupAction()(provider);
      } catch (error) {
        const message = errorMessages.get(error.code);
        if (error.code == 'auth/popup-blocked')
          await getRedirectAction()(provider);
        else if (message !== undefined) return message;
        else throw error;
      }
      return true;
    }
  }

  /**
   * Signs the user into a Google account.
   */
  const signIn = authFunctionFactory(
    () => firebase.auth().signInWithPopup.bind(firebase.auth()),
    () => firebase.auth().signInWithRedirect.bind(firebase.auth())
  );

  /**
   * Signs the user into a Google account for the purpose of reauthenticating.
   */
  const reauthenticate = authFunctionFactory(
    () => firebase.auth().currentUser!.reauthenticateWithPopup
      .bind(firebase.auth()),
    () => firebase.auth().currentUser!.reauthenticateWithRedirect
      .bind(firebase.auth())
  );

  /**
   * Links the user's email-and-password account with their Google account.
   */
  const link = authFunctionFactory(
    () => firebase.auth().currentUser!.linkWithPopup.bind(firebase.auth()),
    () => firebase.auth().currentUser!.linkWithRedirect.bind(firebase.auth())
  );

  return { signIn, reauthenticate, link };
}