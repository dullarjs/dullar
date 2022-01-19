import { VueConstructor } from "vue/types/umd";
import Dialog from "./components/dialog";
import Popover from "./components/popover";
import { AnyObject } from "./types";

export const components: AnyObject = {
  Dialog,
  Popover
}

const install = (Vue: VueConstructor) => {
  Object.keys(components).map(compName => {
    const comp = components[compName];
    Vue.component(compName, comp);
  });
};
export default {
  install
}