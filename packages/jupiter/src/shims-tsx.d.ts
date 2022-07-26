import Vue, { VNode } from 'vue'
import { AnyObject } from './types';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
declare module "@vue/runtime-core" { 
  interface ComponentCustomProperties { 
    Message: (args: AnyObject) => void,
    Msgbox: (args: AnyObject) => Promise,
    Notification: (args: AnyObject) => void,
    Indicator: (args: AnyObject) => void
  }
}
