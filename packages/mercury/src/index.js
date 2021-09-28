const EVENTS = {};
import { getConfig } from "./modules/component/config";
import { hyphenate } from "./modules/utils";
const version = getConfig("VUE_APP_VERSION");
import "./index.less";
import "./window-events";

import ActionSheet from "./action-sheet";
import Address from "./address";
import AnimationList from "./animation-list";
import AnimationListItem from "./animation-list-item";
import Badge from "./badge";
import Button from "./button";
import Calendar from "./calendar";
import Cascader from "./cascader";
import Category from "./category";
import CategoryMobile from "./category-mobile";
import Checkbox from "./checkbox";
import Counter from "./counter";
import DatePicker from "./date-picker";
import Dialog from "./dialog";
import ElasticSearch from "./elastic-search";
import Field from "./field";
import FieldGroup from "./field-group";
import Flex from "./flex";
import FlexItem from "./flex-item";
import Form from "./form";
import FormItem from "./form-item";
import Iconfont from "./iconfont";
import Image from "./image";
import Indicator from "./indicator";
import Input from "./input";
import Layout from "./layout";
import Magnifier from "./magnifier";
import Modal from "./modal";
import Pagination from "./pagination";
import Picker from "./picker";
import PickyStepper from "./picky-stepper";
import Popup from "./popup";
import PullRefresh from "./pull-refresh";
import Radiobox from "./radiobox";
import ShippingAddress from "./shipping-address";
import Skeleton from "./skeleton";
import Slide from "./slide";
import Slider from "./slider";
import Spin from "./spin";
import Sticky from "./sticky";
import Swipe from "./swipe";
import SwipeItem from "./swipe-item";
import TabItem from "./tab-item";
import Table from "./table";
import Tabs from "./tabs";
import Toast from "./toast";
import Tooltip from "./tooltip";
import Tree from "./tree";

const components = [
  ActionSheet,
  Address,
  AnimationList,
  AnimationListItem,
  Badge,
  Button,
  Calendar,
  Cascader,
  Category,
  CategoryMobile,
  Checkbox,
  Counter,
  DatePicker,
  Dialog,
  ElasticSearch,
  Field,
  FieldGroup,
  Flex,
  FlexItem,
  Form,
  FormItem,
  Iconfont,
  Image,
  Indicator,
  Input,
  Layout,
  Magnifier,
  Modal,
  Pagination,
  Picker,
  PickyStepper,
  Popup,
  PullRefresh,
  Radiobox,
  ShippingAddress,
  Skeleton,
  Slide,
  Slider,
  Spin,
  Sticky,
  Swipe,
  SwipeItem,
  TabItem,
  Table,
  Tabs,
  Toast,
  Tooltip,
  Tree,
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
  Vue.prototype.Modal = Modal;
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
export { Address as YnAddress };
export { AnimationList as YnAnimationList };
export { AnimationListItem as YnAnimationListItem };
export { Badge as YnBadge };
export { Button as YnButton };
export { Calendar as YnCalendar };
export { Cascader as YnCascader };
export { Category as YnCategory };
export { CategoryMobile as YnCategoryMobile };
export { Checkbox as YnCheckbox };
export { Counter as YnCounter };
export { DatePicker as YnDatePicker };
export { Dialog as YnDialog };
export { ElasticSearch as YnElasticSearch };
export { Field as YnField };
export { FieldGroup as YnFieldGroup };
export { Flex as YnFlex };
export { FlexItem as YnFlexItem };
export { Form as YnForm };
export { FormItem as YnFormItem };
export { Iconfont as YnIconfont };
export { Image as YnImage };
export { Indicator as YnIndicator };
export { Input as YnInput };
export { Layout as YnLayout };
export { Magnifier as YnMagnifier };
export { Modal as YnModal };
export { Pagination as YnPagination };
export { Picker as YnPicker };
export { PickyStepper as YnPickyStepper };
export { Popup as YnPopup };
export { PullRefresh as YnPullRefresh };
export { Radiobox as YnRadiobox };
export { ShippingAddress as YnShippingAddress };
export { Skeleton as YnSkeleton };
export { Slide as YnSlide };
export { Slider as YnSlider };
export { Spin as YnSpin };
export { Sticky as YnSticky };
export { Swipe as YnSwipe };
export { SwipeItem as YnSwipeItem };
export { TabItem as YnTabItem };
export { Table as YnTable };
export { Tabs as YnTabs };
export { Toast as YnToast };
export { Tooltip as YnTooltip };
export { Tree as YnTree };
