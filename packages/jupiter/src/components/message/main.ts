import { AnyObject, Callback } from "@/types";
import MsgVue from "./message.vue";
import { createApp, ComponentPublicInstance } from "vue";

const msgQueue: AnyObject[] = [];
let seed = 1;
const close = (id: string, userOnClose: Callback | undefined) => {
  const len = msgQueue.length;
  let index = -1;
  let removedHeight = 0;
  for (let i = 0; i < len; i++) {
    if (msgQueue[i].id === id) {
      const msg = msgQueue[i];
      index = i;
      removedHeight = msg.$el.offsetHeight;
      if (typeof userOnClose === "function") {
        userOnClose(msg);
      }
      msgQueue.splice(i, 1);
      break;
    }
  }
  if (len > 1 && index > -1) {
    for (let i = 0; i < len - 1; i++) {
      const dom = msgQueue[i].$el;
      dom.style.top = parseInt(dom.style.top) - removedHeight - 15 + "px"; 
    }
  }
};
const message = function(option: AnyObject) {
  const id = "message_" + seed++;
  const userOnClose = option.onClose;
  option.onClose = function() {
    close(id, userOnClose);
  };
  const div = document.createElement("div");
  // const instance = new MsgVue({
  //   el: document.createElement("div")
  // });
  const instance = createApp(MsgVue).mount(div);
  (instance as ComponentPublicInstance<{ id: string }>).id = id;
  Object.keys(option).forEach(prop => {
    (instance as ComponentPublicInstance<{ [key: string]: any }>)[prop] = option[prop];
  });
  
  let verticalHeight = (instance as ComponentPublicInstance<{ offset: number }>).offset;
  msgQueue.forEach(ins => {
    verticalHeight += ins.$el.getBoundingClientRect().height + 15;
  });
  (instance as ComponentPublicInstance<{ offset: number }>).offset = verticalHeight;
  document.body.appendChild(instance.$el);
  (instance as ComponentPublicInstance<{ visible: boolean }>).visible = true;
  msgQueue.push(instance);

}
export default message;