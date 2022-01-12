import Dialog from "./dialog.vue";
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(Dialog as AnyObject).install = (Vue: VueConstructor) => {
  Vue.component(Dialog.name, Dialog);
};
export default Dialog;
