/*
 * @Author: Just be free
 * @Date:   2021-08-12 18:14:23
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-17 18:05:03
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Spin from "../spin";
import PullRefresh from "../pull-refresh";
const CAT_CACHE = {};
export default defineComponent({
  name: "CategoryMobile",
  components: { Flex, FlexItem, Spin, PullRefresh },
  props: {
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
  methods: {
    handleListClick(e) {
      // console.log("list click", e);
      const { key, cat } = e;
      this.currentTab = key;
      if (CAT_CACHE[cat.cat_id]) {
        this.categoryList = CAT_CACHE[cat.cat_id];
        // scroll top
        this.$refs.pullRefresh.setScrollTop(0);
        return;
      }
      this.requestCategory({ parentId: cat.cat_id });
    },
    requestCategory(args) {
      const { parentId } = args;
      const params = { ...this.category.params };
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
      const { direction } = e;
      const length = this.categories.length;
      let currentTab = this.currentTab;
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
    },
  },
  created() {
    const firstCategory = this.categories[this.currentTab];
    this.requestCategory({ parentId: firstCategory.cat_id });
  },
  render(h) {
    return h("div", { class: ["yn-category-mobile"] }, [
      h(genComponentName("flex"), { class: ["category-flex"] }, [
        h(genComponentName("flex-item"), { class: ["left-column"] }, [
          h(
            "ul",
            { class: ["ul-scroll"] },
            Array.apply(null, this.categories).map((cat, key) => {
              return h(
                "li",
                {
                  key,
                  on: { click: this.handleListClick.bind(this, { cat, key }) },
                  class: [this.currentTab === key ? "active" : ""],
                },
                [cat.cat_name]
              );
            })
          ),
        ]),
        h(genComponentName("flex-item"), { class: ["right-column"] }, [
          h("div", { class: ["right-scroll", this.loading ? "loading" : ""] }, [
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
                    ref: "pullRefresh",
                    on: {
                      pullRefresh: this.handlePull,
                    },
                  },
                  [
                    Array.apply(null, this.categoryList).map((cat) => {
                      return [
                        h("h4", { key: `title-${cat.id}` }, cat.name),
                        h(
                          genComponentName("flex"),
                          {
                            key: `content-${cat.id}`,
                            props: { flexWrap: "wrap" },
                          },
                          [
                            ...Array.apply(null, cat.cat_id).map((subCat) => {
                              return h(
                                genComponentName("flex-item"),
                                { key: subCat.id, class: ["goods-item"] },
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
                                      h(
                                        "img",
                                        { attrs: { src: subCat.cat_img } },
                                        []
                                      ),
                                      h("span", { class: ["goods-name"] }, [
                                        subCat.name,
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
          ]),
        ]),
      ]),
    ]);
  },
});
