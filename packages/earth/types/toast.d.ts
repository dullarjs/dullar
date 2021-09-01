/*
* @Author: Just be free
* @Date:   2020-08-25 11:08:05
* @Last Modified by:   Just be free
* @Last Modified time: 2020-08-25 18:21:13
* @E-mail: justbefree@126.com
*/

import Vue from "vue";
type ToastPosition = "middle" | "bottom";
type ToastMessage = string;
type ToastDuration = number;
export type ToastOptions = {
  position?: ToastPosition;
  message?: string;
  duration?: number;
}
export interface YnToast extends Vue {
  position: ToastPosition;
  message: ToastMessage;
  duration: ToastDuration;
  close(): void;
}
export interface Toast {
  (message: ToastOptions | ToastMessage, options?: ToastOptions): YnToast;
  close(): void;
}
export const Toast: Toast;
