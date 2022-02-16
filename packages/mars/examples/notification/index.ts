import Vue from "vue"
import Notification from "./notification.vue"
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(Notification as AnyObject).install = (vue: VueConstructor) => {
 Vue.component(Notification.name, Notification);
}
export default Notification