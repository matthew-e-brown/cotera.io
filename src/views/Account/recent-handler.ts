import { fallbackHandler } from '@/auth-hooks';

/**
 * Wraps the fallback handler with a check for 'requires-recent-login', to avoid
 * treating it like an extraneous error.
 * @param error Error to be handled.
 */
export const errorHandler = (error: any): void => {
  // Throw back out of the AuthHandler flow to be processed by the calling
  // action's code (need to be able to react when attempting to unlink, for
  // example)
  if (error.code === 'auth/requires-recent-login') throw error;
  else fallbackHandler(error);
}