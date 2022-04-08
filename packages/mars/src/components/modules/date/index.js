/*
 * @Author: Just be free
 * @Date:   2020-01-20 09:14:03
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-30 12:25:22
 */
import YnDate from "./YnDateClass.js";
const validateFormatedDate = (date) => {
  const reg =
    /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
  return date && date.match(reg);
};

export { YnDate, validateFormatedDate };
