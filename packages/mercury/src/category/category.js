/*
 * @Author: Just be free
 * @Date:   2021-07-19 15:14:51
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-19 15:50:04
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { stopPropagation } from "../modules/event";
import Iconfont from "../iconfont";
import Spin from "../spin";
let timer = null;
const CAT_CACHE = {};
export default defineComponent({
  name: "Category",
  components: { Iconfont, Spin },
  props: {
    categories: Array,
    category: {
      type: Object,
      default: () => {
        return {
          params: {},
          action: () => {
            return Promise.resolve();
          },
          parse: (e) => {
            return e;
          },
        };
      },
    },
  },
  data() {
    return {
      currentCategory: -1,
      subCatList: [],
      isLoading: false,
    };
  },
  methods: {
    requestCategory(cat) {
      this.isLoading = true;
      const params = { ...this.category.params };
      const promise = this.category.action(params);
      promise
        .then((res) => {
          if (!CAT_CACHE[cat.id]) {
            CAT_CACHE[cat.id] = res;
            this.subCatList = res;
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleMouseEnter({ index, cat }) {
      clearTimeout(timer);
      this.currentCategory = index;
      if (CAT_CACHE[cat.id]) {
        this.subCatList = CAT_CACHE[cat.id];
      } else {
        this.requestCategory(cat);
      }
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
        Array.apply(null, this.categories).map((cat, index) => {
          return h(
            "li",
            {
              class: ["yn-category-li"],
              on: {
                mouseenter: this.handleMouseEnter.bind(this, { index, cat }),
                mouseleave: this.handleMouseLeave.bind(this, index),
              },
            },
            [
              h("div", { class: ["label"] }, [
                h("span", {}, this.category.parse(cat)),
              ]),
              h(
                "div",
                {
                  on: {
                    mouseenter: this.handlePanelMouseEnter.bind(this),
                    mouseleave: this.handlePanelMouseLeave.bind(this),
                  },
                  class: [
                    "result-panel",
                    this.isLoading ? "loading" : "",
                    this.currentCategory === index ? "" : "hide",
                  ],
                },
                this.isLoading
                  ? [
                      h(
                        genComponentName("spin"),
                        {
                          class: ["category-loading"],
                          props: { type: "rotate-svg", size: 40 },
                        },
                        []
                      ),
                    ]
                  : Array.apply(null, this.subCatList).map((sub) => {
                      return h("dl", { class: [] }, [
                        h("dt", {}, [
                          h("span", {}, this.category.parse(sub)),
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
                          Array.apply(null, sub.children).map((list) => {
                            return h("span", {}, this.category.parse(list));
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
