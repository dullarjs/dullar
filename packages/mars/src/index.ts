import { VueConstructor } from "vue/types/umd";
import CityPicker from "./components/cityPicker";
import Dialog from "./components/dialog";
import Popover from "./components/popover";
import { AnyObject } from "./types";

export const components: AnyObject = {
  CityPicker,
  Dialog,
  Popover
}

const install = (Vue: VueConstructor): void => {
  Object.keys(components).map(compName => {
    const comp = components[compName];
    Vue.component(compName, comp);
  });
};
export default {
  install
}