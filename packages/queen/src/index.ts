/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:16
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 15:08:03
* @E-mail: justbefree@126.com
*/
import { version } from "../package.json";
// TOOLS
import { deepClone } from "./utils/deep-clone";
const Tools = {
  deepClone
}
import "./index.scss";
import QButton from "./button";
import QFlex from "./flex";
import QFlexItem from "./flex-item";
import QToast from "./toast";
import QSpin from "./spin";
import QPopup from "./popup";
import QIcon from "./icon";
import QCheckbox from "./checkbox";
import QRadiobox from "./radiobox";
import Dialog, { QDialog } from "./dialog";
import QSticky from "./sticky";
import QCalendar from "./calendar";
import QLayout from "./layout";
import QCitypicker from "./citypicker";
import QIndicator from "./indicator";
import QSlider from "./slider";
import QActionSheet from "./action-sheet";
import QPickyStepper from "./picky-stepper";
import QCounter from "./counter";
import QPullRefresh from "./pull-refresh";
import QSkeleton from "./skeleton";
import QPicker from "./picker";
import QDatePicker from "./date-picker";
import QTabs from "./tabs";
import QTabItem from "./tab-item";
import QAnimationList from "./animation-list";
import QAnimationListItem from "./animation-list-item";
import QSwipe from "./swipe";
import QSwipeItem from "./swipe-item";
import QSubmitBar from "./submit-bar";
import QSubmitBarPopupContent from "./submit-bar-popup-content";
import QSubmitBarValue from "./submit-bar-value";
import QSubmitBarText from "./submit-bar-text";
import QField from "./field";
import QDropdown from "./dropdown";
export interface QueenConfigOptions {
  [propName: string]: any;
}
const configOptions = {} as QueenConfigOptions;
const components = [QDropdown, QField, QSubmitBarText, QSubmitBarValue, QSubmitBarPopupContent, QSubmitBar, QSwipeItem, QSwipe, QAnimationListItem, QAnimationList, QTabItem, QTabs, QDatePicker, QPicker, QSkeleton, QPullRefresh, QCounter, QPickyStepper, QActionSheet, QSlider, QCitypicker, QLayout, QCalendar, QSticky, QButton, QFlex, QFlexItem, QSpin, QPopup, QIcon, QCheckbox, QRadiobox, QDialog];
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
  app.config.globalProperties.Toast = QToast;
  app.config.globalProperties.Dialog = Dialog;
  app.config.globalProperties.Indicator = QIndicator;
  app.config.isCustomElement = (tag: string) => tag.startsWith("q-");
};
const config = (options: QueenConfigOptions) => {
  Object.keys(options).forEach((attr: string) => {
    configOptions[attr] = options[attr];
  });
};
const Queen = { install, version, config, Tools };
export { QDropdown, QField, QSubmitBarText, QSubmitBarValue, QSubmitBarPopupContent, QSubmitBar, QSwipeItem, QSwipe, QAnimationListItem, QAnimationList, QTabItem, QTabs, QDatePicker, QPicker, QSkeleton, QPullRefresh, QCounter, QPickyStepper, QActionSheet, QSlider, QIndicator, QCitypicker, QLayout, QCalendar, QSticky, QButton, QFlex, QFlexItem, QToast, QSpin, QPopup, QIcon, QCheckbox, QRadiobox, QDialog };
export default Queen;
