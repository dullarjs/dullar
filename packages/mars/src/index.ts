import "./utils/window-event";


import { VueConstructor } from "vue/types/umd";
import { AnyObject } from "./types";
import Spin from "./components/spin";
import CityPicker from "./components/cityPicker";
import Dialog from "./components/dialog";
import Popover from "./components/popover";
import Indicator from "./components/indicator";
import Iconfont from "./components/iconfont";
import Radiobox from "./components/radiobox";
import Checkbox from "./components/checkbox";
import Field from "./components/field";
import Select from "./components/select";
import Option from "./components/select/option.vue";

interface MarsConfigOptions {
  [propName: string]: any;
}
const configOptions: MarsConfigOptions = {};
export const components: AnyObject = {
  Option,
  Select,
  Field,
  Checkbox,
  Radiobox,
  Iconfont,
  Indicator,
  Spin,
  CityPicker,
  Dialog,
  Popover
}

const install = (Vue: VueConstructor): void => {
  Object.keys(components).map(compName => {
    const comp = components[compName];
    const merge = (comp as any).extendData;
    if (merge && typeof merge === "function") {
      merge(configOptions[comp.componentName]);
    }
    if (typeof comp === "function") {
      Vue.component(comp.componentName, comp);
    }
  });
  Vue.prototype.Indicator = Indicator;
};
const config = (options: MarsConfigOptions) => {
  Object.keys(options).forEach((attr: string) => {
    configOptions[attr] = options[attr];
  });
};
export default {
  config,
  install
}