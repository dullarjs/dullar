/*
 * @Author: Just be free
 * @Date:   2021-07-20 13:32:35
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-26 17:02:31
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { preventDefault } from "../modules/event";
import { getOffset } from "../modules/dom";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Popup from "../popup";
import Iconfont from "../iconfont";
const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 529;
export default defineComponent({
  name: "Magnifier",
  components: { Flex, FlexItem, Popup, Iconfont },
  props: {
    images: Array,
    zoom: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      offsetLeft: 0,
      offsetTop: 0,
      showCrosshair: false,
      previewIndex: 0,
      crosshairWidth: 0,
      crosshairHeight: 0,
      steps: 0,
      showZoom: false,
      zoomEnter: false,
      popupEntered: false,
    };
  },
  computed: {
    crosshairStyle() {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`,
        width: `${this.crosshairWidth}px`,
        height: `${this.crosshairHeight}px`,
      };
    },
    previewStyle() {
      return {
        width: `${VIEWBOX_WIDTH}px`,
        height: `${VIEWBOX_HEIGHT}px`,
        backgroundImage: `url("${this.images[this.previewIndex]}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${this.zoom * this.left}px -${
          this.zoom * this.top
        }px`,
        backgroundSize: `${this.zoom}00%`,
      };
    },
    previewListStyle() {
      const length = this.images.length;
      const margin = 5;
      return {
        width: `${length * 60 + length * margin}px`,
        marginLeft: `${this.steps * (60 + margin)}px`,
      };
    },
    zoomStyle() {
      return {
        backgroundSize: "110%",
        backgroundImage: `url(${this.images[this.previewIndex]})`,
      };
    },
  },
  methods: {
    handleAfterEnter() {
      this.popupEntered = true;
      this.$refs.a.style.width = `${this.$refs.zoomImage.offsetWidth}px`;
      this.$refs.a.style.height = `${this.$refs.zoomImage.offsetHeight}px`;
    },
    handleAfterLeave() {
      this.popupEntered = false;
    },
    initRange() {
      const border = this.$refs.border;
      const offset = getOffset(border);
      this.offsetLeft = offset.left;
      this.offsetTop = offset.top;
    },
    initZoom() {
      this.crosshairWidth = VIEWBOX_WIDTH / this.zoom;
      this.crosshairHeight = VIEWBOX_HEIGHT / this.zoom;
    },
    setPosition(e) {
      const leftEdge = this.crosshairWidth / 2 + this.offsetLeft;
      const rightEdge =
        this.offsetLeft +
        e.target.parentNode.offsetWidth -
        this.crosshairWidth / 2;
      const topEdge = this.crosshairHeight / 2 + this.offsetTop;
      const bottomEdge =
        this.offsetTop +
        e.target.parentNode.offsetHeight -
        this.crosshairHeight / 2;
      let disX = e.clientX;
      let disY = e.clientY;
      if (disX < leftEdge) {
        disX = leftEdge;
      }
      if (disX > rightEdge) {
        disX = rightEdge;
      }
      if (disY < topEdge) {
        disY = topEdge;
      }
      if (disY > bottomEdge) {
        disY = bottomEdge;
      }
      this.left = disX - this.crosshairWidth / 2 - this.offsetLeft;
      this.top = disY - this.crosshairHeight / 2 - this.offsetTop;
    },
    handleMouseEnter(e) {
      this.initRange();
      this.initZoom();
      this.showCrosshair = true;
      this.setPosition(e);
    },
    handleMouseMove(e) {
      this.setPosition(e);
    },
    handleMouseLeave() {
      this.showCrosshair = false;
    },
    zoomUpImage() {
      this.showZoom = true;
    },
    handlePreviewMouseEnter(index) {
      this.previewIndex = index;
    },
    handlePreviewMouseOut() {},
    nextOrPrevious(button) {
      const length = this.images.length;
      if (length < 6) {
        return;
      }
      if (button === "next") {
        if (Math.abs(this.steps) >= length - 5) {
          return;
        }
        this.steps -= 1;
      } else {
        if (this.steps === 0) {
          return;
        }
        this.steps += 1;
      }
    },
    handlePopupInput() {
      this.showZoom = false;
    },
    // handleZoomMouseEnter() {
    //   this.zoomEnter = true;
    // },
    // handleZoomMouseMove() {},
    // handleZoomMouseLeave() {
    //   this.zoomEnter = false;
    // }
  },
  render(h) {
    const preview = this.images[this.previewIndex];
    return h("div", { class: ["yn-magnifier"] }, [
      h("div", { class: ["preview"], on: { click: this.zoomUpImage } }, [
        h(
          "a",
          {
            ref: "border",
            attrs: { href: preview },
            on: {
              click: preventDefault,
              mouseenter: this.handleMouseEnter,
              mousemove: this.handleMouseMove,
              mouseleave: this.handleMouseLeave,
            },
          },
          [
            h("img", { attrs: { src: preview } }, []),
            h(
              "div",
              {
                class: ["crosshair", this.showCrosshair ? "" : "hide"],
                style: { ...this.crosshairStyle },
              },
              []
            ),
          ]
        ),
        // this.showCrosshair ?
        h("transition", { props: { name: "magnifier-fade" } }, [
          h(
            "div",
            {
              directives: [{ name: "show", value: this.showCrosshair }],
              class: ["magnifier-preview"],
              style: { ...this.previewStyle },
            },
            []
          ),
        ]),
      ]),
      h("div", { class: ["preview-list-wrap"] }, [
        h(
          genComponentName("flex"),
          { props: { justifyContent: "spaceAround" } },
          [
            h(genComponentName("flex-item"), {}, [
              h(
                "a",
                {
                  on: {
                    click: this.nextOrPrevious.bind(this, "previous"),
                  },
                  attrs: {
                    href: "javascript:;",
                  },
                  class: ["prev-button", this.steps === 0 ? "disabled" : ""],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      class: [],
                      props: {
                        name: `magnifier-left-arrow${
                          this.steps === 0 ? "" : "-active"
                        }`,
                        size: 16,
                      },
                    },
                    []
                  ),
                ]
              ),
            ]),
            h(genComponentName("flex-item"), {}, [
              h("div", { class: ["list-box"] }, [
                h(
                  "ul",
                  { style: { ...this.previewListStyle } },
                  Array.apply(null, this.images).map((img, index) => {
                    return h(
                      "li",
                      {
                        attrs: { dataIndex: index },
                        class: [index === this.previewIndex ? "selected" : ""],
                        on: {
                          mouseenter: this.handlePreviewMouseEnter.bind(
                            this,
                            index
                          ),
                          mouseout: this.handlePreviewMouseOut,
                        },
                      },
                      [
                        h(
                          "a",
                          {
                            attrs: { href: img },
                            on: { click: preventDefault },
                          },
                          [h("img", { attrs: { src: img } }, [])]
                        ),
                      ]
                    );
                  })
                ),
              ]),
            ]),
            h(genComponentName("flex-item"), {}, [
              h(
                "a",
                {
                  on: {
                    click: this.nextOrPrevious.bind(this, "next"),
                  },
                  attrs: { href: "javascript:;" },
                  class: [
                    "next-button",
                    5 - this.steps === this.images.length ? "disabled" : "",
                  ],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      class: [],
                      props: {
                        name: `magnifier-right-arrow${
                          5 - this.steps === this.images.length ? "" : "-active"
                        }`,
                        size: 16,
                      },
                    },
                    []
                  ),
                ]
              ),
            ]),
          ]
        ),
      ]),
      h(
        genComponentName("popup"),
        {
          props: { position: "middle" },
          on: {
            afterEnter: this.handleAfterEnter,
            afterLeave: this.handleAfterLeave,
          },
          directives: [{ name: "show", value: this.showZoom }],
        },
        [
          h(
            "div",
            {
              on: {
                click: this.handlePopupInput,
              },
              class: ["zoom-image"],
            },
            [
              h(
                "a",
                {
                  ref: "a",
                  attrs: { href: "javascript:;" },
                  style: {
                    ...this.zoomStyle,
                  },
                  on: {
                    // mouseenter: this.handleZoomMouseEnter,
                    // mousemove: this.handleZoomMouseMove,
                    // mouseleave: this.handleZoomMouseLeave
                  },
                },
                [
                  h(
                    "img",
                    {
                      ref: "zoomImage",
                      class: [
                        this.popupEntered && this.zoomEnter ? "hide" : "",
                      ],
                      attrs: { src: preview },
                    },
                    []
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]);
  },
});
