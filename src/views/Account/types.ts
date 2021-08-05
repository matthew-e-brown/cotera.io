export enum ModalReasons {
  Authorize,
  UnlinkProvider,
  WarningReset,
  WarningDelete,
  WarningDeleteFinal,
}

export interface ModalPayload {
  reason: ModalReasons;
  callback?: (() => (void | Promise<void>));
  data?: any;
}