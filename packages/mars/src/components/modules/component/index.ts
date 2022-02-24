/*
 * @Author: Just be free
 * @Date:   2020-05-13 18:08:08
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-04-07 11:18:28
 * @E-mail: justbefree@126.com
 */
import { VueConstructor } from "vue";
import { ComponentOptions } from "vue/types/vue";
export const install = (component: ComponentOptions) => {
  component.install = (Vue: VueConstructor) => {
    Vue.component(component.name, component);
  };
  return component;
};
