import { AnyObject } from "@/types";
import CityPicker from "./cityPicker.vue";
import { VueConstructor } from "vue";
(CityPicker as AnyObject).install = (Vue: VueConstructor) => {
  Vue.component(CityPicker.name, CityPicker);
};
export default CityPicker;