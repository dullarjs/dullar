/*
* @Author: Just be free
* @Date:   2020-08-25 11:35:55
* @Last Modified by:   Just be free
* @Last Modified time: 2020-08-25 18:21:45
* @E-mail: justbefree@126.com
*/

type IndicatorText = string;
type IndicatorSpinType = "doubleBounce" | "fadingCircle" | "rotate" | "snake" | "rotateSvg" | "tripleBounce";
type IndicatorSpinColor = string;
type IndicatorBackground = string;
type IndicatorSize = number | string;
type IndicatorLockScreen = boolean;
type IndicatorTransparent = boolean;
export type IndicatorOptions = {
  lockScreen?: IndicatorLockScreen;
  transparent?: IndicatorTransparent;
  text?: IndicatorText;
  spinType?: IndicatorSpinType;
  background?: IndicatorBackground;
  size?: IndicatorSize;
  spinColor?: IndicatorSpinColor;
}
export interface Indicator {
  open(options: IndicatorOptions): void;
  close(): void;
}

export const Indicator: Indicator;
