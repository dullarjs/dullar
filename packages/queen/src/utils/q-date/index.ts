/*
* @Author: Just be free
* @Date:   2020-10-19 10:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:10:16
* @E-mail: justbefree@126.com
*/
import QDateInstance, { QDate } from "./QDate";
const validateFormatedDate = (date: string) => {
  const reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
  return date && date.match(reg);
};

export { QDate, validateFormatedDate, QDateInstance };
