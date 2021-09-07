/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:16:53
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-02 15:13:16
 */
import { defineComponent, genComponentName } from "../modules/component";
import { renderedMixins } from "../mixins/rendered";
import { isPromise, throttle, isChineseCharacters } from "../modules/utils";
import { EventBus } from "../modules/event/bus";
import { error } from "../modules/error";
import { getPropertyValue } from "../modules/dom/style";
import Popup from "../popup";
import Iconfont from "../iconfont";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Spin from "../spin";
export default defineComponent({
  name: "CityPicker",
  mixins: [renderedMixins],
  components: { Flex, FlexItem, Popup, Iconfont, Spin },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    column: {
      type: [Number, String],
      default: 4,
      validator: (c) => {
        return String(c) === "4" || String(c) === "3";
      },
    },
    parse: {
      type: Function,
      default: (h, city, nameSpace) => {
        if (!nameSpace) nameSpace = "";
        return h("span", {}, city.CityName);
      },
    },
    limited: {
      type: Boolean,
      default: false,
    },
    limitedData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tabs: {
      type: Array,
      default: () => {
        return [
          { label: "中国", key: "mainland-china" },
          { label: "非中国大陆(国际/港澳台)", key: "overseas" },
        ];
      },
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "请输入城市名称",
    },
    showHistory: {
      type: Boolean,
      default: false,
    },
    showHotCity: {
      type: Boolean,
      default: true,
    },
    showAlphaBeta: {
      type: Boolean,
      default: true,
    },
    search: {
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
    history: {
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
          title: "历史查询",
        };
      },
    },
    hotCity: {
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
          title: "热门城市",
        };
      },
    },
    alphaBeta: {
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
          title: "按字母查询",
        };
      },
    },
  },
  data() {
    return {
      isCompose: false,
      caculatedTabs: [],
      currentTab: "",
      selectedAlphaBeta: "",
      alphaBetaCities: [],
      hotCityList: [],
      historyList: [],
      searchList: [],
      historyLoading: false,
      alphaBetaLoading: false,
      hotCityLoading: false,
      isSearching: false,
      keywords: "",
      textBoxWidth: 68,
      cachedAlphaBeta: {},
    };
  },
  watch: {
    tabs: {
      handler() {
        this.caculatedTabs = [];
        this.tabs.forEach((tab, index) => {
          let active;
          if (index === 0) {
            active = true;
            this.currentTab = tab.key;
          } else {
            active = false;
          }
          this.caculatedTabs.push({ ...tab, active });
        });
      },
      immediate: true,
    },
  },
  methods: {
    beforeEnter() {
      if (this.showHistory) {
        this.getHistory(this.currentTab);
      }
      if (!this.limited && this.showHotCity) {
        this.getHotCity(this.currentTab);
      }
      this.$emit("beforeEnter");
    },
    afterEnter() {
      this.$emit("afterEnter");
    },
    beforeLeave() {
      this.$emit("beforeLeave");
    },
    afterLeave() {
      this.$emit("afterLeave");
    },
    handleChange(e) {
      this.$emit("input", e);
    },
    handlePick(e) {
      const { disableClick = false } = e;
      if (disableClick) {
        // 不允许点击城市
        return;
      }
      if (this.isSearching) {
        // 搜索完结果后，点击结果需清当前搜索记录，以及搜索结果
        this.clearSearchKeywords();
        this.clearSearchResult();
      }
      this.handleChange(false);
      this.$emit("pick", e);
    },
    clearSearchKeywords() {
      this.isSearching = false;
      this.keywords = "";
      this.$refs.searchInput.value = "";
      this.clearSearchResult();
    },
    clearSearchResult() {
      this.searchList = [];
    },
    clearAlphaBetaSearchKeywords() {
      this.selectedAlphaBeta = "";
      this.clearAlphaBetaSearchResult();
    },
    clearAlphaBetaSearchResult() {
      this.alphaBetaCities = [];
    },
    onComposeStart() {
      this.isCompose = true;
    },
    onComposeEnd(e) {
      this.isCompose = false;
      this.handleOnSearch(e);
    },
    handleOnSearch(e) {
      if (this.isCompose) return;
      throttle(this.searchRequest)(e);
    },
    handleFocusout(e) {
      this.$emit("focusout", e);
    },
    searchRequest(e) {
      const value = e.target.value.trim();
      this.keywords = value;
      if (value) {
        this.isSearching = true;
      } else {
        this.isSearching = false;
        this.clearSearchResult();
        // 内容为空， 不搜索
        return;
      }
      const params = { ...this.search.params, tab: this.currentTab, value };
      const promise = this.search.action(params);
      promise
        .then((res) => {
          const data = this.search.parse(res, params);
          if (data && data.length) {
            this.searchList = data;
          }
        })
        .catch((err) => {
          this.clearSearchResult();
          if (err.errmsg) {
            this.Toast(err.errmsg);
          } else {
            this.print(err);
          }
        });
    },
    close() {
      this.$emit("input", false);
    },
    getHistory(e) {
      const params = { ...this.history.params, tab: e };
      const promise = this.history.action(params);
      if (isPromise(promise)) {
        this.historyLoading = true;
        promise.then((res) => {
          const data = this.history.parse(res, params);
          if (data && Array.isArray(data)) {
            this.historyList = data;
          } else {
            this.historyList = [];
          }
          this.historyLoading = false;
        });
      } else {
        error("The action of hotCity's attribute must be a Promise type!");
      }
    },
    getHotCity(e) {
      const params = { ...this.hotCity.params, tab: e };
      const promise = this.hotCity.action(params);
      if (isPromise(promise)) {
        this.hotCityLoading = true;
        promise.then((res) => {
          const data = this.hotCity.parse(res, params);
          if (data && data.length) {
            this.hotCityList = data;
          }
          this.hotCityLoading = false;
        });
      } else {
        error("The action of hotCity's attribute must be a Promise type!");
      }
    },
    handleClickAlphaBeta(e) {
      if (this.selectedAlphaBeta === e) {
        return false;
      }
      this.selectedAlphaBeta = e;
      this.alphaBetaCities = [];
      if (
        this.cachedAlphaBeta[e + this.currentTab] &&
        this.cachedAlphaBeta[e + this.currentTab].length
      ) {
        this.alphaBetaLoading = false;
        this.alphaBetaCities = this.cachedAlphaBeta[e + this.currentTab];
      } else {
        this.alphaBetaLoading = true;
        const params = { ...this.alphaBeta.params, alphaBeta: e };
        const promise = this.alphaBeta.action(params);
        if (isPromise(promise)) {
          promise.then((res) => {
            const data = this.alphaBeta.parse(res, params);
            if (data && data.length) {
              // this.cachedAlphaBeta[e] = data;
              this.alphaBetaCities = data;
              // deepClone, 防止城市组件缓存的数据共享
              this.cachedAlphaBeta = {
                ...this.cachedAlphaBeta,
                [e + this.currentTab]: data,
              };
              this.setAlphaBetaScrollTop();
            }
            this.alphaBetaLoading = false;
          });
        } else {
          error("The action of alphaBeta's attribute must be a Promise type!");
        }
      }
    },
    setAlphaBetaScrollTop() {
      if (this.limited || this.isSearching) {
        return false;
      }
      this.rendered(() => {
        const scrollElement = this.$refs[`scrollElement-${this.currentTab}`]
          .$el;
        const lastChild = scrollElement.lastElementChild;
        scrollElement.scrollTop = lastChild.offsetTop;
      });
    },
    handleTabSwitch(ele) {
      if (ele.active) {
        return false;
      }
      if (this.isSearching) {
        this.clearSearchKeywords();
      }
      if (this.selectedAlphaBeta) {
        this.clearAlphaBetaSearchKeywords();
      }
      this.caculatedTabs.forEach((tab) => {
        if (tab.key === ele.key) {
          tab.active = true;
          if (this.showHistory) {
            this.getHistory(tab.key);
          }
          if (!this.limited && this.showHotCity) {
            this.getHotCity(tab.key);
          }
        } else {
          tab.active = false;
        }
      });
      this.currentTab = ele.key;
    },
    createTitle(h) {
      return h("span", { class: ["yn-city-picker-header-title"] }, this.title);
    },
    creteHeaderArea(h) {
      const header = [];
      header.push(this.createTitle(h));
      header.push(this.createClose(h));
      if (this.caculatedTabs.length === 2) {
        header.push(
          h(
            genComponentName("flex"),
            {
              props: { justifyContent: "spaceAround" },
              class: ["yn-city-picker-tab-bar"],
            },
            Array.apply(null, this.caculatedTabs).map((ele, key) => {
              return h(
                genComponentName("flex-item"),
                {
                  key,
                  on: { click: this.handleTabSwitch.bind(this, ele) },
                  props: { flex: 1 },
                  class: [
                    "yn-city-picker-tab-item",
                    ele.active ? "active" : "",
                  ],
                },
                [h("span", { class: ["yn-city-picker-tab-text"] }, ele.label)]
              );
            })
          )
        );
      }
      header.push(this.creteInputSearchArea(h));
      return header;
    },
    createHistoryArea(h) {
      if (this.showHistory) {
        return [
          this.historyList.length > 0
            ? this.createBlockTitle(h, this.history.title)
            : null,
          this.createBlock(h, {
            cities: this.historyList,
            loading: this.historyLoading,
            nameSpace: "history",
          }),
        ];
      } else {
        return [];
      }
    },
    createInputSearchList(h) {
      return h(
        "ul",
        {},
        Array.apply(null, this.searchList).map((listItem, key) => {
          return h(
            "li",
            { key, on: { click: this.handlePick.bind(this, listItem) } },
            [this.parse(h, listItem, "search-result")]
          );
        })
      );
    },
    createHotCityArea(h) {
      if (this.showHotCity) {
        return [
          this.createBlockTitle(h, this.hotCity.title),
          this.createBlock(h, {
            cities: this.hotCityList,
            loading: this.hotCityLoading,
            nameSpace: "hot-cities",
          }),
        ];
      } else {
        return [];
      }
    },
    createAlphaBeta(h) {
      if (this.showAlphaBeta) {
        return [
          this.createBlockTitle(h, this.alphaBeta.title),
          h(
            genComponentName("flex"),
            {
              props: { flexWrap: "wrap", justifyContent: "spaceBetween" },
              class: ["yn-city-picker-alpha-beta"],
            },
            Array.apply(null, { length: 26 }).map((i, key) => {
              const char = String.fromCharCode(65 + key);
              return h(
                genComponentName("flex-item"),
                {
                  on: { click: this.handleClickAlphaBeta.bind(this, char) },
                  class: [
                    "alpha-beta",
                    this.selectedAlphaBeta === char ? "active" : "",
                  ],
                },
                char
              );
            })
          ),
        ];
      } else {
        return [];
      }
    },
    creteInputSearchArea(h) {
      if (this.searchable) {
        return h(
          genComponentName("flex"),
          {
            props: { justifyContent: "spaceBetween" },
            class: ["yn-city-picker-input-search"],
          },
          [
            h(genComponentName("flex-item"), { class: ["icon-box"] }, [
              h(
                genComponentName("iconfont"),
                { props: { name: "search", size: "16" } },
                []
              ),
            ]),
            h(
              genComponentName("flex-item"),
              {
                class: ["input-box", this.isSearching ? "searching" : ""],
                props: { flex: 1 },
              },
              [
                h(
                  "input",
                  {
                    on: {
                      input: this.handleOnSearch,
                      focusout: this.handleFocusout,
                      compositionstart: this.onComposeStart,
                      compositionend: this.onComposeEnd,
                    },
                    attrs: { placeholder: this.placeholder },
                    ref: "searchInput",
                  },
                  []
                ),
              ]
            ),
            h(
              genComponentName("flex-item"),
              {
                on: { click: this.clearSearchKeywords },
                class: ["delete-all"],
                directives: [{ name: "show", value: this.isSearching }],
              },
              [
                h(
                  genComponentName("iconfont"),
                  { props: { name: "clear", size: 16 } },
                  []
                ),
              ]
            ),
          ]
        );
      }
    },
    createSearchedArea(h) {
      return this.createBlock(h, {
        cities: this.alphaBetaCities,
        loading: this.alphaBetaLoading,
        nameSpace: "alpha-beta",
      });
    },
    createClose(h) {
      return h(
        genComponentName("iconfont"),
        {
          class: ["yn-city-picker-close"],
          props: { name: "close", size: 12 },
          on: { click: this.close },
        },
        []
      );
    },
    createBlockTitle(h, title = "") {
      return h("div", { class: ["yn-city-picker-block-title"] }, [
        h("span", {}, title),
      ]);
    },
    createBlock(h, args) {
      const { cities, loading, nameSpace = "" } = args;
      if (loading) {
        return h("div", { class: ["yn-city-picker-searched-area"] }, [
          h(
            genComponentName("spin"),
            { props: { type: "tripleBounce", size: 30 } },
            []
          ),
        ]);
      } else {
        return h(
          genComponentName("flex"),
          {
            props: { flexWrap: "wrap", justifyContent: "spaceBetween" },
            class: "yn-city-picker-cities",
            ref: "cityBox",
          },
          [
            Array.apply(null, cities).map((city, key) => {
              const textEle = this.parse(h, city, nameSpace);
              const text = textEle.children[0].text;
              const textLength = text.length;
              let fontSize = this.textBoxWidth / textLength;
              const textOverflow = [];
              if (fontSize > 14) {
                fontSize = "14px";
              } else if (fontSize < 12) {
                fontSize = "12px";
                if (isChineseCharacters(text)) {
                  textOverflow.push(...["text-small", "normal-lineheight"]);
                }
              } else {
                fontSize = `${fontSize}px`;
              }
              return h(
                genComponentName("flex-item"),
                {
                  key,
                  on: { click: this.handlePick.bind(this, city) },
                  style: { fontSize },
                  class: [
                    "city-item",
                    `column-${this.column}`,
                    ...textOverflow,
                  ],
                },
                [textEle]
              );
            }),
          ]
        );
      }
    },
    createBodyArea(h) {
      const body = [];
      body.push(...this.createHistoryArea(h));
      body.push(...this.createHotCityArea(h));
      body.push(...this.createAlphaBeta(h));
      body.push(this.createSearchedArea(h));
      return body;
    },
    createDynamicContent(h) {
      if (this.limited) {
        return [
          h(
            genComponentName("flex-item"),
            { class: ["yn-city-picker-header"] },
            [
              this.createTitle(h),
              this.createClose(h),
              this.creteInputSearchArea(h),
            ]
          ),
          h(
            genComponentName("flex-item"),
            {
              directives: [{ name: "show", value: !this.isSearching }],
              props: { flex: 1 },
            },
            [
              this.createBlock(h, {
                cities: this.limitedData,
                nameSpace: "limited",
              }),
            ]
          ),
          h(
            genComponentName("flex-item"),
            {
              class: [
                "yn-city-picker-body",
                "yn-city-picker-input-search-result",
              ],
              directives: [{ name: "show", value: this.isSearching }],
              props: { flex: 1 },
              ref: "scrollElement-searching",
            },
            [this.createInputSearchList(h)]
          ),
        ];
      } else {
        return [
          h(
            genComponentName("flex-item"),
            { class: ["yn-city-picker-header"] },
            this.creteHeaderArea(h)
          ),
          h(
            genComponentName("flex-item"),
            {
              directives: [
                {
                  name: "show",
                  value:
                    !this.isSearching && this.currentTab === "mainland-china",
                },
              ],
              class: ["yn-city-picker-body"],
              props: { flex: 1 },
              ref: "scrollElement-mainland-china",
            },
            [this.createBodyArea(h)]
          ),
          h(
            genComponentName("flex-item"),
            {
              directives: [
                {
                  name: "show",
                  value: !this.isSearching && this.currentTab === "overseas",
                },
              ],
              class: ["yn-city-picker-body"],
              props: { flex: 1 },
              ref: "scrollElement-overseas",
            },
            [this.createBodyArea(h)]
          ),
          h(
            genComponentName("flex-item"),
            {
              class: [
                "yn-city-picker-body",
                "yn-city-picker-input-search-result",
              ],
              directives: [{ name: "show", value: this.isSearching }],
              props: { flex: 1 },
              ref: "scrollElement-searching",
            },
            [this.createInputSearchList(h)]
          ),
          h(
            genComponentName("flex-item"),
            { class: ["yn-city-picker-footer"] },
            []
          ),
        ];
      }
    },
    resizeEventHandler(el, paddingLeft, paddingRight) {
      const actualWidth =
        el.getBoundingClientRect().width -
        parseInt(paddingLeft) -
        parseInt(paddingRight);
      const textBoxWidth =
        parseInt(this.column) === 3 ? actualWidth * 0.31 : actualWidth * 0.22;
      this.textBoxWidth = textBoxWidth;
    },
    resize() {
      const cityBox = this.$refs.cityBox.$el;
      const paddingLeft = getPropertyValue(cityBox, "padding-left");
      const paddingRight = getPropertyValue(cityBox, "padding-right");
      const el = this.$el;
      this.resizeEventHandler(el, paddingLeft, paddingRight);
      EventBus.$on("window:resize", () => {
        this.resizeEventHandler(el, paddingLeft, paddingRight);
      });
    },
  },
  mounted() {
    this.resize();
  },
  render(h) {
    return h("div", { class: ["yn-city-picker"] }, [
      h(
        genComponentName("popup"),
        {
          on: {
            input: this.handleChange,
            beforeEnter: this.beforeEnter,
            afterEnter: this.afterEnter,
            beforeLeave: this.beforeLeave,
            afterLeave: this.afterLeave,
          },
          props: { position: "bottom" },
          style: { height: "90%" },
          directives: [{ name: "show", value: this.value }],
        },
        [
          h(
            genComponentName("flex"),
            {
              class: ["yn-city-picker-content", this.limited ? "limited" : ""],
              props: { flexDirection: "column" },
            },
            this.createDynamicContent(h)
          ),
        ]
      ),
    ]);
  },
});
