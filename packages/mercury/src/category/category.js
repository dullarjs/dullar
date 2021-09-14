/*
 * @Author: Just be free
 * @Date:   2021-07-19 15:14:51
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-14 16:06:54
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Iconfont from "../iconfont";
import Spin from "../spin";
import Flex from "../flex";
import FlexItem from "../flex-item";
const CAT_CACHE = {};
const obj = {};
export default defineComponent({
  name: "Category",
  components: { Iconfont, Spin, Flex, FlexItem },
  props: {
    categories: Array,
    delay: {
      type: Number,
      default: 200
    },
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
      showPanel: false,
      hovered: false
    };
  },
  methods: {
    requestCategory(cat) {
      this.isLoading = true;
      const params = { ...this.category.params, cat };
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
    handleMouseOver({ index, cat }) {
      obj[`timer1_${index}`] = null;
      obj[`timer2_${index}`] = null;
      obj[`hovered_${index}`] = false;
      if (obj[`hovered_${index}`]) {
        clearTimeout(obj[`timer2_${index}`]);
      } else {
        obj[`timer1_${index}`] = setTimeout(() => {
          this.showPanel = true;
          this.currentCategory = index;
          if (CAT_CACHE[cat.id]) {
            this.subCatList = CAT_CACHE[cat.id];
          } else {
            this.requestCategory(cat);
          }
        }, this.delay);
      }
    },
    handleMouseLeave(index) {
      if (obj[`hovered_${index}`]) {
        obj[`timer2_${index}`] = setTimeout(() => {
          this.currentCategory = -1;
          this.showPanel = false;
        }, this.delay);
      } else {
        clearTimeout(obj[`timer1_${index}`]);
      }
    },
    handlePanelMouseLeave() {
      this.currentCategory = -1;
      this.showPanel = false;
    },
    itemClick(item) {
      this.$emit("pick", item);
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
              class: ["yn-category-li", index === this.currentCategory ? "active" : ""],
              on: {
                click: this.itemClick.bind(this, cat),
                mouseover: this.handleMouseOver.bind(this, { index, cat }),
                mouseleave: this.handleMouseLeave.bind(this, index),
              },
            },
            [
              h("div", { class: ["label"] }, [
                h("span", {}, this.category.parse(cat)),
              ]),
            ]
          );
        })
      ),
      h(
        "div",
        {
          on: {
            mouseleave: this.handlePanelMouseLeave.bind(this),
          },
          class: [
            "result-panel",
            this.isLoading ? "loading" : "",
            this.showPanel ? "" : "hide"
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
              const text = this.category.parse(sub).split("");
              if (text.length > 8) {
                text.splice(8, 0, "<br/>");
              }
              return h("dl", { class: [] }, [
                h("dt", {}, [
                  h(genComponentName("flex"), { class: ["text-wrapper"], props: { justifyContent: "spaceBetween" } }, [
                    h(genComponentName("flex-item"), { props: { flex: 1 } }, [
                      h(
                        "span",
                        {
                          on: { click: this.itemClick.bind(this, sub) },
                          domProps: { innerHTML: text.join("") }
                        },
                        []
                      )
                    ]),
                    h(genComponentName("flex-item"), {}, [
                      h(
                        genComponentName("iconfont"),
                        {
                          class: [],
                          props: { name: "right-arrow", size: 12 },
                        },
                        []
                      )
                    ])
                  ])
                ]),
                h(
                  "dd",
                  {},
                  Array.apply(null, sub.children).map((list) => {
                    return h(
                      "span",
                      {
                        on: { click: this.itemClick.bind(this, list) },
                      },
                      this.category.parse(list)
                    );
                  })
                ),
              ]);
            })
      )
    ]);
  },
});

// reference 100sucai.com/demo/112.html