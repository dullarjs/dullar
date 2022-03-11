/*
 * @Author: yegl
 * @Date: 2022-01-25 11:20:19
 * @Last Modified by: yegl
 * @Last Modified time: 2022-03-04 18:58:22
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { on, off } from "../modules/event";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "Select",
  mixins: [slotsMixins],
  props: {
    value: {
      require: true,
    },
    width: {
      type: [Number, String],
      default: 180,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: [Boolean, String],
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    clear: {
      type: Boolean,
      default: false,
    }
  },
  provide() {
    return {
      selectNode: this,
    };
  },
  data() {
    return {
      scrollerBarVisible: false,
      inputNodeInfo: null,
      searchList: [],
      loading: false,
      inputValue: "",
      selected: [],
      scrollerBarTop: 0,
      inputLabelList: {},
      fromDel: false,
      filterInputFocus: false,
      lock: false,
      filterInputValue: "",
      showClearIcon: false
    };
  },
  mounted() {
    this.suggestionVisible();
  },
  methods: {
    suggestionVisible() {
      const _input = this.$refs.input;
      this.inputNodeInfo = _input && _input.$el.getBoundingClientRect();
      on(document, "click", this.onScrollBarListener);
    },
    handleFocus() {
      this.scrollerBarVisible = true;
      const _input = this.$refs.input;
      _input.isFocus = true;
    },
    close(isFocus = false) {
      const { filterable } = this;
      this.scrollerBarVisible = false;
      const _input = this.$refs.input;
      _input.isFocus = isFocus;
      _input.isSelect = isFocus;
      filterable && this.initFilterInputValue();
    },
    onScrollBarListener(e) {
      const { $refs: _refs, $el: _el, fromDel, filterable } = this;
      const _input = _refs.input;
      const _scrollerBar = _refs.scrollerBar;
      const _selectTags = _el.querySelector(".yn-select-tags");
      if (
        !_input.$el.contains(e.target) &&
        !_scrollerBar.$el.contains(e.target) &&
        ((_selectTags && !_selectTags.contains(e.target)) || !_selectTags) &&
        !fromDel &&
        !e.target.classList.contains("yn-select-filter-option")
      ) {
        this.close(!!_scrollerBar.$el.contains(e.target));
        this.filterInputFocus = false;
      } else {
        filterable && (this.filterInputFocus = true);
      }
      this.fromDel = false;
    },
    handleSelect(rowData) {
      const { multiple, value, inputLabelList, filterable } = this;
      if (!multiple) {
        this.$emit("input", rowData.value);
        this.inputValue = rowData.label;
        this.close(true);
      } else {
        const _valueList = value || [];
        const itemInd = value.indexOf(rowData.value);
        if (itemInd > -1) {
          _valueList.splice(itemInd, 1);
          delete inputLabelList[rowData.value];
          this.fromDel = true;
        } else {
          inputLabelList[rowData.value] = rowData.label;
          _valueList.push(rowData.value);
        }
        filterable && this.initFilterInputValue();
        this.tagNumber = _valueList.length || 0;
        this.$emit("input", _valueList);
      }
    },
    initInputValue(rowData) {
      const { multiple, inputLabelList, collapseTags } = this;
      const { value: _optionValue, label } = rowData;
      if (multiple) {
        inputLabelList[_optionValue] = label;
        if (collapseTags) this.tagNumber = this.value.length || 0;
      } else {
        this.inputValue = label;
      }
    },
    selectTags() {
      const h = this.$createElement;
      const { inputLabelList, collapseTags, value } = this;
      const nodes = [];
      if (value.length === 0) return nodes;
      if (collapseTags) {
        const _tagData = Object.keys(inputLabelList)[0];
        const _node = this.initTagNode(h, _tagData, inputLabelList);
        nodes.push(_node);
      } else {
        for (let item in inputLabelList) {
          const _node = this.initTagNode(h, item, inputLabelList);
          nodes.push(_node);
        }
      }

      this.$nextTick(() => {
        const _selectTags = this.$el.querySelector(".yn-select-tags");
        const _input = this.$refs.input;
        const inputHeight = _selectTags.offsetHeight;
        _input.$el.style.height = inputHeight + "px";
        this.scrollerBarTop = inputHeight + 12;
      });
      return nodes;
    },
    initTagNode(h, item, listData) {
      const _label = listData[item];
      return h(
        "span",
        {
          class: "yn-select-tag",
        },
        [
          _label,
          h(
            genComponentName("iconfont"),
            {
              props: {
                size: "14",
                name: "clear",
              },
              class: ["yn-select-tag-icon"],
              on: {
                click: () => {
                  return this.handleSelect({ value: item, label: _label });
                },
              },
            },
            []
          ),
        ]
      );
    },
    // 中文输入法开始
    onCompositionStart() {
      this.lock = true;
    },
    // 中文输入法结束
    onCompositionEnd(e) {
      this.lock = false;
      this.filterInputValue = e.target.value && e.target.value.trim();
    },
    handleInput(e) {
      if (!this.lock) {
        this.filterInputValue = e.target.value && e.target.value.trim();
      }
    },
    initFilterInputValue() {
      this.filterInputValue = "";
      this.$refs.filterInput.value = "";
    },
    isShowClearIcon(isShow) {
      if (!this.clear) return;
      this.showClearIcon = this.inputValue !== "" && isShow;
    },
    clearFn() {
      this.$emit("input", "");
      this.inputValue = "";
    }
  },
  destroyed() {
    off(document, "click", this.onScrollBarListener);
  },
  render(h) {
    const {
      width: defaultWidth,
      scrollerBarVisible,
      filterInputFocus,
      filterInputValue,
      inputNodeInfo,
      placeholder,
      disabled,
      multiple,
      scrollerBarTop,
      collapseTags,
      tagNumber,
      inputLabelList,
      filterable,
      showClearIcon
    } = this;
    let _placeholder = placeholder;
    if (multiple && Object.keys(inputLabelList).length > 0) {
      this.inputValue = "";
      _placeholder = "";
    }
    if (filterInputFocus && filterable) {
      this.$refs.filterInput.focus();
    }
    return h(
      "div",
      {
        class: "yn-select",
        style: { width: defaultWidth === "auto" ? "100%" : (defaultWidth + "px") },
        on: { mouseenter: () => this.isShowClearIcon(true), mouseleave: () => this.isShowClearIcon(false) }
      },
      [
        h(
          genComponentName("input"),
          {
            props: {
              width: defaultWidth === "auto" ? defaultWidth: (defaultWidth + "px"),
              readonly: true,
              value: this.inputValue,
              placeholder: _placeholder,
              disabled,
            },
            on: {
              handleFocus: this.handleFocus,
            },
            ref: "input",
          },
          []
        ),
        showClearIcon && h(
          genComponentName("iconfont"),
          {
            props: {
              name: "clear",
              size: 12,
            },
            on: {
              click: this.clearFn,
            },
            class: "clear-icon"
          },
          []
        ),
        multiple &&
          h(
            "div",
            {
              class: { "yn-select-tags": true },
              on: {
                click: this.handleFocus,
              },
            },
            [
              ...this.selectTags(),
              collapseTags &&
                tagNumber > 1 &&
                h("span", { class: "yn-select-tag" }, [
                  " + " + (tagNumber - 1),
                ]),
              filterable &&
                h(
                  "input",
                  {
                    class: "yn-select-filter-input",
                    ref: "filterInput",
                    domProps: {
                      placeholder: _placeholder,
                    },
                    on: {
                      compositionstart: this.onCompositionStart,
                      compositionend: this.onCompositionEnd,
                      keyup: this.handleInput,
                    },
                  },
                  []
                ),
            ]
          ),
        h(
          genComponentName("scroller-bar"),
          {
            style: {
              display: scrollerBarVisible ? "block" : "none",
            },
            props: {
              inputNodeInfo: inputNodeInfo,
              scrollerBarVisible,
              isSelected: true,
              scrollerBarTop,
              width: defaultWidth,
            },
            ref: "scrollerBar",
          },
          [
            filterInputValue.length > 0
              ? h(
                  genComponentName("option"),
                  {
                    props: {
                      label: filterInputValue,
                      value: filterInputValue,
                    },
                    class: "yn-select-filter-option",
                  },
                  []
                )
              : this.slots("default"),
          ]
        ),
      ]
    );
  },
});
