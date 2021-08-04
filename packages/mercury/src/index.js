const EVENTS = {};
import { getConfig } from "./modules/component/config";
import { hyphenate } from "./modules/utils";
const version = getConfig("VUE_APP_VERSION");
import "./index.less";
import "./window-events";

import ActionSheet from "./action-sheet";
import AnimationList from "./animation-list";
import AnimationListItem from "./animation-list-item";
import Button from "./button";
import Category from "./category";
import CategorySelect from "./category-select";
import Checkbox from "./checkbox";
import Counter from "./counter";
import DatePicker from "./date-picker";
import Dialog from "./dialog";
import Field from "./field";
import FieldGroup from "./field-group";
import Flex from "./flex";
import FlexItem from "./flex-item";
import Iconfont from "./iconfont";
import Indicator from "./indicator";
import Layout from "./layout";
import Magnifier from "./magnifier";
import Picker from "./picker";
import PickyStepper from "./picky-stepper";
import Popup from "./popup";
import PullRefresh from "./pull-refresh";
import Radiobox from "./radiobox";
import Skeleton from "./skeleton";
import Slider from "./slider";
import Spin from "./spin";
import Sticky from "./sticky";
import Swipe from "./swipe";
import SwipeItem from "./swipe-item";
import TabItem from "./tab-item";
import Tabs from "./tabs";
import Toast from "./toast";

const components = [
  ActionSheet,
  AnimationList,
  AnimationListItem,
  Button,
  Category,
  CategorySelect,
  Checkbox,
  Counter,
  DatePicker,
  Dialog,
  Field,
  FieldGroup,
  Flex,
  FlexItem,
  Iconfont,
  Indicator,
  Layout,
  Magnifier,
  Picker,
  PickyStepper,
  Popup,
  PullRefresh,
  Radiobox,
  Skeleton,
  Slider,
  Spin,
  Sticky,
  Swipe,
  SwipeItem,
  TabItem,
  Tabs,
  Toast,
];
const install = (Vue) => {
  if (install.installed) return;
  components.map((component) => {
    if (component.name && typeof component !== "function") {
      const eventName = hyphenate(component.name);
      if (EVENTS[eventName] && typeof EVENTS[eventName] === "function") {
        Vue.component(component.name, EVENTS[eventName]());
      } else {
        Vue.component(component.name, component);
      }
    } else if (component.install) {
      Vue.use(component);
    }
  });
  Vue.prototype.Toast = Toast;
  Vue.prototype.Dialog = Dialog;
  Vue.prototype.Indicator = Indicator;
};
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
const config = (options = {}) => {
  Object.keys(options).forEach((componentName) => {
    const ca = hyphenate(componentName);
    components.forEach((component) => {
      if (ca === component.name) {
        if (component.callback && typeof component.callback === "function") {
          EVENTS[ca] = () => {
            return component.callback(options[componentName]);
          };
        }
      }
    });
  });
};
export { install, version, config };
export default {
  install,
  version,
  config,
};
export { ActionSheet as YnActionSheet };
export { AnimationList as YnAnimationList };
export { AnimationListItem as YnAnimationListItem };
export { Button as YnButton };
export { Category as YnCategory };
export { CategorySelect as YnCategorySelect };
export { Checkbox as YnCheckbox };
export { Counter as YnCounter };
export { DatePicker as YnDatePicker };
export { Dialog as YnDialog };
export { Field as YnField };
export { FieldGroup as YnFieldGroup };
export { Flex as YnFlex };
export { FlexItem as YnFlexItem };
export { Iconfont as YnIconfont };
export { Indicator as YnIndicator };
export { Layout as YnLayout };
export { Magnifier as YnMagnifier };
export { Picker as YnPicker };
export { PickyStepper as YnPickyStepper };
export { Popup as YnPopup };
export { PullRefresh as YnPullRefresh };
export { Radiobox as YnRadiobox };
export { Skeleton as YnSkeleton };
export { Slider as YnSlider };
export { Spin as YnSpin };
export { Sticky as YnSticky };
export { Swipe as YnSwipe };
export { SwipeItem as YnSwipeItem };
export { TabItem as YnTabItem };
export { Tabs as YnTabs };
export { Toast as YnToast };
