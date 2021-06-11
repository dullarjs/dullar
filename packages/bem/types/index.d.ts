/*
* @Author: Just be free
* @Date:   2021-06-11 14:25:02
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 14:25:03
* @E-mail: justbefree@126.com
*/
export interface ConfigOptions {
  blockPrefix?: string;
  modifierSeparator?: string;
  elementSeparator?: string;
}

interface StringObject {
  [propName: string]: string;
}
export type BemParserContext =
  | {
      [propName: string]: StringObject;
    }
  | string;
