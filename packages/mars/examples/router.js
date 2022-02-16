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
