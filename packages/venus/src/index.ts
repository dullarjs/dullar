/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:16
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 17:02:56
* @E-mail: justbefree@126.com
*/
import { version } from "../package.json";
// TOOLS
import { deepClone } from "./utils/deep-clone";
const Tools = {
  deepClone
}
import "./index.scss";
import VButton from "./button";
import VIcon from "./icon";
import VSpin from "./spin";
import VFlex from "./flex";
import VFlexItem from "./flex-item";
import VToast from "./toast";
import VPopup from "./popup";
import VCheckbox from "./checkbox";
import VRadiobox from "./radiobox";
import Dialog, { VDialog } from "./dialog";
import VSticky from "./sticky";
import VCalendar from "./calendar";
import VLayout from "./layout";
import VCitypicker from "./citypicker";
import VIndicator from "./indicator";
import VActionSheet from "./action-sheet";
import VSkeleton from "./skeleton";
import VPicker from "./picker";
import VDatePicker from "./date-picker";
import VSwipe from "./swipe";
import VSwipeItem from "./swipe-item";
import VField from "./field";
// import QDropdown from "./dropdown";
export interface VenusConfigOptions {
  [propName: string]: any;
}
const configOptions = {} as VenusConfigOptions;
const components = [VIcon, VSpin, VButton, VLayout, VPopup, VCheckbox, VRadiobox, VFlex, VFlexItem, VDialog, VPicker, VDatePicker, VSticky, VCalendar, VCitypicker, VActionSheet, VSwipe, VSwipeItem, VField, VSkeleton];
const install = (app: any, options: any) => {
  components.map(component => {
    const merge = (component as any).extendData;
    if (merge && typeof merge === "function") {
      merge(configOptions[component.componentName]);
    }
    if (component.componentName) {
      app.component(component.componentName, component);
    }
  });
  app.config.globalProperties.Toast = VToast;
  app.config.globalProperties.Dialog = Dialog;
  app.config.globalProperties.Indicator = VIndicator;
  app.config.compilerOptions.isCustomElement = (tag: string) => tag.startsWith("v-");
};
const config = (options: VenusConfigOptions) => {
  Object.keys(options).forEach((attr: string) => {
    configOptions[attr] = options[attr];
  });
};
const Venus = { install, version, config, Tools };
export { VButton, VSpin, VIcon, VLayout, VPopup, VCheckbox, VRadiobox, VFlex, VFlexItem, VDialog, VPicker, VDatePicker, VSticky, VCalendar, VCitypicker, VActionSheet, VSwipe, VSwipeItem, VField, VSkeleton };
export default Venus;
