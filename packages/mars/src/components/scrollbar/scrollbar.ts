// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import scrollbarWidth from '@/utils/scrollbar-width';
import { toObject } from '@/utils';
import Bar from './bar';
import Vue, { CreateElement } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { AnyObject } from '@/types';
import "./style/index.scss";

@Component({
  name: "YnScrollbar",
  components: { Bar }
})
export default class  Scrollbar extends Vue{
  static componentName = "YnScrollbar";
  sizeWidth = '0';
  sizeHeight = '0';
  moveX = 0;
  moveY = 0;
  domRect!: DOMRect;

  @Prop({
    type: Boolean
  })
  native!: boolean;
  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  wrapStyle!: AnyObject | string;
  @Prop({
    type: [Object, String],
    default() {
      return {};
    }
  })
  wrapClass!: AnyObject | string;
  @Prop({
    type: [Object, String],
    default() {
      return {};
    }
  })
  viewClass!: AnyObject | string;
  @Prop({
    type: [Object, String],
    default() {
      return {};
    }
  })
  viewStyle!: AnyObject | string;
  @Prop({
    type: Boolean
  })
  noresize!: boolean; // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  @Prop({
    type: String,
    default: "div"
  })
  tag!: string;

  get wrap() {
    return this.$refs.wrap;
  }

  render(h: CreateElement) {
    const gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['yn-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    const wrap = h(
      "div",
      {
        ref: "wrap",
        style: style,
        "class": [this.wrapClass, 'yn-scrollbar__wrap', gutter ? '' : 'yn-scrollbar__wrap--hidden-default'],
        on: {
          scroll: this.handleScroll
        }
      },
      [view]
    );
    let nodes;

    if (!this.native) {
      nodes = [
        wrap,
        h(
          Bar,
          {
            props: {
              move: this.moveX,
              size: this.sizeWidth
            }
          }
        ),
        h(
          Bar,
          {
            props: {
              vertical: true,
              move: this.moveY,
              size: this.sizeHeight
            } 
          }
        )
      ];
    } else {
      nodes = [h(
        "div",
        {
          ref: "wrap",
          style: style,
          "class": [this.wrapClass, 'yn-scrollbar__wrap']
        },
        [view]
      )];
    }
    return h('div', { class: 'yn-scrollbar' }, nodes);
  }

  handleScroll() {
    const wrap = this.wrap as HTMLDivElement;

    this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
    this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
  }

  update() {
    const wrap = this.wrap as HTMLDivElement;
    if (!wrap) return;
    const heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
    const widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);
    this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
    this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
  }
  checkThenUpdate() {
    // 当 $refs.resize 尺寸变化时 调用 update 方法
    type keyType = "x" | "y" | "width" | "height";
    const keys: keyType[] = ["x", "y", "width", "height"];
    const resizeEle = this.$refs.resize as HTMLElement;
    const rect = resizeEle.getBoundingClientRect();
    if (this.domRect && keys.some((key: keyType) => rect[key] !== this.domRect[key])) {
      this.$nextTick(this.update);
    }
    this.domRect = rect;
  }
  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
  }
  updated() {
    !this.noresize && this.checkThenUpdate();
  }
}
