import spin from "./spin";
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(spin as AnyObject).install = (Vue: VueConstructor) => {
  Vue.component(spin.name, spin);
};
export default spin;
