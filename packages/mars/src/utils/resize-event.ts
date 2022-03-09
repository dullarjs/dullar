import { AnyObject } from '@/types';
// import ResizeObserver from 'resize-observer-polyfill';

class ResizeObserver {
  observer:MutationObserver | null  = null;
  recordOldValue = {
    width: "0",
    height: "0"
  }
  constructor(resizeHandler: (arg: AnyObject[]) => void) {
    debugger;
    this.observer = new MutationObserver((mutationList) => {
      // let checkedList: MutationRecord[] = [];
      for(const mutation of mutationList) {
        console.log(mutation)
        // const { target } = mutation;
        // let width = getComputedStyle(target).getPropertyValue('width');
        // let height = getComputedStyle(target).getPropertyValue('height');
        // if(width !== this.recordOldValue.width || height !== this.recordOldValue.height) {
        //   checkedList.push(mutation);
        // }
      }
      resizeHandler(mutationList);
    })
  }
  observe(target: Node) {
    this.observer && this.observer.observe(target, {
      attributes: true,
      // attributeFilter: ['style'],
      attributeOldValue: true
    })
  }
  disconnect(){
    if(this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
  }
}

/* istanbul ignore next */
const resizeHandler = function(entries: AnyObject[]) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn: () => void) => {
        fn();
      });
    }
  }
};

/* istanbul ignore next */
export const addResizeListener = function(element: AnyObject, fn: () => void) {
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

/* istanbul ignore next */
export const removeResizeListener = function(element: AnyObject, fn: () => void) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};
