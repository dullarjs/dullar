import Vue from "vue"
import Notice from "./notice.vue"
import { AnyObject } from "@/types";
import { VueConstructor } from "vue"
(Notice as AnyObject).install = (vue: VueConstructor) => {
 Vue.component(Notice.name, Notice);
}
export default Notice