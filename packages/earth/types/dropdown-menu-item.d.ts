/*
* @Author: Just be free
* @Date:   2020-12-17 16:41:13
* @Last Modified by:   Just be free
* @Last Modified time: 2021-12-31 18:04:54
* @E-mail: justbefree@126.com
*/

import { YnComponents } from "./component";
export interface ToggleOptions {
  disableEmit: boolean;
}
export class YnDropdownMenuItem extends YnComponents {
  closeTab(): void;
  toggle(args: ToggleOptions): void;
  check(status: boolean, options?: ToggleOptions): void;
  checkMapOption(index: number, options?: ToggleOptions): void;
  setIsFiltered(status: boolean): void;
}
