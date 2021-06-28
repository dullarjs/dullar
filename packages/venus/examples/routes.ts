/*
* @Author: Just be free
* @Date:   2020-09-22 14:17:59
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-28 14:08:38
* @E-mail: justbefree@126.com
*/
import { createRouter, createWebHashHistory } from "vue-router";
import Main from "./main/main.vue";
import Content from "./content/content.vue";
import Flex from "./flex/flex.vue";
import FlexCode from "./flex/code.vue";
import Toast from "./toast/toast.vue";
import ToastCode from "./toast/code.vue";
import Spin from "./spin/spin.vue";
import SpinCode from "./spin/code.vue";
import Popup from "./popup/popup.vue";
import PopupCode from "./popup/code.vue";
import Icon from "./icon/icon.vue";
import IconCode from "./icon/code.vue";
import Checkbox from "./checkbox/checkbox.vue";
import CheckboxCode from "./checkbox/code.vue";
import Radiobox from "./radiobox/radiobox.vue";
import RadioboxCode from "./radiobox/code.vue";
import Dialog from "./dialog/dialog.vue";
import DialogCode from "./dialog/code.vue";
import Button from "./button/button.vue";
import ButtonCode from "./button/code.vue";
import Sticky from "./sticky/sticky.vue";
import StickyCode from "./sticky/code.vue";
import Calendar from "./calendar/calendar.vue";
import CalendarCode from "./calendar/code.vue";
import Layout from "./layout/layout.vue";
import LayoutCode from "./layout/code.vue";
import Citypicker from "./citypicker/citypicker.vue";
import CitypickerCode from "./citypicker/code.vue";
import Indicator from "./indicator/indicator.vue";
import IndicatorCode from "./indicator/code.vue";
import ActionSheet from "./action-sheet/actionSheet.vue";
import ActionSheetCode from "./action-sheet/code.vue";
import Skeleton from "./skeleton/skeleton.vue";
import SkeletonCode from "./skeleton/code.vue";
import Picker from "./picker/picker.vue";
import PickerCode from "./picker/code.vue";
import DatePicker from "./date-picker/datePicker.vue";
import DatePickerCode from "./date-picker/code.vue";
import Swipe from "./swipe/swipe.vue";
import SwipeCode from "./swipe/code.vue";
import Field from "./field/field.vue";
import FieldCode from "./field/code.vue";
import JSapi from "./js-api/api.vue";
const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: { showFooter: false, showHeader: false, title: "" }
  },
  {
    path: "/components",
    name: "Content",
    component: Content,
    meta: { showFooter: false, showHeader: true, title: "components" }
  },
  {
    path: "/flex",
    name: "Flex",
    component: Flex,
    meta: { showFooter: false, showHeader: true, title: "flex", code: true }
  },
  {
    path: "/flex-code",
    name: "FlexCode",
    component: FlexCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/toast",
    name: "Toast",
    component: Toast,
    meta: { showFooter: false, showHeader: true, title: "toast", code: true }
  },
  {
    path: "/toast-code",
    name: "ToastCode",
    component: ToastCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/spin",
    name: "Spin",
    component: Spin,
    meta: { showFooter: false, showHeader: true, title: "spin", code: true }
  },
  {
    path: "/spin-code",
    name: "SpinCode",
    component: SpinCode,
    meta: { showFooter: false, showHeader: true, title: "spin" }
  },
  {
    path: "/popup",
    name: "Popup",
    component: Popup,
    meta: { showFooter: false, showHeader: true, title: "popup", code: true }
  },
  {
    path: "/popup-code",
    name: "PopupCode",
    component: PopupCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/icon",
    name: "Icon",
    component: Icon,
    meta: { showFooter: false, showHeader: true, title: "icon", code: true }
  },
  {
    path: "/icon-code",
    name: "IconCode",
    component: IconCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/checkbox",
    name: "Checkbox",
    component: Checkbox,
    meta: { showFooter: false, showHeader: true, title: "checkbox", code: true }
  },
  {
    path: "/checkbox-code",
    name: "CheckboxCode",
    component: CheckboxCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/radiobox",
    name: "Radiobox",
    component: Radiobox,
    meta: { showFooter: false, showHeader: true, title: "radiobox", code: true }
  },
  {
    path: "/radiobox-code",
    name: "RadioboxCode",
    component: RadioboxCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/dialog",
    name: "Dialog",
    component: Dialog,
    meta: { showFooter: false, showHeader: true, title: "dialog", code: true }
  },
  {
    path: "/dialog-code",
    name: "DialogCode",
    component: DialogCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/button",
    name: "Button",
    component: Button,
    meta: { showFooter: false, showHeader: true, title: "button", code: true }
  },
  {
    path: "/button-code",
    name: "ButtonCode",
    component: ButtonCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/sticky",
    name: "Sticky",
    component: Sticky,
    meta: { showFooter: false, showHeader: true, title: "sticky", code: true }
  },
  {
    path: "/sticky-cide",
    name: "StickyCode",
    component: StickyCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    meta: { showFooter: false, showHeader: true, title: "calendar", code: true }
  },
  {
    path: "/calendar-code",
    name: "CalendarCode",
    component: CalendarCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/layout",
    name: "Layout",
    component: Layout,
    meta: { showFooter: false, showHeader: true, title: "layout", code: true }
  },
  {
    path: "/layout-code",
    name: "LayoutCode",
    component: LayoutCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/citypicker",
    name: "Citypicker",
    component: Citypicker,
    meta: { showFooter: false, showHeader: true, title: "citypicker", code: true }
  },
  {
    path: "/citypicker-code",
    name: "CitypickerCode",
    component: CitypickerCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/indicator",
    name: "Indicator",
    component: Indicator,
    meta: { showFooter: false, showHeader: true, title: "indicator", code: true }
  },
  {
    path: "/indicator-code",
    name: "IndicatorCode",
    component: IndicatorCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/action-sheet",
    name: "ActionSheet",
    component: ActionSheet,
    meta: { showFooter: false, showHeader: true, title: "action-sheet", code: true }
  },
  {
    path: "/action-sheet-code",
    name: "ActionSheetCode",
    component: ActionSheetCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/skeleton",
    name: "Skeleton",
    component: Skeleton,
    meta: { showFooter: false, showHeader: true, title: "skeleton", code: true }
  },
  {
    path: "/skeleton-code",
    name: "SkeletonCode",
    component: SkeletonCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/picker",
    name: "Picker",
    component: Picker,
    meta: { showFooter: false, showHeader: true, title: "picker", code: true }
  },
  {
    path: "/picker-code",
    name: "PickerCode",
    component: PickerCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/date-picker",
    name: "DatePicker",
    component: DatePicker,
    meta: { showFooter: false, showHeader: true, title: "date-picker", code: true }
  },
  {
    path: "/date-picker-code",
    name: "DatePickerCode",
    component: DatePickerCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/swipe",
    name: "Swipe",
    component: Swipe,
    meta: { showFooter: false, showHeader: true, title: "swipe", code: true }
  },
  {
    path: "/swipe-code",
    name: "SwipeCode",
    component: SwipeCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/field",
    name: "Field",
    component: Field,
    meta: { showFooter: false, showHeader: true, title: "field", code: true }
  },
  {
    path: "/field-code",
    name: "FieldCode",
    component: FieldCode,
    meta: { showFooter: false, showHeader: true, title: "source code" }
  },
  {
    path: "/js-api",
    name: "JSapi",
    component: JSapi,
    meta: { showFooter: false, showHeader: true, title: "js-api" }
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;