import Dialog from "./components/dialog";
import Popover from "./components/popover";

export const components = {
  Dialog,
  Popover
}

const install = (Vue) => {
  Object.keys(components).map(compName => {
    const comp = components[compName];
    Vue.component(compName, comp);
  });
};
export default {
  install
}