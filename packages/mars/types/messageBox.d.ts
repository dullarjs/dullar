export interface MessageBox{
  alert: any

  /** Show a confirm message box */
  confirm: any

  /** Show a prompt message box */
  prompt: any

  /** Set default options of message boxes */
  setDefaults (defaults: any): void

  /** Close current message box */
  close (): void
}

declare module 'vue/types/vue'{
  interface Vue{
    $msgbox: any;
  }
}
