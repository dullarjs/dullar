/*
 * @Author: Just be free
 * @Date:   2020-12-29 13:55:30
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-08-16 18:27:30
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
  on(w, "hashchange", (ev) => {
    EventBus.$emit("location:hashchange", ev);
  });
  on(w, "popstate", (ev) => {
    EventBus.$emit("history:popstate", ev);
  });
})(window);
