/*
 * @Author: yegl
 * @Date: 2021-08-04 09:36:26
 * @Last Modified by: yegl
 * @Last Modified time: 2021-08-05 07:45:55
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
  methods: {
    init() {
      const pageSize = this.pageSize;
      const page = this.page;
      this.pageSize = pageSize === 0 ? this.defaultPageSize : pageSize;
      this.totalPage = Math.ceil(this.total / this.pageSize);
      this.page = page === 0 ? this.defaultCurrent : page;
    },
    paginationContent(h) {
      const pageSize = this.pageSize;
      return h("ul", { class: ["yn-pagination-content"] }, [
        h(
          "li",
          {
            class: ["yn-pagination-prev", "yn-pagination-button"],
            attrs: { title: "上一页" },
            on: { click: this.toPage.bind(this, "prev") },
          },
          [
            h(
              genComponentName("iconfont"),
              {
                directives: [{ value: true }],
                props: {
                  size: 12,
                  name: "magnifier-left-arrow-active",
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
            class: ["yn-pagination-next", "yn-pagination-button"],
            attrs: { title: "下一页" },
            on: { click: this.toPage.bind(this, "next") },
          },
          [
            h(
              genComponentName("iconfont"),
              {
                directives: [{ value: true }],
                props: {
                  size: 12,
                  name: "magnifier-right-arrow-active",
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
          h(
            "span",
            { class: ["yn-pagination-button", "yn-pagination-quick-jumper"] },
            [
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
            ]
          ),
      ]);
    },
    pageList(h) {
      const list = [];
      const totalPage = this.totalPage;
      const page = this.page;
      let active;
      if (totalPage <= 7) {
        for (let i = 1; i <= totalPage; i++) {
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
        e.target.children[1].style.display = "block";
      }
    },
    outPageSelection(e) {
      if (e && e.target && e.target.children && e.target.children[1]) {
        e.target.children[1].style.display = "none";
      }
    },
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.page = 1;
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
      this.init();
    },
    jumpToPage(e) {
      this.toPage("jump", parseInt(e.target.value));
    },
    enterToPage(e) {
      e.keyCode === 13 && this.toPage("jump", parseInt(e.target.value));
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
