/*
 * @Author: Just be free
 * @Date:   2021-08-12 18:14:23
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:30:02
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent, genComponentName } from "../modules/component";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Spin from "../spin";
import PullRefresh from "../pull-refresh";
import { addClass, removeClass } from "../modules/dom";
const CAT_CACHE = {};
export default defineComponent({
  name: "CategoryMobile",
  components: { Flex, FlexItem, Spin, PullRefresh },
  props: {
    topDraggingTip: {
      type: String,
      default: "下拉继续浏览",
    },
    topTipFixed: Boolean,
    bottomDraggingTip: {
      type: String,
      default: "上拉继续浏览",
    },
    bottomTipFixed: Boolean,
    preload: {
      type: String,
      default: ""
    },
    preloadStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    mapKeys: {
      type: Object,
      default: () => {
        return {
          id: "id",
          label: "label",
          imgUrl: "imgUrl",
          children: "children",
        };
      },
    },
    categories: {
      type: Array,
      default: () => {
        return [];
      },
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
      currentTab: 0,
      loading: false,
      categoryList: [],
    };
  },
  watch: {
    categories: function (v) {
      const firstCategory = v[this.currentTab];
      this.requestCategory({ parentId: firstCategory[this.mapKeys["id"]] });
    },
  },
  methods: {
    handleListClick(e) {
      const { key, cat } = e;
      this.currentTab = key;
      if (CAT_CACHE[cat[this.mapKeys["id"]]]) {
        this.categoryList = CAT_CACHE[cat[this.mapKeys["id"]]];
        // scroll top
        this.$refs.pullRefresh.setScrollTop(0);
        return;
      }
      this.requestCategory({ parentId: cat[this.mapKeys["id"]] }, cat);
    },
    requestCategory(args, cat = {}) {
      const { parentId } = args;
      const params = { ...this.category.params, cat };
      const promise = this.category.action(params);
      this.loading = true;
      promise
        .then((res) => {
          this.categoryList = res;
          CAT_CACHE[parentId] = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleItemClick(e) {
      this.$emit("itemClick", { ...e });
    },
    handlePull(e) {
      const { direction, status } = e;
      this.$emit("pullRefresh", { ...e, currentTab: this.currentTab });
      const length = this.categories.length;
      let currentTab = this.currentTab;
      if (status === "stoped") {
        if (direction === "top") {
          if (currentTab > 0) {
            currentTab -= 1;
          }
        } else if (direction === "bottom") {
          if (currentTab < length) {
            currentTab += 1;
          }
        }
        const cat = this.categories[currentTab];
        this.handleListClick({ cat, key: currentTab });
      }
    },
    handleError(e) {
      const { target } = e;
      addClass(target, "error");
    },
    handleImageOnload(e) {
      const { target } = e;
      const node = target.parentNode;
      removeClass(node, "loading");
    }
  },
  render(h) {
    return h("div", { class: ["yn-category-mobile"] }, [
      h(
        genComponentName("flex"),
        { class: ["category-flex"], props: { justifyContent: "spaceBetween" } },
        [
          h(genComponentName("flex-item"), { class: ["left-column"] }, [
            h(
              "ul",
              { class: ["ul-scroll"] },
              Array.apply(null, this.categories).map((cat, key) => {
                return h(
                  "li",
                  {
                    key,
                    on: {
                      click: this.handleListClick.bind(this, { cat, key }),
                    },
                    class: [this.currentTab === key ? "active" : ""],
                  },
                  [
                    h("span", {}, cat[this.mapKeys["label"]])
                  ]
                );
              })
            ),
          ]),
          h(genComponentName("flex-item"), { class: ["right-column"] }, [
            h(
              "div",
              { class: ["right-scroll", this.loading ? "loading" : ""] },
              [
                this.loading
                  ? h(
                      genComponentName("spin"),
                      {
                        class: ["category-loading"],
                        props: { type: "rotate-svg", size: 40 },
                      },
                      []
                    )
                  : h(
                      genComponentName("pull-refresh"),
                      {
                        class: ["category-pull-refresh"],
                        props: { topTipFixed: this.topTipFixed, bottomTipFixed: this.bottomTipFixed, topDraggingTip: this.topDraggingTip, bottomDraggingTip: this.bottomDraggingTip },
                        ref: "pullRefresh",
                        on: {
                          pullRefresh: this.handlePull,
                        },
                      },
                      [
                        Array.apply(null, this.categoryList).map((cat) => {
                          const children = cat[this.mapKeys["children"]];
                          return children.length > 0 && [
                            h(
                              "h4",
                              { key: `title-${cat.id}` },
                              cat[this.mapKeys["label"]]
                            ),
                            h(
                              genComponentName("flex"),
                              {
                                key: `content-${cat.id}`,
                                props: { flexWrap: "wrap" },
                              },
                              [
                                ...Array.apply(
                                  null,
                                  children
                                ).map((subCat) => {
                                  return h(
                                    genComponentName("flex-item"),
                                    {
                                      key: subCat[this.mapKeys["id"]],
                                      class: ["goods-item"],
                                    },
                                    [
                                      h(
                                        "a",
                                        {
                                          on: {
                                            click: this.handleItemClick.bind(
                                              this,
                                              subCat
                                            ),
                                          },
                                          class: ["hypelink"],
                                          attrs: { href: "javascript:;" },
                                        },
                                        [
                                          h("div", { class: ["image-box", "loading"], style: { backgroundImage: `url(${this.preload})`, ...this.preloadStyle } }, [
                                            h(
                                              "img",
                                              {
                                                on: {
                                                  error: this.handleError,
                                                  load: this.handleImageOnload
                                                },
                                                attrs: {
                                                  src: subCat[
                                                    this.mapKeys["imgUrl"]
                                                  ],
                                                },
                                              },
                                              []
                                            ),
                                          ]),
                                          h("span", { class: ["goods-name"] }, [
                                            subCat[this.mapKeys["label"]],
                                          ]),
                                        ]
                                      ),
                                    ]
                                  );
                                }),
                              ]
                            ),
                          ];
                        }),
                      ]
                    ),
              ]
            ),
          ]),
        ]
      ),
    ]);
  },
});
