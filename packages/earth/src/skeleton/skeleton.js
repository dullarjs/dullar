/*
 * @Author: Just be free
 * @Date:   2020-11-03 11:12:31
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-11-03 18:43:24
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
const paddingHeight = 10;
const barHeight = 16;
const avatarSize = 120;
export default defineComponent({
  name: "Skeleton",
  props: {
    whiteSpace: {
      type: Object,
      default() {
        return {
          1: {
            direction: "right",
            width: 0.5,
          },
          10: {
            direction: "left",
            width: 0.7,
          },
        };
      },
    },
    margin: String,
    rows: {
      type: [String, Number],
      default: 2,
      validator: (num) => {
        return parseInt(num) >= 2 && parseInt(num) <= 20;
      },
    },
    avatar: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    createWhiteSpace(h) {
      return Object.keys(this.whiteSpace).map((key) => {
        const { direction, width } = this.whiteSpace[key];
        let style = {
          width: `calc((100% - ${
            this.avatar ? avatarSize + 10 : 0
          }px) * ${width})`,
          height: barHeight + "px",
          top: barHeight * (key - 1) + (key - 1) * paddingHeight + "px",
        };
        if (direction === "right") {
          style.right = "0px";
        } else if (direction === "left") {
          style.left = `${this.avatar ? avatarSize + 10 : 0}px`;
        }
        console.log("style:", style);
        return h(
          "div",
          {
            style,
            class: ["background-masker"],
          },
          []
        );
      });
    },
  },
  render(h) {
    const avatarClass = this.avatar ? "avatar" : "";
    const rows = parseInt(this.rows);
    const boxHeight = (rows + 1) * barHeight + rows * paddingHeight;
    return h(
      "div",
      { class: ["yn-skeleton"], style: { margin: this.margin } },
      [
        h(
          "div",
          {
            class: ["animated-background"],
            style: { height: `${boxHeight}px` },
          },
          [
            h(
              "div",
              { class: ["background-masker", "header-left", avatarClass] },
              []
            ),
            // h("div", { class: ["background-masker", "header-right"] }, []),
            ...Array.apply(null, { length: rows }).map((row, index) => {
              return h(
                "div",
                {
                  class: [
                    "background-masker",
                    avatarClass,
                    `header-bottom-${index + 1}`,
                  ],
                },
                []
              );
            }),
            // h(
            //   "div",
            //   {
            //     class: ["background-masker", "subheader-left", avatarClass],
            //     style: { height: `${boxHeight - avatarSize}px` },
            //   },
            //   []
            // ),
            ...this.createWhiteSpace(h),
            // h("div", { class: ["background-masker", "subheader-right"] }, []),
          ]
        ),
      ]
    );
  },
});
