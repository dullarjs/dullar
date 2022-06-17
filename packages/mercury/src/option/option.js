/*
 * @Author: yegl
 * @Date: 2022-01-26 17:54:38
 * @Last Modified by: yegl
 * @Last Modified time: 2022-06-17 17:44:18
 * @E-mail: yglgzyx@126.com
 */

import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "Option",
  mixins: [slotsMixins],
  inject: ["selectNode"],
  props: {
    label: [Number, String],
    value: {
      type: [Number, String],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const { selectNode, value, label } = this;
    const _selectValue = selectNode && selectNode.value;
    if (typeof _selectValue === "string" && _selectValue === value) {
      this.selectNode.initInputValue({ label, value });
    } else if (
      Array.isArray(_selectValue) &&
      _selectValue.indexOf(value) > -1
    ) {
      this.selectNode.initInputValue({ label, value });
    }
  },
  methods: {
    itemContent() {
      const _slots = this.slots("default") || [];
      const _content = _slots.length > 0 ? _slots : [this.label];
      return _content;
    },
    handleClick() {
      if (this.disabled) return;
      const { value, label } = this;
      this.selectNode.handleSelect({ value, label });
      const _input = this.selectNode.$refs.input;
      _input.isSelect = true;
    },
  },
  render(h) {
    const { disabled, selectNode, value } = this;
    let _selected = false,
      selectValueList = selectNode.value;
    if (!Array.isArray(selectValueList)) {
      _selected = selectNode.value === value;
    } else {
      _selected = selectValueList && selectValueList.indexOf(value) > -1;
    }
    return h(
      "li",
      {
        class: {
          "yn-option": true,
          "yn-option-disabled": disabled,
          "yn-option-selected": _selected,
        },
        on: { click: this.handleClick },
      },
      [...this.itemContent()]
    );
  },
});
