export enum ModalReasons {
  Reauthorize          = 're-auth',
  ResetWarning         = 'reset-warning',
  DeleteWarning        = 'deletion-warning',
  DeleteFinalWarning   = 'delete-final-warning'
}

export interface ModalPayload {
  reason: ModalReasons;
  callback: () => Promise<any>;
}