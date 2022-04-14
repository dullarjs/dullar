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
import Dropdown from "./dropdown";
import Tag from "./tag";
import Icon from "./icon";
import Button from "./button";
import Popconfirm from "./popconfirm";
import MessageBox from "./messageBox";
import Message from "./message";
import DatePicker from "./datePicker";
import Flex from "./flex";

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
          path: "flex",
          name: "flex",
          component: Flex
        },
        {
          path: "datePicker",
          name: "datePicker",
          component: DatePicker
        },
        {
          path: "message",
          name: "message",
          component: Message
        },
        {
          path: "messageBox",
          name: "messageBox",
          component: MessageBox
        },
        {
          path: "popconfirm",
          name: "popconfirm",
          component: Popconfirm
        },
        {
          path: "button",
          name: "button",
          component: Button
        },
        {
          path: "icon",
          name: "icon",
          component: Icon
        },
        {
          path: "tag",
          name: "tag",
          component: Tag
        },
        {
          path: "dropdown",
          name: "dropdown",
          component: Dropdown
        },
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
