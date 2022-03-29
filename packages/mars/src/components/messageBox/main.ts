import msgboxVue from "./messageBox.vue";
import Vue from "vue";
import { AnyObject } from "@/types";

let instance: msgboxVue, currentMsg: AnyObject;
const defaultCallback = (action: string) => {
  const { option, resolve, reject } = currentMsg;
  const { callback } = option;
  if (currentMsg) {
    if (typeof callback === "function") {
      callback(action);
    }
    if (resolve) {
      if (action === "confirm") {
        resolve(action);
      } else if (reject && ["cancel", "close"].includes(action)) {
        reject(action);
      }
    }
  }
};
const initInstance = () => {
  instance = new msgboxVue({
    el: document.createElement("div")
  });
}
const showNextMsg = () => {
  if (!instance) {
    initInstance();
  }
  const { option } = currentMsg;
  Object.keys(option).forEach(prop => instance[prop] = option[prop]);
  if (option.callback === undefined) {
    instance.callback = defaultCallback;
  }

  // const oldCb = instance.callback;
  // instance.callback = (action: string, instance: AnyObject) => {
  //   oldCb && oldCb(action, instance);
  //   showNextMsg();
  // };

  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });
}
const MessageBox = function(option: AnyObject) {
  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      currentMsg = {
        option,
        resolve,
        reject
      };
      showNextMsg();
    });
  } else {
    currentMsg = {
      option
    };
    showNextMsg();
  }
};
export default MessageBox; 
