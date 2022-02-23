/*
 * @Author: Just be free
 * @Date:   2020-02-12 21:06:48
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-02-17 14:50:45
 */

export const error = (message) => {
  throw new Error(message);
};
export const warn = (...args) => {
  console.warn(...args);
};
