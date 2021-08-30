/*
* @Author: Just be free
* @Date:   2020-11-23 16:44:26
* @Last Modified by:   Just be free
* @Last Modified time: 2020-11-23 17:08:48
* @E-mail: justbefree@126.com
*/
import loadingComponent from "./load.vue";
console.log("loadingComponent", loadingComponent);
export default (asyncComponent) => {
  const com = () => ({
    component: asyncComponent(),
    loading: loadingComponent,
    delay: 0
  });
  return {
    render(h) {
      console.log("走到这里了吗");
      return h(com, {});
    }
  }
};