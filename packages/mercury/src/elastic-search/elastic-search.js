/*
 * @Author: Just be free
 * @Date:   2021-08-11 13:15:09
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-13 13:51:57
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Iconfont from "../iconfont";
import Spin from "../spin";
import Field from "../field";
import Popup from "../popup";
import { renderedMixins } from "../mixins/rendered";
export default defineComponent({
  name: "ElasticSearch",
  mixins: [renderedMixins],
  props: {
    value: String,
    closeWhenSearch: Boolean,
    placeholder: String,
    cancelText: {
      type: String,
      default: "取消",
    },
    histroyLabel: {
      type: String,
      default: "搜索历史",
    },
    deleteAllText: {
      type: String,
      default: "删除全部",
    },
    doneText: {
      type: String,
      default: "完成",
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
        };
      },
    },
    delete: {
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
      showSearchPanel: false,
      historyRecords: [],
      historyStatus: false,
      isEdit: false,
    };
  },
  components: { Flex, FlexItem, Iconfont, Popup, Field, Spin },
  methods: {
    handleFireSearch() {
      if (this.isEdit) {
        this.isEdit = false;
      }
      this.showSearchPanel = !this.showSearchPanel;
    },
    handleBeforeEnter() {
      this.historyRequest();
    },
    handleAfterEnter() {
      const value = this.value;
      this.$emit("input", "");
      const inputDom = this.$refs.input.$el.getElementsByTagName("input")[0];
      inputDom.focus();
      this.rendered(() => {
        this.$emit("input", value);
        inputDom.value = value;
      });
    },
    handleEdit() {
      this.isEdit = true;
      const records = [];
      this.historyRecords.forEach((record) => {
        records.push({ ...record, closeAble: true });
      });
      this.historyRecords = records;
    },
    handleDone() {
      this.isEdit = false;
      const records = [];
      this.historyRecords.forEach((record) => {
        records.push({ ...record, closeAble: false });
      });
      this.historyRecords = records;
    },
    handleDelete(e) {
      const { type, record } = e;
      const params = { ...this.delete.params, type, record };
      const promise = this.delete.action(params);
      promise
        .then((res) => {
          if (type === "single") {
            const index = this.historyRecords.findIndex(r => r.id === record.id);
            this.historyRecords.splice(index, 1);
          } else {
            if (this.delete.parse(res)) {
              this.isEdit = false;
              this.historyRecords = [];
            }
          }
        })
        .catch(() => {});
    },
    handleOnInput(e) {
      this.$emit("input", e);
    },
    historyRequest() {
      const params = { ...this.history.params, type: "request" };
      const promise = this.history.action(params);
      this.historyStatus = true;
      promise
        .then((res) => {
          this.historyStatus = false;
          this.historyRecords = this.history.parse(res, params);
        })
        .catch(() => {
          this.historyStatus = false;
        });
    },
    handleRecordClick(e) {
      if (this.isEdit) return;
      this.$refs.input.$el.getElementsByTagName("input")[0].focus();
      this.$emit("input", this.history.parse(e, { type: "parser" }));
      this.showSearchPanel = false;
      this.$emit("fireSearch", e);
    },
    handleKeydown(e) {
      if (Number(e.keyCode) === 13) {
        this.$emit("fireSearch", this.value);
        if (this.value === "") return;
        // fire http request
        if (this.closeWhenSearch) {
          this.showSearchPanel = false;
        }
      }
    },
  },
  render(h) {
    const hasDefault = this.value && this.value !== "";
    return h("div", { class: ["yn-elastic-search"] }, [
      h("div", { class: ["search-warrper"] }, [
        h(
          "p",
          {
            class: ["input"],
            on: {
              click: this.handleFireSearch,
            },
          },
          [
            h(
              genComponentName("iconfont"),
              { props: { name: "search", size: 16 } },
              []
            ),
            h("span", { class: [hasDefault ? "value" : "placeholder"] }, hasDefault ? this.value : this.placeholder),
          ]
        ),
      ]),
      h(
        genComponentName("popup"),
        {
          props: { position: "middle", value: this.showSearchPanel, disableMask: true },
          class: ["elastic-serach-popup"],
          on: {
            beforeEnter: this.handleBeforeEnter,
            afterEnter: this.handleAfterEnter,
          },
        },
        [
          h("div", { class: ["search-panel"] }, [
            h("div", { class: ["search-head"] }, [
              h("div", { class: ["search-head-flex"] }, [
                h(
                  genComponentName("flex"),
                  { props: { justifyContent: "spaceBetween" } },
                  [
                    h(
                      genComponentName("flex-item"),
                      {
                        class: ["input-flex"],
                      },
                      [
                        h(
                          genComponentName("field"),
                          {
                            ref: "input",
                            props: {
                              placeholder: this.placeholder,
                              clearable: true,
                              value: this.value,
                              type: "text",
                            },
                            on: {
                              input: this.handleOnInput,
                              keydown: this.handleKeydown,
                            },
                            class: ["input-field"],
                          },
                          []
                        ),
                      ]
                    ),
                    h(
                      genComponentName("flex-item"),
                      {
                        class: ["cancel-flex"],
                      },
                      [
                        h(
                          "span",
                          {
                            on: {
                              click: this.handleFireSearch,
                            },
                          },
                          this.cancelText
                        ),
                      ]
                    ),
                  ]
                ),
              ]),
            ]),
            h(
              "div",
              { class: ["search-body", this.historyStatus ? "loading" : ""] },
              [
                this.historyStatus
                  ? h(
                      genComponentName("spin"),
                      {
                        class: ["hisotry-spin"],
                        props: { type: "rotate-svg", size: 40 },
                      },
                      []
                    )
                  : h("div", { class: ["histroy-record"] }, [
                      this.historyRecords.length > 0
                        ? h(
                            genComponentName("flex"),
                            { props: { flexDirection: "column" } },
                            [
                              h(
                                genComponentName("flex-item"),
                                { class: ["history-flex"] },
                                [
                                  h(genComponentName("flex"), { props: { justifyContent: "spaceBetween" } }, [
                                    h(genComponentName("flex-item"), {}, [
                                      h(
                                        "h3",
                                        { class: ["history-label"] },
                                        this.histroyLabel
                                      )
                                    ]),
                                    h(genComponentName("flex-item"), {}, [
                                      this.isEdit
                                        ? h("span", { class: ["operation"] }, [
                                            h(
                                              "small",
                                              {
                                                class: ["delete-all"],
                                                on: {
                                                  click: this.handleDelete.bind(
                                                    this,
                                                    { type: "all" }
                                                  ),
                                                },
                                              },
                                              this.deleteAllText
                                            ),
                                            h(
                                              "small",
                                              {
                                                class: ["done"],
                                                on: {
                                                  click: this.handleDone,
                                                },
                                              },
                                              this.doneText
                                            ),
                                          ])
                                        : h(
                                            genComponentName("iconfont"),
                                            {
                                              props: { name: "delete", size: 16 },
                                              on: {
                                                click: this.handleEdit,
                                              },
                                            },
                                            []
                                          ),
                                    ])
                                  ])
                                ]
                              ),
                              h(
                                genComponentName("flex-item"),
                                { class: ["delete-flex"] },
                                [
                                  h(
                                    genComponentName("flex"),
                                    {
                                      props: { flexWrap: "wrap" },
                                      class: ["records"],
                                    },
                                    Array.apply(null, this.historyRecords).map(
                                      (record, key) => {
                                        return h(
                                          genComponentName("flex-item"),
                                          { key, class: ["record"] },
                                          [
                                            h(
                                              "span",
                                              {
                                                on: {
                                                  click:
                                                    this.handleRecordClick.bind(
                                                      this,
                                                      record
                                                    ),
                                                },
                                              },
                                              this.history.parse(record, {
                                                type: "parser",
                                              })
                                            ),
                                            record.closeAble
                                              ? h(
                                                  genComponentName("iconfont"),
                                                  {
                                                    class: ["record-clear"],
                                                    props: {
                                                      name: "clear",
                                                      size: 12,
                                                    },
                                                    on: {
                                                      click:
                                                        this.handleDelete.bind(
                                                          this,
                                                          {
                                                            type: "single",
                                                            record,
                                                          }
                                                        ),
                                                    },
                                                  },
                                                  []
                                                )
                                              : null,
                                          ]
                                        );
                                      }
                                    )
                                  ),
                                ]
                              ),
                            ]
                          )
                        : null,
                    ]),
              ]
            ),
          ]),
        ]
      ),
    ]);
  },
});
