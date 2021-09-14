/*
* @Author: Just be free
* @Date:   2021-09-07 09:08:32
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-09 11:58:04
* @E-mail: justbefree@126.com
*/

export type ModalOptions = {
    message: string;
    width?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    cancelButtonText?: string;
    cancelLoadingText?: string;
    confirmButtonText?: string;
    confirmLoadingText?: string;
    loadingColor?: string;
    closeModelOnClick?: boolean;
    zIndex?: number;
    showHeader?: boolean;
    showFooter?: boolean;
    footerTopBorder?: boolean;
    buttonSize?: string;
    beforeClose?: (e: string) => void;
    buttonClick?: (e: string, res?: any) => void;
}
export interface Modal {
    alert(options: ModalOptions): void;
    confirm(options: ModalOptions): void;
}

export const Modal: Modal;

declare module 'vue/types/vue' {
    interface Vue {
        Modal: Modal
    }
}
