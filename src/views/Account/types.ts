// use strings so that we can insert values into the DOM and toggle things with
// CSS
export enum ModalReasons {
  Authorize           =  'authorize',
  UnlinkProvider      =  'unlink-provider',
  WarningReset        =  'warning-reset',
  WarningDelete       =  'warning-delete',
  WarningDeleteFinal  =  'warning-delete-final',
}

export interface ModalPayload {
  reason: ModalReasons;
  callback?: (() => (void | Promise<void>));
  data?: any;
}