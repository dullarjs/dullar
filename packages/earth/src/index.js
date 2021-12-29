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
import Calendar from "./calendar";
import Checkbox from "./checkbox";
import CityPicker from "./city-picker";
import Counter from "./counter";
import DatePicker from "./date-picker";
import Dialog from "./dialog";
import Dragable from "./dragable";
import Dropdown from "./dropdown";
import DropdownMenu from "./dropdown-menu";
import DropdownMenuItem from "./dropdown-menu-item";
import Field from "./field";
import FieldGroup from "./field-group";
import Flex from "./flex";
import FlexItem from "./flex-item";
import Iconfont from "./iconfont";
import Indicator from "./indicator";
import Layout from "./layout";
import MagicLayer from "./magic-layer";
import Picker from "./picker";
import PickyStepper from "./picky-stepper";
import Popup from "./popup";
import PullRefresh from "./pull-refresh";
import Radiobox from "./radiobox";
import Skeleton from "./skeleton";
import Slider from "./slider";
import Spin from "./spin";
import Sticky from "./sticky";
import SubmitAction from "./submit-action";
import SubmitActionPopupContent from "./submit-action-popup-content";
import SubmitActionText from "./submit-action-text";
import SubmitActionValue from "./submit-action-value";
import Swipe from "./swipe";
import SwipeItem from "./swipe-item";
import TabItem from "./tab-item";
import Tabs from "./tabs";
import Textarea from "./textarea";
import Toast from "./toast";

const components = [
  ActionSheet,
  AnimationList,
  AnimationListItem,
  Button,
  Calendar,
  Checkbox,
  CityPicker,
  Counter,
  DatePicker,
  Dialog,
  Dragable,
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  Field,
  FieldGroup,
  Flex,
  FlexItem,
  Iconfont,
  Indicator,
  Layout,
  MagicLayer,
  Picker,
  PickyStepper,
  Popup,
  PullRefresh,
  Radiobox,
  Skeleton,
  Slider,
  Spin,
  Sticky,
  SubmitAction,
  SubmitActionPopupContent,
  SubmitActionText,
  SubmitActionValue,
  Swipe,
  SwipeItem,
  TabItem,
  Tabs,
  Textarea,
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
export { Calendar as YnCalendar };
export { Checkbox as YnCheckbox };
export { CityPicker as YnCityPicker };
export { Counter as YnCounter };
export { DatePicker as YnDatePicker };
export { Dialog as YnDialog };
export { Dragable as YnDragable };
export { Dropdown as YnDropdown };
export { DropdownMenu as YnDropdownMenu };
export { DropdownMenuItem as YnDropdownMenuItem };
export { Field as YnField };
export { FieldGroup as YnFieldGroup };
export { Flex as YnFlex };
export { FlexItem as YnFlexItem };
export { Iconfont as YnIconfont };
export { Indicator as YnIndicator };
export { Layout as YnLayout };
export { MagicLayer as YnMagicLayer };
export { Picker as YnPicker };
export { PickyStepper as YnPickyStepper };
export { Popup as YnPopup };
export { PullRefresh as YnPullRefresh };
export { Radiobox as YnRadiobox };
export { Skeleton as YnSkeleton };
export { Slider as YnSlider };
export { Spin as YnSpin };
export { Sticky as YnSticky };
export { SubmitAction as YnSubmitAction };
export { SubmitActionPopupContent as YnSubmitActionPopupContent };
export { SubmitActionText as YnSubmitActionText };
export { SubmitActionValue as YnSubmitActionValue };
export { Swipe as YnSwipe };
export { SwipeItem as YnSwipeItem };
export { TabItem as YnTabItem };
export { Tabs as YnTabs };
export { Textarea as YnTextarea };
export { Toast as YnToast };
