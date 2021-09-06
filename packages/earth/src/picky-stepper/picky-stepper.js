/*
 * @Author: Just be free
 * @Date:   2020-03-25 16:50:20
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-02 15:14:41
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Popup from "../popup";
import Button from "../button";
import Iconfont from "../iconfont";
import Radiobox from "../radiobox";
import Checkbox from "../checkbox";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { isPromise, hasOwnProperty } from "../modules/utils";
export default defineComponent({
  name: "PickyStepper",
  components: {
    Popup,
    Iconfont,
    Flex,
    FlexItem,
    Button,
    Radiobox,
    Checkbox,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    steps: {
      type: Array,
      default: () => {
        return [];
      },
    },
    submit: {
      type: Function,
      default: () => {},
    },
    confirmText: {
      type: String,
      default: "确认",
    },
  },
  data() {
    return {
      title: "",
      caculateSteps: [],
      currentStep: {},
      submitLoading: false,
    };
  },
  watch: {
    steps: function () {
      this.initData();
    },
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e);
    },
    handleBeforeEnter() {
      if (this.caculateSteps.length === 0) {
        this.initData();
      }
      this.$emit("beforeEnter");
    },
    initData() {
      const steps = [];
      this.steps.forEach((step, index) => {
        if (!step.key) {
          step.key = index;
        }
        step.list.forEach((item, key) => {
          if (!item.key) {
            item.key = key;
          }
        });
        steps.push(step);
      });
      this.caculateSteps = this.bindChain(steps);
      if (this.caculateSteps.length > 0) {
        this.currentStep = this.caculateSteps[0];
      }
    },
    bindChain(steps = []) {
      return Array.apply(null, steps).map((step, index) => {
        step.previousNode = steps[index - 1] ? steps[index - 1].key : null;
        step.nextNode = steps[index + 1] ? steps[index + 1].key : null;
        return step;
      });
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
    close() {
      this.handleChange(false);
    },
    destroyData() {
      this.caculateSteps = [];
    },
    createClose(h) {
      return h(
        genComponentName("iconfont"),
        {
          class: ["yn-picky-stepper-close"],
          props: { name: "close", size: 12 },
          on: { click: this.close },
        },
        []
      );
    },
    stepBack() {
      const { previousNode } = this.currentStep;
      const { caculateSteps } = this;
      this.currentStep = caculateSteps.find((step) => {
        return step.key === previousNode;
      });
    },
    createBack(h) {
      const { previousNode } = this.currentStep;
      if (
        previousNode !== null &&
        previousNode !== undefined &&
        previousNode !== ""
      ) {
        return h(
          genComponentName("iconfont"),
          {
            class: ["yn-picky-stepper-back"],
            props: { name: "back", size: 20 },
            on: { click: this.stepBack },
          },
          []
        );
      }
    },
    createTitle(h) {
      return h(
        "span",
        { class: ["yn-picky-stepper-title"] },
        this.currentStep.title
      );
    },
    createHeader(h) {
      return h("div", { class: ["yn-picky-stepper-header"] }, [
        this.createBack(h),
        this.createTitle(h),
        this.createClose(h),
      ]);
    },
    replace(arr = [], index, node) {
      arr.splice(index, 1, node);
      return arr;
    },
    updateNode(e) {
      const { step, stepIndex, listItem, listIndex } = e;
      const stepNode = this.caculateSteps.find((item) => {
        return item.key === step.key;
      });
      const listNode = stepNode.list.find((item) => {
        return listItem.key === item.key;
      });
      this.replace(stepNode.list, listIndex, listNode);
      this.replace(this.caculateSteps, stepIndex, stepNode);
    },
    getSelectedData() {
      const { caculateSteps } = this;
      const results = [];
      caculateSteps.forEach((step) => {
        const list = [];
        step.list.forEach((item) => {
          if (item.checked) {
            list.push(item);
          }
        });
        results.push({ list, key: step.key });
      });
      return results;
    },
    handleStepConfirm() {
      const { currentStep, caculateSteps } = this;
      if (currentStep.nextNode) {
        this.currentStep = caculateSteps.find((step) => {
          return step.key === currentStep.nextNode;
        });
      } else {
        this.submitLoading = true;
        const result = this.getSelectedData();
        const { submit } = this.$props;
        if (submit && typeof submit === "function") {
          const promise = submit(result);
          if (isPromise(promise)) {
            promise.then((res) => {
              this.close();
              this.$emit("success", result, res);
              this.submitLoading = false;
              this.destroyData();
            });
          } else {
            this.submitLoading = false;
            this.close();
            this.$emit("success", result);
          }
        } else {
          this.submitLoading = false;
          this.close();
          this.$emit("success", result);
        }
      }
    },
    handlePickyClick(e) {
      const { listItem, step } = e;
      if (listItem.disabled) {
        return;
      }
      this.$emit("picked", e);
      if (step.multiple) {
        listItem.checked = !listItem.checked;
      } else {
        step.list.forEach((list) => {
          if (list.key === listItem.key) {
            list.checked = true;
          } else {
            list.checked = false;
          }
        });
      }
      this.updateNode(e);
    },
    handleCustomeInput(args, event) {
      const { item, e } = args;
      item.value = event.target.value;
      item.count = item.value.length;
      this.updateNode(e);
    },
    getDisabledStatus() {
      const { currentStep } = this;
      let actived;
      if (currentStep && currentStep.list && currentStep.list.length > 0) {
        actived = currentStep.list.find((item) => {
          if (["input", "textarea"].indexOf(item.type) > -1) {
            const required = hasOwnProperty(item, "required")
              ? item.required
              : true;
            return item.checked && (required ? item.value !== "" : true);
          } else {
            return item.checked;
          }
        });
      }
      return this.submitLoading || !actived;
    },
    createFooter(h) {
      return h("div", { class: ["yn-picky-stepper-footer"] }, [
        h(
          genComponentName("button"),
          {
            on: { click: this.handleStepConfirm },
            class: ["step-confirm"],
            props: {
              size: "large",
              type: "primary",
              loading: this.submitLoading,
              disabled: this.getDisabledStatus(),
              loadingColor: "#fff",
            },
          },
          this.confirmText
        ),
      ]);
    },
    createCustomeElement(h, { item, step, stepIndex, key, display }) {
      if (item.type && item.type === "input" && display === "inline") {
        return h(genComponentName("flex-item"), { props: { flex: 1 } }, [
          h(
            "input",
            {
              on: {
                input: this.handleCustomeInput.bind(this, {
                  item,
                  e: {
                    step,
                    stepIndex,
                    listItem: item,
                    listIndex: key,
                  },
                }),
              },
              class: ["input", item.value !== "" ? "active" : ""],
              attrs: {
                placeholder: item.placeholder,
                maxlength: item.maxlength,
              },
            },
            []
          ),
        ]);
      } else if (
        item.type &&
        item.type === "textarea" &&
        display === "column"
      ) {
        const { count = 0 } = item;
        return h("div", { class: "textarea-wapper" }, [
          h(
            "textarea",
            {
              class: ["textarea", item.value !== "" ? "active" : ""],
              on: {
                input: this.handleCustomeInput.bind(this, {
                  item,
                  e: {
                    step,
                    stepIndex,
                    listItem: item,
                    listIndex: key,
                  },
                }),
              },
              attrs: {
                placeholder: item.placeholder,
                maxlength: item.maxlength,
              },
            },
            []
          ),
          h(
            "div",
            {
              class: "textarea-counter",
              directives: [
                { name: "show", value: item.counter && item.maxlength > 0 },
              ],
            },
            [`${count}/${item.maxlength}`]
          ),
        ]);
      }
    },
    createPickerList(h, step, stepIndex) {
      return h(
        "div",
        {
          class: ["yn-picky-stepper-content"],
          directives: [
            { name: "show", value: step.key === this.currentStep.key },
          ],
        },
        [
          h(
            "ul",
            { class: [] },
            Array.apply(null, step.list).map((item, key) => {
              return h(
                "li",
                {
                  on: {
                    click: this.handlePickyClick.bind(this, {
                      step,
                      stepIndex,
                      listItem: item,
                      listIndex: key,
                    }),
                  },
                  key,
                },
                [
                  h(genComponentName("flex"), {}, [
                    h(genComponentName("flex-item"), {}, [
                      step.multiple
                        ? h(
                            genComponentName("checkbox"),
                            {
                              props: {
                                checked: item.checked,
                                size: 20,
                                disabled: item.disabled,
                              },
                            },
                            []
                          )
                        : h(
                            genComponentName("radiobox"),
                            {
                              props: {
                                checked: item.checked,
                                size: 20,
                                disabled: item.disabled,
                              },
                            },
                            []
                          ),
                    ]),
                    h(genComponentName("flex-item"), {}, [
                      h("span", { class: ["text"] }, item.label),
                    ]),
                    this.createCustomeElement(h, {
                      item,
                      step,
                      stepIndex,
                      key,
                      display: "inline",
                    }),
                  ]),
                  this.createCustomeElement(h, {
                    item,
                    step,
                    stepIndex,
                    key,
                    display: "column",
                  }),
                ]
              );
            })
          ),
        ]
      );
    },
    createSteps(h) {
      return Array.apply(null, this.caculateSteps).map((step, index) => {
        return this.createPickerList(h, step, index);
      });
    },
  },
  render(h) {
    return h("div", { class: ["yn-picky-stepper"] }, [
      h(
        genComponentName("popup"),
        {
          on: {
            input: this.handleChange,
            beforeEnter: this.handleBeforeEnter,
            afterEnter: this.handleAfterEnter,
            beforeLeave: this.handleBeforeLeave,
            afterLeave: this.handleAfterLeave,
          },
          directives: [{ name: "show", value: this.value }],
          props: { position: "bottom" },
          style: { "max-height": "80%" },
        },
        [this.createHeader(h), ...this.createSteps(h), this.createFooter(h)]
      ),
    ]);
  },
});
