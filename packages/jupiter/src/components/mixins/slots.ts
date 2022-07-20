/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:49:28
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-07 10:59:10
 * @E-mail: justbefree@126.com
 */

import { VNode } from "vue";
import { Vue } from "vue-class-component";
export class slotsMixins extends Vue {
  slots(slotName = "default"): VNode {
    const slots = this.$slots[slotName] && (typeof this.$slots[slotName] === "function") && (this.$slots[slotName] as Function)();
    return slots;
  }
};
