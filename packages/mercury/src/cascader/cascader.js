/*
 * @Author: yegl
 * @Date: 2021-08-02 09:17:29
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:06:00
 * @E-mail: yglgzyx@126.com
 */
import "./style/index.less";
import { defineComponent } from "../modules/component";
export default defineComponent({
  name: "Cascader",
  props: {
    categories: {
      type: Array,
      default: () => {
        return [];
      },
    },
    listTitle: {
      type: String,
      default: "请选择分类",
    },
  },
  data() {
    return {
      selected: -1,
    };
  },
  methods: {
    handleItemClick(e, key) {
      const selected = this.selected;
      if (selected === key) {
        return false;
      }
      this.categories[key].selected = true;
      if (selected > -1) {
        this.categories[selected].selected = false;
      }
      this.selected = key;
      this.$emit("handleClick", e);
    },
    createList(h) {
      const list = [];
      list.push(
        h("li", { class: ["yn-cascader-li"] }, [
          h("span", {}, ["请选择分类"]),
        ])
      );
      this.categories.forEach((category, index) => {
        const key = index;
        const selected = category.selected || false;
        if (this.selected === -1 && selected) {
          this.selected = key;
        }
        const className = selected ? "current" : "";
        list.push(
          h(
            "li",
            {
              key: key,
              class: [className],
              on: { click: this.handleItemClick.bind(this, category, key) },
            },
            [h("span", {}, category.name)]
          )
        );
      });
      return list;
    },
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-cascader"],
      },
      [
        h("div", { class: ["yn-cascader-content"] }, [
          h("ul", { class: ["yn-cascader-ul"] }, this.createList(h)),
        ]),
      ]
    );
  },
});
