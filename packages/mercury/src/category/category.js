/*
 * @Author: Just be free
 * @Date:   2021-07-19 15:14:51
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-26 17:04:58
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { stopPropagation } from "../modules/event";
import Iconfont from "../iconfont";
let timer = null;
export default defineComponent({
  name: "Category",
  components: { Iconfont },
  props: {
    categories: Array,
  },
  data() {
    return {
      currentCategory: -1,
    };
  },
  methods: {
    handleMouseEnter(index) {
      clearTimeout(timer);
      this.currentCategory = index;
    },
    handleMouseLeave() {
      timer = setTimeout(() => {
        this.currentCategory = -1;
      }, 500);
    },
    handlePanelMouseEnter(e) {
      clearTimeout(timer);
      stopPropagation(e);
    },
    handlePanelMouseLeave() {
      this.currentCategory = -1;
    },
  },
  render(h) {
    return h("div", { class: ["yn-category"] }, [
      h(
        "ul",
        { class: ["yn-category-ul"] },
        Array.apply(null, this.categories).map((cate, index) => {
          return h(
            "li",
            {
              class: ["yn-category-li"],
              on: {
                mouseenter: this.handleMouseEnter.bind(this, index),
                mouseleave: this.handleMouseLeave.bind(this, index),
              },
            },
            [
              h("div", { class: ["label"] }, [h("span", {}, cate.label)]),
              h(
                "div",
                {
                  on: {
                    mouseenter: this.handlePanelMouseEnter.bind(this),
                    mouseleave: this.handlePanelMouseLeave.bind(this),
                  },
                  class: [
                    "result-panel",
                    this.currentCategory === index ? "" : "hide",
                  ],
                },
                Array.apply(null, cate.sub).map((sub) => {
                  return h("dl", { class: [] }, [
                    h("dt", {}, [
                      h("span", {}, sub.label),
                      h(
                        genComponentName("iconfont"),
                        {
                          class: [],
                          props: { name: "right-arrow", size: 12 },
                        },
                        []
                      ),
                    ]),
                    h(
                      "dd",
                      {},
                      Array.apply(null, sub.list).map((list) => {
                        return h("span", {}, list);
                      })
                    ),
                  ]);
                })
              ),
            ]
          );
        })
      ),
    ]);
  },
});
