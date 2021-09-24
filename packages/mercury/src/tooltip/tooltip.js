/*
 * @Author: liuzx
 * @Date:   2020-01-17 15:29:02
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:33:32
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { bind } from "../modules/event";
export default defineComponent({
  name: "Tooltip",
  mixins: [slotsMixins],
  props: {
    // 需要监听的事件
    trigger: {
      type: String,
      default: "click",
    },
    title: {
      type: String,
    },
    // toolTip消息提示
    content: {
      type: String,
    },
    header: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: "left",
    },
    type: {
      type: String,
      default: "disable",
    },
    effect: {
      type: String,
      default: "dark", // light
    },
  },
  data() {
    return {
      // 通过计算所得 气泡位置
      position: {
        top: 0,
        left: 0,
      },
      show: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.$refs[`popover`])
        return console.error(
          "Couldn't find popover ref in your component that uses popoverMixin."
        );
      // 获取监听对象
      const triger = this.$refs.trigger.children[0];
      // 根据trigger监听特定事件
      if (this.trigger === "hover") {
        this._mouseenterEvent = bind(triger, "mouseenter", () => {
          this.show = true;
        });
        this._mouseleaveEvent = bind(triger, "mouseleave", () => {
          this.show = false;
        });
      } else if (this.trigger === "focus") {
        this._focusEvent = bind(triger, "focus", () => {
          this.show = true;
        });
        this._blurEvent = bind(triger, "blur", () => {
          this.show = false;
        });
      } else {
        this._clickEvent = bind(triger, "click", this.toggle);
      }
      this.initPosition();
    });
    this.show = !this.show;
  },
  // 在组件销毁前移除监听，释放内存
  beforeDestroy() {
    if (this._blurEvent) {
      this._blurEvent();
      this._focusEvent();
    }
    if (this._mouseenterEvent) {
      this._mouseenterEvent();
      this._mouseleaveEvent();
    }
    if (this._clickEvent) this._clickEvent();
  },
  watch: {
    show: function (val) {
      if (val) {
        this.initPosition();
      }
    },
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    initPosition() {
      this.$nextTick(() => {
        const popover = this.$refs[`popover`];
        const triger = this.$refs.trigger.children[0];
        // 通过placement计算出位子
        switch (this.placement) {
          case "top":
            this.position.left =
              triger.offsetLeft -
              popover.offsetWidth / 2 +
              triger.offsetWidth / 2;
            this.position.top = triger.offsetTop - popover.offsetHeight;
            break;
          case "left":
            this.position.left = triger.offsetLeft - popover.offsetWidth;
            this.position.top =
              triger.offsetTop +
              triger.offsetHeight / 2 -
              popover.offsetHeight / 2;
            break;
          case "right":
            this.position.left = triger.offsetLeft + triger.offsetWidth;
            this.position.top =
              triger.offsetTop +
              triger.offsetHeight / 2 -
              popover.offsetHeight / 2;
            break;
          case "bottom":
            this.position.left =
              triger.offsetLeft -
              popover.offsetWidth / 2 +
              triger.offsetWidth / 2;
            this.position.top = triger.offsetTop + triger.offsetHeight;
            break;
          default:
            console.log("Wrong placement prop");
        }
        if (this.placement === "left" || this.placement === "top") {
          popover.style.top = this.position.top - 10 + "px";
          popover.style.left = this.position.left - 10 + "px";
        } else {
          popover.style.top = this.position.top + 10 + "px";
          popover.style.left = this.position.left + 10 + "px";
        }
      });
    },
  },

  render(h) {
    const {
      placement,
      // type,
      show,
      effect,
    } = this;

    return h(
      "div",
      {
        class: "yn-tooltip-box",
      },
      [
        h(
          "div",
          {
            class: [
              `yn-tooltip-placement-${placement}`,
              `yn-tooltip`,
              effect === "light" ? `yn-tooltip-light` : "",
            ],
          },
          [
            h(
              "div",
              {
                style: {
                  zIndex: 2,
                },
                ref: "trigger",
              },
              [this.slots()]
            ),
            h(
              "div",
              {
                ref: `popover`,
                prop: {
                  role: "tooltip",
                },
                on: {
                  mouseenter: () => (this.show = true),
                  mouseleave: () => {
                    if (this.trigger !== "click") {
                      this.show = false;
                    }
                  },
                },
                class: ["yn-tooltip-content", show ? "visible" : ""],
              },
              [
                h(
                  "div",
                  {
                    class: ["yn-tooltip-arrow"],
                  },
                  ""
                ),
                h(
                  "div",
                  {
                    class: ["yn-tooltip-inner"],
                  },
                  [this.content || this.slots("content")]
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
});
