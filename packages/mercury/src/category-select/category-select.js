/*
 * @Author: Just be free
 * @Date:   2020-04-21 14:25:00
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-14 18:49:45
 * @E-mail: justbefree@126.com
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
