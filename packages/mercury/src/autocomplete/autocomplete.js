/*
 * @Author: yegl
 * @Date: 2022-01-20 14:48:36
 * @Last Modified by: yegl
 * @Last Modified time: 2022-01-24 15:49:19
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { on, off } from "../modules/event";
export default defineComponent({
  name: "Autocomplete",
  props: {
    value: String,
    haddleSearch: Function,
  },
  data() {
    return {
      scrollerBarVisible: false,
      inputNodeInfo: null,
      searchList: [],
    };
  },
  mounted() {
    // const slots = this.slots("default");
    // console.log(slots)
  },
  watch: {
    scrollerBarVisible: "getSuggestions",
    value: function () {
      const { scrollerBarVisible } = this;
      scrollerBarVisible && this.getSuggestions(scrollerBarVisible);
    },
  },
  methods: {
    suggestionVisible(value) {
      if (value) {
        const _input = this.$refs.input;
        this.inputNodeInfo = _input && _input.$el.getBoundingClientRect();
      }
    },
    handleFocus() {
      this.suggestionVisible(true);
      this.scrollerBarVisible = true;
      on(document, "click", this.onScrollBarListener);
    },
    close() {
      this.scrollerBarVisible = false;
      off(document, "click", this.onScrollBarListener);
    },
    onScrollBarListener(e) {
      const _input = this.$refs.input;
      const _scrollerBar = this.$refs.scrollerBar;
      if (
        !_input.$el.contains(e.target) &&
        !_scrollerBar.$el.contains(e.target)
      ) {
        this.close();
      }
    },
    observerInput(e) {
      this.$emit("input", e);
    },
    getSuggestions(state) {
      const { value: inputValue } = this;
      if (state === true) {
        this.loading = true;
        this.haddleSearch(inputValue, (suggestions) => {
          // this.loading = false;
          if (this.suggestionDisabled) {
            return;
          }
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions;
          } else {
            console.error("suggestions 必须为数组");
          }
        });
      }
    },
    handleSelect(rowData) {
      const { value: inputValue } = rowData;
      this.$emit("select", { ...rowData });
      this.observerInput(inputValue);
      this.close();
    },
  },
  render(h) {
    const {
      scrollerBarVisible,
      inputNodeInfo,
      value: inputValue,
      suggestions,
    } = this;
    return h("div", { class: "yn-autocomplete" }, [
      h(
        genComponentName("input"),
        {
          props: {
            placeholder: "请输入",
            value: inputValue,
          },
          domProps: {
            value: inputValue,
          },
          on: {
            handleFocus: this.handleFocus,
            input: this.observerInput,
          },
          ref: "input",
        },
        []
      ),
      h(
        genComponentName("scroller-bar"),
        {
          style: {
            display: scrollerBarVisible ? "block" : "none",
          },
          on: {
            handleSelect: this.handleSelect,
          },
          scopedSlots: this.$scopedSlots,
          props: {
            inputNodeInfo: inputNodeInfo,
            suggestions,
            scrollerBarVisible,
          },
          ref: "scrollerBar",
        },
        []
      ),
    ]);
  },
});
