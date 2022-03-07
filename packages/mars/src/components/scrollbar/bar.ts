import { on, off } from '@/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';
import Vue, { CreateElement } from "vue";
import { Component, Prop } from 'vue-property-decorator';
import Scrollbar from "./scrollbar";
type barScroll = "scrollTop" | "scrollLeft";
type barScrollSize = "scrollHeight" | "scrollWidth";
type barClient = "clientX" | "clientY";
type barDirection = "top" | "left";
type barOffset = "offsetHeight" | "offsetWidth";
type barAxis = "Y" | "X";

@Component({
  name: "YnBar"
})
export default class Bar extends Vue {
  componentName = 'YnBar';
  X!: number;
  Y!: number;
  cursorDown = false;

  @Prop({
    type: Boolean
  })
  vertical!: boolean;
  @Prop({
    type: String
  })
  size!: string;
  @Prop({
    type: Number
  })
  move!: number;

  get bar() {
    return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
  }
  get wrap() {
    return (this.$parent as Scrollbar).wrap as HTMLDivElement;
  }

  clickThumbHandler(e: MouseEvent) {
    // prevent click event of right button
    if (e.ctrlKey || e.button === 2) {
      return;
    }
    this.startDrag(e);
    this[this.bar.axis as barAxis] = ((e.currentTarget as HTMLElement)[this.bar.offset as barOffset] - (e[this.bar.client as barClient] - (e.currentTarget as HTMLElement).getBoundingClientRect()[this.bar.direction as barDirection]));
  }
  clickTrackHandler(e: MouseEvent) {
    const barDirection: barDirection =  this.bar.direction as barDirection;
    const barClient: barClient = this.bar.client as barClient;
    const offset = Math.abs((e.target as HTMLElement).getBoundingClientRect()[barDirection] - e[barClient]);
    const thumbHalf = ((this.$refs.thumb as HTMLElement)[this.bar.offset as barOffset] / 2);
    const thumbPositionPercentage = ((offset - thumbHalf) * 100 / (this.$el as HTMLElement)[this.bar.offset as barOffset]);
    const barScroll: barScroll = this.bar.scroll as barScroll;
    const barScrollSize: barScrollSize = this.bar.scrollSize as barScrollSize;
    this.wrap[barScroll] = (thumbPositionPercentage * this.wrap[barScrollSize as barScrollSize] / 100);
  }
  startDrag(e: MouseEvent) {
    e.stopImmediatePropagation();
    this.cursorDown = true;

    on(document, 'mousemove', this.mouseMoveDocumentHandler);
    on(document, 'mouseup', this.mouseUpDocumentHandler);
    document.onselectstart = () => false;
  }
  mouseMoveDocumentHandler(e: Event) {
    if (this.cursorDown === false) return;
    const prevPage = this[this.bar.axis as barAxis];

    if (!prevPage) return;

    const offset = (((this.$el as HTMLElement).getBoundingClientRect()[this.bar.direction as barDirection] - (e as MouseEvent)[this.bar.client as barClient]) * -1);
    const thumbClickPosition = ((this.$refs.thumb as HTMLElement)[this.bar.offset as barOffset] - prevPage);
    const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / (this.$el as HTMLElement)[this.bar.offset as barOffset]);

    this.wrap[this.bar.scroll as barScroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize as barScrollSize] / 100);
  }
  mouseUpDocumentHandler() {
    this.cursorDown = false;
    this[this.bar.axis as barAxis] = 0;
    off(document, 'mousemove', this.mouseMoveDocumentHandler);
    document.onselectstart = null;
  }

  render(h: CreateElement) {
    const { size, move, bar } = this;

    return h(
      "div", 
      {
        "class": ['yn-scrollbar__bar', 'is-' + bar.key],
        on: {
          mousedown: this.clickTrackHandler
        }
      },
      [
        h(
          "div",
          {
            ref: "thumb",
            "class": "yn-scrollbar__thumb",
            style: renderThumbStyle({ size, move, bar }),
            on: {
              mousedown: this.clickThumbHandler
            }
          }
        )
      ]
    );
  }
  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
}
