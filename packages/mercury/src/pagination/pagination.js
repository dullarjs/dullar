/*
 * @Author: yegl
 * @Date: 2021-08-04 09:36:26
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-28 09:21:25
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
export default defineComponent({
  name: "Pagination",
  props: {
    total: {
      type: Number,
      default: 100,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    defaultCurrent: {
      type: Number,
      default: 1,
    },
    disablePageSize: {
      type: Boolean,
      default: false,
    },
    disableJumpPage: {
      type: Boolean,
      default: false,
    },
    selectedPageStyle: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageSize: 0,
      totalPage: 1,
      page: 0,
      inputValue: "",
    };
  },
  created() {
    this.init();
  },
  watch: {
    total: "init",
    defaultCurrent: "dCurrentChange",
  },
  methods: {
    init() {
      const { pageSize, page, defaultCurrent } = this;
      this.pageSize = pageSize === 0 ? this.defaultPageSize : pageSize;
      this.totalPage = Math.ceil(this.total / this.pageSize) || 1;
      const _page = page === 0 ? defaultCurrent : page;
      this.page =
        _page > this.totalPage ? this.totalPage : _page <= 1 ? 1 : _page;
    },
    dCurrentChange() {
      const { defaultCurrent } = this;
      this.page = defaultCurrent <= 1 ? 1 : defaultCurrent;
    },
    paginationContent(h) {
      const { pageSize, page, totalPage } = this;
      return h("ul", { class: ["yn-pagination-content"] }, [
        h(
          "li",
          {
            class: [
              "yn-pagination-prev",
              "yn-pagination-button",
              page === 1 ? "button-disabled" : "a-block",
            ],
            attrs: { title: "上一页" },
            on: { click: this.toPage.bind(this, "prev") },
          },
          [
            h(
              genComponentName("iconfont"),
              {
                directives: [{ value: true }],
                props: {
                  size: 14,
                  name: "left-pagination",
                },
              },
              []
            ),
          ]
        ),
        this.pageList(h),
        h(
          "li",
          {
            class: [
              "yn-pagination-next",
              "yn-pagination-button",
              page >= totalPage ? "button-disabled" : "a-block",
            ],
            attrs: { title: "下一页" },
            on: { click: this.toPage.bind(this, "next") },
          },
          [
            h(
              genComponentName("iconfont"),
              {
                directives: [{ value: true }],
                class: ["right"],
                props: {
                  size: 14,
                  name: "left-pagination",
                },
              },
              []
            ),
          ]
        ),
        !this.disablePageSize &&
          h(
            "li",
            {
              class: [
                "yn-pagination-button",
                "yn-pagination-item-padding-5",
                "yn-pagination-selection",
                "a-block",
              ],
              on: {
                mouseenter: this.onPageSelection.bind(this),
                mouseleave: this.outPageSelection.bind(this),
              },
            },
            [
              h("span", { class: "yn-pagination-selection-item" }, [
                pageSize,
                " 条/页",
                h(
                  genComponentName("iconfont"),
                  {
                    directives: [{ value: true }],
                    props: {
                      size: 12,
                      name: "down-arrow",
                    },
                  },
                  []
                ),
              ]),
              h("div", { class: ["yn-pagination-selection-list"] }, [
                h(
                  "span",
                  {
                    class: [pageSize === 10 ? "selected" : ""],
                    on: { click: this.setPageSize.bind(this, 10) },
                  },
                  ["10 条/页"]
                ),
                h(
                  "span",
                  {
                    class: [pageSize === 20 ? "selected" : ""],
                    on: { click: this.setPageSize.bind(this, 20) },
                  },
                  ["20 条/页"]
                ),
                h(
                  "span",
                  {
                    class: [pageSize === 50 ? "selected" : ""],
                    on: { click: this.setPageSize.bind(this, 50) },
                  },
                  ["50 条/页"]
                ),
                h(
                  "span",
                  {
                    class: [pageSize === 100 ? "selected" : ""],
                    on: { click: this.setPageSize.bind(this, 100) },
                  },
                  ["100 条/页"]
                ),
              ]),
              h("div", { class: ["yn-pagination-selection-mark"] }, []),
            ]
          ),
        !this.disableJumpPage &&
          h("span", { class: ["yn-pagination-quick-jumper"] }, [
            "跳至 ",
            h(
              "input",
              {
                domProps: { value: this.inputValue },
                on: {
                  blur: this.jumpToPage.bind(this),
                  keyup: this.enterToPage.bind(this),
                },
              },
              []
            ),
            " 页",
          ]),
      ]);
    },
    pageList(h) {
      const list = [];
      const { totalPage, page } = this;
      let active;
      if (totalPage <= 7) {
        for (let i = 1; i <= totalPage; i++) {
          active = (page === i && "active") || "";
          list.push(
            h(
              "li",
              {
                class: ["yn-pagination-button", active, "a-block"],
                on: { click: this.toPage.bind(this, "jump", i) },
                style: active && this.selectedPageStyle,
              },
              [i]
            )
          );
        }
      }
      if (totalPage > 7) {
        if (page <= 4) {
          for (let i = 1; i <= 5; i++) {
            active = (page === i && "active") || "";
            list.push(
              h(
                "li",
                {
                  class: ["yn-pagination-button", active],
                  on: { click: this.toPage.bind(this, "jump", i) },
                },
                [i]
              )
            );
          }
          list.push(
            h("li", { class: ["yn-pagination-item-ellipsis"] }, ["•••"])
          );
          list.push(
            h(
              "li",
              {
                class: ["yn-pagination-button"],
                on: { click: this.toPage.bind(this, "jump", totalPage) },
              },
              [totalPage]
            )
          );
        }
        if (page > 4 && totalPage - page >= 4) {
          list.push(
            h(
              "li",
              {
                class: ["yn-pagination-button"],
                on: { click: this.toPage.bind(this, "jump", 1) },
              },
              [1]
            )
          );
          list.push(
            h("li", { class: ["yn-pagination-item-ellipsis"] }, ["•••"])
          );
          for (let i = page - 2; i <= page + 2; i++) {
            active = (page === i && "active") || "";
            list.push(
              h(
                "li",
                {
                  class: ["yn-pagination-button", active],
                  on: { click: this.toPage.bind(this, "jump", i) },
                },
                [i]
              )
            );
          }
          list.push(
            h("li", { class: ["yn-pagination-item-ellipsis"] }, ["•••"])
          );
          list.push(
            h(
              "li",
              {
                class: ["yn-pagination-button"],
                on: { click: this.toPage.bind(this, "jump", totalPage) },
              },
              [totalPage]
            )
          );
        }
        if (totalPage - page < 4) {
          list.push(
            h(
              "li",
              {
                class: ["yn-pagination-button"],
                on: { click: this.toPage.bind(this, "jump", 1) },
              },
              [1]
            )
          );
          list.push(
            h("li", { class: ["yn-pagination-item-ellipsis"] }, ["•••"])
          );
          for (let i = totalPage - 4; i <= totalPage; i++) {
            active = (page === i && "active") || "";
            list.push(
              h(
                "li",
                {
                  class: ["yn-pagination-button", active],
                  on: { click: this.toPage.bind(this, "jump", i) },
                },
                [i]
              )
            );
          }
        }
      }
      return list;
    },
    onPageSelection(e) {
      if (e && e.target && e.target.children && e.target.children[1]) {
        const _bottom = window.innerHeight - e.clientY;
        const _mark = e.target.querySelector(".yn-pagination-selection-mark");
        e.target.children[1].style.display = "block";
        if (_bottom < 150) {
          e.target.children[1].style.top = "-125px";
          _mark.style.top = "-10px";
        }
      }
    },
    outPageSelection(e) {
      if (e && e.target && e.target.children && e.target.children[1]) {
        e.target.children[1].style.display = "none";
      }
    },
    setPageSize(pageSize) {
      const { page, total } = this;
      this.pageSize = pageSize;
      this.page =
        page > Math.ceil(total / pageSize) ? Math.ceil(total / pageSize) : page;
      this.$emit("pageSizeChange", pageSize);
      this.init();
    },
    toPage(type, toPage) {
      const page = this.page;
      const totalPage = this.totalPage;
      switch (type) {
        case "prev":
          this.page = page - 1 > 0 ? page - 1 : 1;
          break;
        case "next":
          this.page = page + 1 <= totalPage ? page + 1 : totalPage;
          break;
        case "jump":
          if (toPage <= 1) {
            this.page = 1;
          } else if (toPage >= totalPage) {
            this.page = totalPage;
          } else {
            this.page = toPage;
          }
          break;
      }
      if (page !== this.page) {
        this.$emit("pageChange", this.page);
        this.init();
      }
    },
    jumpToPage(e) {
      e.target.value && this.toPage("jump", parseInt(e.target.value));
    },
    enterToPage(e) {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
      e.keyCode === 13 &&
        e.target.value &&
        this.toPage("jump", parseInt(e.target.value));
    },
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-pagination"],
      },
      [this.paginationContent(h)]
    );
  },
});
