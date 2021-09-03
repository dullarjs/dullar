/*
 * @Author: Just be free
 * @Date:   2020-12-29 13:55:30
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-12-29 14:19:45
 * @E-mail: justbefree@126.com
 */
import { on } from "./modules/event";
import { throttle } from "./modules/utils";
import { EventBus } from "./modules/event/bus";
(function (w) {
  on(w, "resize", (ev) => {
    throttle(() => {
      // console.log("ev = ", ev);
      EventBus.$emit("window:resize", ev);
    })();
  });
})(window);
