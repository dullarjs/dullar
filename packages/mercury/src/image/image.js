/*
 * @Author: tongh
 * @Date:   2020-08-25 10:44:56
 * @Last Modified by:   tongh
 * @Last Modified time: 2020-08-25 13:38:06
 */
import { defineComponent, genComponentName } from "../modules/component";
import { throttle, isString } from "../modules/utils";
import { loadImageAsync } from "../modules/utils/lazyLoad";
import { getScroller } from "../modules/dom/scroll";
import { slotsMixins } from "@/mixins/slots";
import { on, off } from "../modules/event";
export default defineComponent({
  name: "Image",
  mixins: [slotsMixins],
  props: {
    width: Number | String,
    height: Number | String,
    iconSize: {
      type: Number,
      default: 50,
    },
    alt: {
      type: String,
      default: "",
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
      default: "picture",
    },
    src: {
      type: String,
      default: "",
    },
    fit: {
      type: String,
      default: "cover", // 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
    },
    backgroundColor: {
      type: String,
      default: "#f8f8f8",
    },

    scrollContainer: {},
    placeholder: {
      type: String,
      default: "正在加载中...",
    },
    errorText: {
      type: String,
      default: "加载失败",
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      show: !this.lazy,
      loadingFinish: false,
      imageWidth: 0,
      imageHeight: 0,
      scrollContainerDom: null,
    };
  },
  watch: {
    src() {
      this.show && this.loadImage();
    },
    show(val) {
      val && this.loadImage();
    },
  },
  mounted() {
    if (this.lazy) {
      this.addLazyLoadListener();
    } else {
      this.loadImage();
    }
  },
  beforeDestroy() {
    if (this.lazy) {
      this.loadingFinish = true;
      this.removeLazyLoadListener();
    }
  },
  methods: {
    loadImage() {
      if (this.loadingFinish) return;
      // reset status
      this.loading = true;
      this.error = false;
      loadImageAsync({
        src: this.src,
      })
        .then((res) => {
          this.imageWidth = res.width;
          this.imageHeight = res.height;
          this.loadingFinish = true;
          this.loading = false;
          this.error = false;
          this.$emit("load", res);
        })
        .catch((err) => {
          this.loading = false;
          this.error = true;
          this.loadingFinish = true;
          this.$emit("error", err);
        });
    },
    isInContainer(el) {
      var bound = el.getBoundingClientRect();
      var clientHeight = this.scrollContainerDom.clientHeight;
      return bound.top <= clientHeight;
    },
    handleLazyLoad() {
      if (!this.isInContainer(this.$el)) {
        this.show = true;
        this.removeLazyLoadListener();
      } else {
        this.loadImage();
      }
    },
    addLazyLoadListener() {
      const { scrollContainer } = this;
      let _scrollContainer = null;
      if (isString(scrollContainer)) {
        _scrollContainer = document.getElementById(scrollContainer);
      } else {
        _scrollContainer = getScroller(this.$el);
      }
      if (_scrollContainer) {
        this.scrollContainerDom = _scrollContainer;
        this._lazyLoadHandler = throttle(this.handleLazyLoad, 200)();
        on(this.scrollContainerDom, "scroll", this.handleLazyLoad);
        this.handleLazyLoad();
      }
    },
    removeLazyLoadListener() {
      const { scrollContainerDom, loadingFinish } = this;
      if (scrollContainerDom && loadingFinish) {
        off(scrollContainerDom, "scroll", this.handleLazyLoad);
        this._scrollContainer = null;
        this._lazyLoadHandler = null;
      }
    },
  },

  render(h) {
    const {
      loading,
      error,
      placeholder,
      errorText,
      src,
      alt,
      fit,
      width,
      height,
      backgroundColor,
      iconName,
      iconSize,
    } = this;
    return h(
      "div",
      {
        class: ["yn-image"],
        style: {
          width: width + "px",
          height: height + "px",
          backgroundColor,
        },
      },
      [
        loading
          ? h(
              "div",
              {
                class: "yn-image-placeholder",
              },
              [
                this.slots("placeholder").length
                  ? this.slots("placeholder")
                  : placeholder,
              ]
            )
          : error
          ? h(
              "div",
              {
                class: "yn-image-error",
              },
              [
                h("div", {}, [
                  iconName
                    ? h(
                        genComponentName("iconfont"),
                        {
                          class: ["yn-image-error-icon"],
                          props: {
                            name: iconName,
                            size: iconSize,
                          },
                        },
                        []
                      )
                    : this.slots("error").length
                    ? this.slots("error")
                    : errorText,
                ]),
              ]
            )
          : h("img", {
              class: "yn-image-inner",
              style: {
                width: width + "px",
                height: height + "px",
                objectFit: fit,
              },
              attrs: {
                src,
                alt,
              },
            }),
      ]
    );
  },
});
