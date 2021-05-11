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

  const generateFlow = (
    getMethod: (() => EmailPasswordAuthFunction),
  ): ((email: string, password: string) => Promise<true | string>) => {
    return async (email, password) => {
      try {
        await getMethod()(email, password);
      } catch (error) {
        const message = errorMessages.get(error.code);
        if (message !== undefined) return message;
        else throw error;
      }
      return true;
    }
  }

  const signIn = generateFlow(
    () => firebase.auth().signInWithEmailAndPassword
  );

  const createAccount = generateFlow(
    () => async (email: string, password: string) => {
      const userCred = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return await userCred.user?.sendEmailVerification();
    }
  );

  const reauthenticate = generateFlow(
    () => async (email: string, password: string) => {
      const cred = await firebase
        .auth
        .EmailAuthProvider
        .credential(email, password);
      return await firebase
        .auth()
        .currentUser!
        .reauthenticateWithCredential(cred);
    }
  );

  const link = generateFlow(
    () => async (email: string, password: string) => {
      const cred = await firebase
        .auth
        .EmailAuthProvider
        .credential(email, password);
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
  const provider = new firebase.auth.GoogleAuthProvider();

  /**
   * Creates a new function which will perform the desired Firebase Auth action
   * using either the popup flow, if supported, or the redirect flow.
   * @param getPopupMethod A function which will return the Firebase Auth
   * function to use when attempting the popup flow.
   * @param getRedirectMethod A function which will return the Firebase Auth
   * function to use when attempting the redirection flow, should the popup flow
   * fail (like on mobile/PWA)
   * @returns The new function.
   * @note Functions are used for popupAction and redirectAction because they
   * involve calling firebase.auth(), a function: we want to do that at
   * run-time, not when the component using this hook is setup.
   */
  const generateFlow = (
    getPopupMethod: (() => ProviderAuthFunction),
    getRedirectMethod: (() => ProviderAuthFunction)
  ): (() => Promise<true | string>) => async () => {
    try {
      await getPopupMethod()(provider);
    } catch (error) {
      const message = errorMessages.get(error.code);

      if (error.code == 'auth/popup-blocked')
        await getRedirectMethod()(provider);

      else if (message !== undefined) return message;
      else throw error;
    }
    return true;
  }

  /**
   * Signs the user into a Google account.
   */
  const signIn = generateFlow(
    () => firebase.auth().signInWithPopup,
    () => firebase.auth().signInWithRedirect
  );

  /**
   * Signs the user into a Google account for the purpose of reauthenticating.
   */
  const reauthenticate = generateFlow(
    () => firebase.auth().currentUser!.reauthenticateWithPopup,
    () => firebase.auth().currentUser!.reauthenticateWithRedirect
  );

  /**
   * Links the user's email-and-password account with their Google account.
   */
  const link = generateFlow(
    () => firebase.auth().currentUser!.linkWithPopup,
    () => firebase.auth().currentUser!.linkWithRedirect
  );

  return { signIn, reauthenticate, link };
}