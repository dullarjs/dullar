/*
 * @Author: yegl
 * @Date: 2022-01-20 14:48:36
 * @Last Modified by: yegl
 * @Last Modified time: 2022-05-25 16:52:13
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { on, off } from "../modules/event";
export default defineComponent({
  name: "Autocomplete",
  props: {
    value: String,
    haddleSearch: Function,
    showLoading: Boolean,
  },
  data() {
    return {
      scrollerBarVisible: false,
      inputNodeInfo: null,
      searchList: [],
      loading: false,
      suggestions: [],
    };
  },
  watch: {
    scrollerBarVisible(newValue) {
      return this.getSuggestions(newValue, this.value);
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
      this.getSuggestions(true, e);
    },
    getSuggestions(state = false, inputValue) {
      if (state === true) {
        if (this.showLoading) this.loading = true;
        this.haddleSearch(inputValue, (suggestions) => {
          this.loading = false;
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
      loading,
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
            display:
              scrollerBarVisible && suggestions.length > 0 ? "block" : "none",
          },
          on: {
            handleSelect: this.handleSelect,
          },
          scopedSlots: this.$scopedSlots,
          props: {
            inputNodeInfo: inputNodeInfo,
            suggestions,
            scrollerBarVisible,
            loading,
          },
          ref: "scrollerBar",
        },
        []
      ),
    ]);
  },
});
