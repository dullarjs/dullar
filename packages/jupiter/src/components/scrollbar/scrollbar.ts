
import scrollbarWidth from '@/utils/scrollbar-width';
import { toObject } from '@/utils';
import Bar from './bar';
import { h, Slot } from 'vue';
import { Vue, Options, prop, mixins } from 'vue-class-component';
import { AnyObject } from '@/types';
import "./style/index.scss";
class Props {
  native!: boolean
  wrapStyle = prop<AnyObject | string>({ default: () => { return {}; } })
  wrapClass = prop<AnyObject | string>({ default: () => { return {}; } })
  viewClass = prop<AnyObject | string>({ default: () => { return {}; } })
  viewStyle = prop<AnyObject | string>({ default: () => { return {}; } })
  noresize = prop<boolean>({ default: false })
  tag = prop<string>({ default: "div" })
}
@Options({
  name: "YnScrollbar",
  components: {
    Bar
  }
})
export default class  Scrollbar extends mixins(Vue).with(Props){
  static componentName = "YnScrollbar";
  sizeWidth = '0';
  sizeHeight = '0';
  moveX = 0;
  moveY = 0;
  domRect!: DOMRect;

  get wrap() {
    return this.$refs.wrap;
  }

  render() {
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
    }, (this.$slots.default as Slot)());
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
            vertical: false,
            move: this.moveX,
            size: this.sizeWidth
          },
          []
        ),
        h(
          Bar,
          {
            vertical: true,
            move: this.moveY,
            size: this.sizeHeight
          },
          []
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
    // ??? $refs.resize ??????????????? ?????? update ??????
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
