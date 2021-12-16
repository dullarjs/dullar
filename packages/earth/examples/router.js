/*
 * @Author: Just be free
 * @Date:   2020-02-07 13:50:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-16 11:29:21
 */
import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);
import Content from "./Content.vue";
import Toast from "./toast/toast.vue";
import Indicator from "./indicator/indicator.vue";
import Spin from "./spin/spin.vue";
import Iconfont from "./iconfont/iconfont.vue";
import Checkbox from "./checkbox/checkbox.vue";
import Radiobox from "./radiobox/radiobox.vue";
import Calendar from "./calendar/calendar.vue";
import Popup from "./popup/popup.vue";
import Button from "./button/button.vue";
import Flex from "./flex/flex.vue";
import ActionSheet from "./action-sheet/actionSheet.vue";
import Field from "./field/field.vue";
import Layout from "./layout/layout.vue";
import CityPicker from "./city-picker/cityPicker.vue";
import Sticky from "./sticky/sticky.vue";
import Dialog from "./dialog/dialog.vue";
import PickyStepper from "./picky-stepper/pickyStepper.vue";
import Dropdown from "./dropdown/dropdown.vue";
import DropdownMenu from "./dropdown-menu/dropdownMenu.vue";
import Picker from "./picker/picker.vue";
import Swipe from "./swipe/swipe.vue";
import Tabs from "./tabs/tabs.vue";
import Slider from "./slider/slider.vue";
import SubmitAction from "./submit-action/submitAction.vue";
import PullRefresh from "./pull-refresh/pullRefresh.vue";
import DatePicker from "./date-picker/datePicker.vue";
import Counter from "./counter/counter.vue";
import Skeleton from "./skeleton/skeleton.vue";
import AnimationList from "./animation-list/list.vue";
import Dragable from "./dragable/dragable.vue";
import MagicLayer from "./magic-layer/magicLayer.vue";
import MagicLayer2 from "./magic-layer/magicLayer2.vue";
// import Massive from "./massive/massive.vue";
// import loadable from "./load";
const router = new Router({
  routes: [
    {
      path: "/",
      name: "content",
      component: Content
    },
    {
      path: "/toast",
      name: "toast",
      component: Toast
    },
    {
      path: "/indicator",
      name: "indicator",
      component: Indicator
    },
    {
      path: "/spin",
      name: "spin",
      component: Spin
    },
    {
      path: "/iconfont",
      name: "iconfont",
      component: Iconfont
    },
    {
      path: "/checkbox",
      name: "checkbox",
      component: Checkbox
    },
    {
      path: "/radiobox",
      name: "radiobox",
      component: Radiobox
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/popup",
      name: "popup",
      component: Popup
    },
    {
      path: "/button",
      name: "button",
      component: Button
    },
    {
      path: "/flex",
      name: "flex",
      component: Flex
    },
    {
      path: "/actionSheet",
      name: "actionSheet",
      component: ActionSheet
    },
    {
      path: "/field",
      name: "field",
      component: Field
    },
    {
      path: "/layout",
      name: "layout",
      component: Layout
    },
    {
      path: "/cityPicker",
      name: "cityPicker",
      component: CityPicker
    },
    {
      path: "/sticky",
      name: "sticky",
      component: Sticky
    },
    {
      path: "/dialog",
      name: "dialog",
      component: Dialog
    },
    {
      path: "/pickyStepper",
      name: "pickyStepper",
      component: PickyStepper
    },
    {
      path: "/dropdown",
      name: "dropdown",
      component: Dropdown
    },
    {
      path: "/dropdownMenu",
      name: "dropdownMenu",
      component: DropdownMenu
    },
    {
      path: "/picker",
      name: "picker",
      component: Picker
    },
    {
      path: "/swipe",
      name: "swipe",
      component: Swipe
    },
    {
      path: "/tabs",
      name: "tabs",
      component: Tabs
    },
    {
      path: "/slider",
      name: "slider",
      component: Slider
    },
    {
      path: "/submitAction",
      name: "submitAction",
      component: SubmitAction
    },
    {
      path: "/pullRefresh",
      name: "pullRefresh",
      component: PullRefresh
    },
    {
      path: "/datePicker",
      name: "datePicker",
      component: DatePicker
    },
    {
      path: "/counter",
      name: "counter",
      component: Counter
    },
    {
      path: "/skeleton",
      name: "skeleton",
      component: Skeleton
    },
    {
      path: "/animation-list",
      name: "animationList",
      component: AnimationList
    },
    {
      path: "/dragable",
      name: "dragable",
      component: Dragable
    },
    {
      path: "/magic-layer",
      name: "magicLayer",
      component: MagicLayer
    },
    {
      path: "/magic-layer-basic",
      name: "magicLayer2",
      component: MagicLayer2
    }
  ]
});
export default router;
