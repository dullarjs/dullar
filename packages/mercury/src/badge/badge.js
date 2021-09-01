/*
 * @Author: liuzx
 * @Date:   2021-08-13 16:53:33
 * @Last Modified by:   liuzx
 * @Last Modified time: 2021-08-16 18:15:18
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "badge",
  mixins: [slotsMixins],
  components: {},
  props: {
    color: {
      type: String,
      default: "#f5222d",
    },
    count: {
      type: Number,
      default: "",
    },
    dot: {
      type: Boolean,
      default: false,
    },
    showZero: {
      type: Boolean,
      default: false,
    },
    overflowCount: {
      type: Number,
      default: 99,
    },
  },
  data() {
    return {};
  },
  computed: {
    content() {
      const { overflowCount, count } = this;
      return count > overflowCount ? `${overflowCount}+` : count;
    },
    showCount() {
      const { showZero, count } = this;
      return showZero ? true : count > 0 ? true : false;
    },
  },
  methods: {},
  render(h) {
    const { color, dot, count, content, slots, showCount } = this;
    return h(
      "span",
      {
        class: ["yn-badge"],
      },
      [
        showCount
          ? h(
              "sub",
              {
                style: {
                  background: color,
                  padding: dot || count < 10 ? "0" : "0 4px",
                },
                class: ["position", dot ? "yn-badge-dot" : "yn-badge-count"],
              },
              dot ? "" : content
            )
          : null,
        h("span", {}, slots()),
      ]
    );
  },
});
