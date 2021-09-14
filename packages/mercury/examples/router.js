/*
 * @Author: Just be free
 * @Date:   2020-02-07 13:50:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-13 15:25:43
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
import Popup from "./popup/popup.vue";
import Button from "./button/button.vue";
import Flex from "./flex/flex.vue";
import ActionSheet from "./action-sheet/actionSheet.vue";
import Field from "./field/field.vue";
import Layout from "./layout/layout.vue";
import Sticky from "./sticky/sticky.vue";
import Dialog from "./dialog/dialog.vue";
import PickyStepper from "./picky-stepper/pickyStepper.vue";
import Picker from "./picker/picker.vue";
import Swipe from "./swipe/swipe.vue";
import Tabs from "./tabs/tabs.vue";
import Slider from "./slider/slider.vue";
import PullRefresh from "./pull-refresh/pullRefresh.vue";
import DatePicker from "./date-picker/datePicker.vue";
import Calendar from "./calendar/calendar.vue";
import Counter from "./counter/counter.vue";
import Skeleton from "./skeleton/skeleton.vue";
import AnimationList from "./animation-list/list.vue";
import Category from "./category/category.vue";
import Magnifier from "./magnifier/magnifier.vue";
import CategorySelect from "./category-select/categorySelect.vue";
import Pagination from "./pagination/pagination.vue";
import Table from "./table/table.vue";
import ShippingAddress from "./shipping-address/shippingAddress.vue";
import ElasticSearch from "./elastic-serach/elasticSearch.vue";
import CategoryMobile from "./category-mobile/categoryMobile.vue";
import Address from "./address/address.vue";
import Modal from "./modal/modal.vue";
import Badge from "./badge/badge.vue";
import Tooltip from "./tooltip/tooltip.vue";
import Input from "./input/input";
import Tree from "./tree/tree.vue";
import Slide from "./slide/slide.vue";
const router = new Router({
  routes: [{
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
      path: "/tooltip",
      name: "tooltip",
      component: Tooltip
    },
    {
      path: "/badge",
      name: "badge",
      component: Badge
    },
    {
      path: "/modal",
      name: "modal",
      component: Modal
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
      path: "/category",
      name: "category",
      component: Category
    },
    {
      path: "/magnifier",
      name: "magnifier",
      component: Magnifier
    },
    {
      path: "/category-select",
      name: "categorySelect",
      component: CategorySelect
    },
    {
      path: "/pagination",
      name: "pagination",
      component: Pagination
    },
    {
      path: "/table",
      name: "table",
      component: Table
    },
    {
      path: "/shipping-address",
      name: "shippingAddress",
      component: ShippingAddress
    },
    {
      path: "/elastic-serach",
      name: "elasticSearch",
      component: ElasticSearch
    },
    {
      path: "/category-mobile",
      name: "categoryMobile",
      component: CategoryMobile
    },
    {
      path: "/address",
      name: "address",
      component: Address
    },
    {
      path: "/tree",
      name: "tree",
      component: Tree
    }
    ,
    {
      path: "/input",
      name: "input",
      component: Input
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/slide",
      name: "slide",
      component: Slide
    }
  ]
});
export default router;