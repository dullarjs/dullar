import "./utils/window-event";


import { VueConstructor } from "vue/types/umd";
import { AnyObject } from "./types";
import Spin from "./components/spin";
import CityPicker from "./components/cityPicker";
import Dialog from "./components/dialog";
import Popover from "./components/popover";
import Indicator from "./components/indicator";


export const components: AnyObject = {
  Indicator,
  Spin,
  CityPicker,
  Dialog,
  Popover
}

const install = (Vue: VueConstructor): void => {
  Object.keys(components).map(compName => {
    const comp = components[compName];
    Vue.component(compName, comp);
  });
  Vue.prototype.Indicator = Indicator;
};
export default {
  install
}