/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:49:28
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-07 10:59:10
 * @E-mail: justbefree@126.com
 */

import Vue, { VNode } from "vue";
const verify = (slots: VNode[] = [], validateTag: string | null): VNode[] => {
  if (!validateTag) {
    return slots;
  }
  const result: VNode[] = [];
  slots.forEach((slot) => {
    //  <transition> can only be used on a single element
    // 暂时不支持transition-group
    const condition =
      slot.componentOptions &&
      (validateTag === slot.componentOptions.tag ||
        (slot.componentOptions.tag === "transition" &&
          slot.componentOptions.children &&
          slot.componentOptions.children[0].componentOptions &&
          slot.componentOptions.children[0].componentOptions.tag ===
            validateTag));
    if (slot && condition) {
      result.push(slot);
    }
  });
  return result;
};
export const slotsMixins = Vue.extend({
  methods: {
    slots(name = "default", props = {}, validateTag: null | string = null) {
      const { $slots, $scopedSlots } = this;
      const scopedSlot = $scopedSlots[name];
      if (scopedSlot) {
        return verify(scopedSlot(props), validateTag);
      }
      return verify($slots[name], validateTag);
    },
  },
});
