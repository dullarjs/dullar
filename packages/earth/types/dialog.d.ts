/*
* @Author: Just be free
* @Date:   2021-09-08 16:00:09
* @Last Modified by:   Just be free
* @Last Modified time: 2021-10-12 18:01:19
* @E-mail: justbefree@126.com
*/

export type DialogOptions = {
  title?: string;
  message?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  cancelLoadingText?: string;
  confirmButtonText?: string;
  confirmLoadingText?: string;
  loadingColor?: string;
  closeModelOnClick?: boolean;
  zIndex?: number;
  className?: string;
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: (e: string) => void;
  afterClose?: (e: string) => void;
}
export interface Dialog {
  alert(options: DialogOptions): void;
  confirm(options: DialogOptions): void;
}

export const Dialog: Dialog;

declare module 'vue/types/vue' {
    interface Vue {
        Dialog: Dialog
    }
}
