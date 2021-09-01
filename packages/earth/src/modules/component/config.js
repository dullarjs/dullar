/*
 * @Author: Just be free
 * @Date:   2020-05-19 18:02:06
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-19 18:03:25
 * @E-mail: justbefree@126.com
 */

export const getConfig = (props) => {
  return process.env[props] || "";
};
