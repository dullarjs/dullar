import indicator from "./indicator.vue";
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(indicator as AnyObject).install = (Vue: VueConstructor) => {
  Vue.component(indicator.name, indicator);
};
export default indicator;
