import { on } from "./dom";
import { EventBus } from "./eventBus";
(function (w) {
  on(w, "resize", (ev) => {
    // throttle(() => {
    //   // console.log("ev = ", ev);
    //   EventBus.$emit("window:resize", ev);
    // })();
    EventBus.$emit("window:resize", ev);
  });
})(window);