/*
* @Author: Just be free
* @Date:   2020-08-25 11:35:55
* @Last Modified by:   Just be free
* @Last Modified time: 2020-08-25 18:21:45
* @E-mail: justbefree@126.com
*/

type IndicatorString = string;
type IndicatorNumber = number;
type IndicatorBoolean = boolean;
export type IndicatorOptions = {
    message: IndicatorString,
    width: IndicatorString,
    showCancelButton: IndicatorBoolean,
    showConfirmButton: IndicatorBoolean,
    cancelButtonText: IndicatorString,
    cancelLoadingText: IndicatorString,
    confirmButtonText: IndicatorString,
    confirmLoadingText: IndicatorString,
    loadingColor: IndicatorString,
    closeModelOnClick: IndicatorBoolean,
    zIndex: IndicatorNumber,
    showHeader: IndicatorBoolean,
    showFooter: IndicatorBoolean,
    footerTopBorder: IndicatorBoolean,
    buttonSize: IndicatorString,
}
export interface Modal {
    alert(options: IndicatorOptions): void;
    confirm(): void;
}

export const Modal: Modal;
