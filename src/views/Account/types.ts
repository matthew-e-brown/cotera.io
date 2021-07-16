import firebase from 'firebase/app';

export enum ModalReasons {
  Reauthorize          = 're-auth',

  LinkEmail            = 'link-email',
  LinkGoogle           = 'link-google',
  UnlinkEmail          = 'unlink-email',
  UnlinkGoogle         = 'unlink-google',

  ResetWarning         = 'reset-warning',
  DeleteWarning        = 'deletion-warning',
  DeleteFinalWarning   = 'delete-final-warning'
}

export interface ModalPayload {
  reason: ModalReasons;
  callback: () => Promise<firebase.auth.UserCredential | void>;
}