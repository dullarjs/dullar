import popover from "./popover.vue";
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(popover as AnyObject).install = (Vue: VueConstructor) => {
  Vue.component(popover.name, popover);
};
export default popover;
