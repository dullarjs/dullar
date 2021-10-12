/*
 * @Author: Just be free
 * @Date:   2020-11-03 11:12:31
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-12 19:30:06
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
const paddingHeight = 10;
const barHeight = 16;
const avatarSize = 80;
export default defineComponent({
  name: "Skeleton",
  props: {
    margin: String,
    type: {
      type: String,
      default: ""
    },
    cardHeight: Number,
    rows: {
      type: [String, Number],
      default: 2,
      validator: (num) => {
        return parseInt(num) >= 0 && parseInt(num) <= 20;
      },
    },
    avatar: {
      type: Boolean,
      default: true,
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
        h("div", {
          class: ["animated-background", "background-card"],
          style: { height: `${this.cardHeight}px` },
          directives: [{ name: "show", value: this.type === "card" }]
        }, []),
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
            h("div", { class: ["background-masker", "header-right"] }, []),
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
            h(
              "div",
              {
                class: ["background-masker", "subheader-left", avatarClass],
                style: { height: `${boxHeight - avatarSize}px` },
              },
              []
            ),
            h("div", { class: ["background-masker", "subheader-right"] }, []),
          ]
        ),
      ]
    );
  },
});
