import { InjectionKey, Ref } from 'vue';

// use strings so that we can insert values into the DOM and toggle things with
// CSS
export enum ModalReason {
  Reauthorize         =  'reauthorize',
  LinkEmailPassword   =  'link-email-password',
  UnlinkProvider      =  'unlink-provider',
  WarningReset        =  'warning-reset',
  WarningDelete       =  'warning-delete',
  WarningDeleteFinal  =  'warning-delete-final',
}

type ModalCallback = () => (void | Promise<void>);
export interface ModalPayload {
  reason: ModalReason;
  callback?: ModalCallback;
  extraData?: any;
}

export const ModalPayloadKey: InjectionKey<
  Ref<ModalPayload | null>
> = Symbol('modalPayload');