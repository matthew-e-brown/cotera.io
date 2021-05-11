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
 * Contains the "polite" error codes for any error that could be caused by
 * *user* error.
 */
const errorMessages = new Map<`auth/${string}`, string>([
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
    "recently opened one." ]
]);


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