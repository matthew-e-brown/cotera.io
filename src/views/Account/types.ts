export enum ModalReasons {
  Authorize,
  UnlinkProvider,
  WarningReset,
  WarningDelete,
  WarningDeleteFinal,
}

export interface ModalPayload {
  reason: ModalReasons;
  extraData?: any;
}