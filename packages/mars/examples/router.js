/*
 * @Author: Just be free
 * @Date:   2020-02-07 13:50:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-01-27 10:05:51
 */
import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);
import Content from "./Content.vue";
import Dialog from "./dialog";
import Popover from "./popover";
import Notification from "./notification"
import CityPicker from "./cityPicker";
import Spin from "./spin";
import Indicator from "./indicator";
import Iconfont from "./iconfont";
import Radiobox from "./radiobox";
import Checkbox from "./checkbox";
import Field from "./field";
import Select from "./select";
import Scrollbar from "./scrollbar";
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    {
      path: "/",
      name: "content",
      component: Content,
      children: [
        {
          path: "scrollbar",
          name: "scrollbar",
          component: Scrollbar
        },
        {
          path: "select",
          name: "select",
          component: Select
        },
        {
          path: "field",
          name: "field",
          component: Field
        },
        {
          path: "checkbox",
          name: "checkbox",
          component: Checkbox
        },
        {
          path: "radiobox",
          name: "radiobox",
          component: Radiobox
        },
        {
          path: "iconfont",
          name: "iconfont",
          component: Iconfont
        },
        {
          path: "indicator",
          name: "indicator",
          component: Indicator
        },
        {
          path: "spin",
          name: "spin",
          component: Spin
        },
        {
          path: "cityPicker",
          name: "cityPicker",
          component: CityPicker
        },
        {
          path: "dialog",
          name: "dialog",
          component: Dialog
        },
        {
          path: "popover",
          name: "popover",
          component: Popover
        },
        {
          path: "notification",
          name: "notification",
          component: Notification
        }
      ]
    }
  ]
});
export default router;
