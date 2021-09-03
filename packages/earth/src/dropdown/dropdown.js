/*
 * @Author: Just be free
 * @Date:   2021-01-26 15:32:36
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-03-30 17:38:36
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import Popup from "../popup";
export default defineComponent({
  name: "Dropdown",
  mixins: [slotsMixins],
  components: { Popup },
  props: {
    borderRadius: Number,
    closeOnClickModal: Boolean,
    direction: {
      type: String,
      default: "down",
      validator: function (dir) {
        return ["down", "up", "right", "left"].indexOf(dir) > -1;
      },
    },
  },
  data() {
    return {
      show: false,
      status: false,
    };
  },
  computed: {
    position() {
      const map = { up: "bottom", down: "top", left: "right", right: "left" };
      return map[this.direction] || "bottom";
    },
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
      this.status = true;
      const target = this.slots("target");
      const dom = target[0].elm;
      const rect = dom.getBoundingClientRect();
      if (this.direction === "up") {
        this.$refs.dropdownPopup.style.bottom = `${
          window.innerHeight - rect.top
        }px`;
      } else if (this.direction === "down") {
        this.$refs.dropdownPopup.style.top = `${rect.bottom}px`;
      } else if (this.direction === "left") {
        this.$refs.dropdownPopup.style.right = `${
          window.innerWidth - rect.left
        }px`;
      } else if (this.direction === "right") {
        this.$refs.dropdownPopup.style.left = `${rect.right}px`;
      }
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
      this.status = false;
    },
    handleChange(e) {
      if (this.closeOnClickModal) {
        this.show = e;
      }
    },
  },
  render(h) {
    const target = this.slots("target");
    return h("div", { class: ["yn-dropdown"] }, [
      target,
      h(
        "div",
        {
          directives: [{ name: "show", value: this.status }],
          class: [
            "yn-dropdown-popup",
            this.direction,
            this.status ? "z-index" : "",
          ],
          ref: "dropdownPopup",
        },
        [
          h(
            genComponentName("popup"),
            {
              on: {
                input: this.handleChange,
                beforeEnter: this.handleBeforeEnter,
                afterEnter: this.handleAfterEnter,
                beforeLeave: this.handleBeforeLeave,
                afterLeave: this.handleAfterLeave,
              },
              style: { position: "absolute" },
              props: {
                value: this.show,
                singleton: true,
                position: this.position,
                borderRadius: this.borderRadius,
              },
            },
            [this.slots("content")]
          ),
        ]
      ),
    ]);
  },
});
