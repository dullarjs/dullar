/*
 * @Author: yegl
 * @Date: 2021-08-02 09:17:29
 * @Last Modified by: yegl
 * @Last Modified time: 2021-08-02 18:14:17
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent } from "../modules/component";
export default defineComponent({
  name: "CategorySelect",
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
        h("li", { class: ["yn-category-select-li"] }, [
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
        class: ["yn-category-select"],
      },
      [
        h("div", { class: ["yn-category-select-content"] }, [
          h("ul", { class: ["yn-category-select-ul"] }, this.createList(h)),
        ]),
      ]
    );
  },
});
