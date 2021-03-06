/*
 * @Author: Just be free
 * @Date:   2020-02-19 21:12:21
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-07-24 15:01:20
 * @E-mail: justbefree@126.com
 */
import { error } from "../error";
const now = new Date();
class YnDate {
  constructor (...args) {
    const [
      year = now.getFullYear(),
      month = now.getMonth() + 1,
      date = now.getDate(),
    ] = args;
    if (year instanceof YnDate) {
      return year;
    } else if (this.isDateFormat(year)) {
      return this.Init(...year.split("-"));
    } else {
      this.JSDate = new Date(Date.parse(`${year}/${month}/${date}`));
      this.year = year;
      this.setMonth(month);
      this.setDate(date);
      return this;
    }
  }
  setMonth (month) {
    this.month = parseInt(month) < 10 ? `0${month}` : month;
  }
  setDate (date) {
    this.date = parseInt(date) < 10 ? `0${date}` : date;
  }
  add (count = 1, unit = "days") {
    if (["days", "day", "d"].indexOf(unit) > -1) {
      this.JSDate.setDate(this.JSDate.getDate() + count);
    } else if (["months", "month", "m"].indexOf(unit) > -1) {
      // 解决思路：在某一个日期加一个月或N个月的时候需要判断当前日期是当月的第X天，
      // 需要确保在加了一个月或N个月的那月也有同样的X天，如果没有，则取那月的最后一天
      const otherMonthDaysCount = YnDate(
        this.year,
        this.JSDate.getMonth() + 1 + count,
        "01"
      ).getDaysCountOfMonth();
      const currentDay = this.JSDate.getDate();
      if (currentDay > otherMonthDaysCount) {
        this.JSDate.setDate(otherMonthDaysCount);
        this.JSDate.setMonth(this.JSDate.getMonth() + count);
      } else {
        this.JSDate.setMonth(this.JSDate.getMonth() + count);
      }
      // if (this.JSDate.getMonth() + count === 1) {
      //   // JS处理日期有bug，假如说某年2月份只有28天，而一月份在28天以后的日期加一个月会自动跳过二月份，直接生成三月。操蛋
      //   const days = YnDate(
      //     this.year,
      //     this.JSDate.getMonth() + 1 + count,
      //     "01"
      //   ).getDaysCountOfMonth();
      //   if (this.JSDate.getDate() > days) {
      //     this.JSDate.setDate(days);
      //     this.JSDate.setMonth(this.JSDate.getMonth() + count);
      //   } else {
      //     this.JSDate.setMonth(this.JSDate.getMonth() + count);
      //   }
      // } else {
      //   this.JSDate.setMonth(this.JSDate.getMonth() + count);
      // }
    } else if (["years", "year", "y"].indexOf(unit) > -1) {
      this.JSDate.setFullYear(this.JSDate.getFullYear() + count);
    }
    this.year = this.JSDate.getFullYear();
    this.setMonth(this.JSDate.getMonth() + 1);
    this.setDate(this.JSDate.getDate());
    return this;
  }
  substract (count = 1, unit = "days") {
    return this.add(-1 * count, unit);
  }
  getMonthPeriod (begin, end) {
    const period = [begin.format()];
    if (begin instanceof YnDate && end instanceof YnDate) {
      while (begin.isBefore(end)) {
        begin.add(1, "month");
        period.push(begin.format());
      }
    }
    return period;
  }
  getToday () {
    // 获取指定时间（默认当天）
    return this.JSDate;
  }
  format () {
    return `${this.year}-${this.month}-${this.date}`;
  }
  getDay () {
    // 获取具体每一天是周几
    return new Date(
      Date.parse(`${this.year}/${this.month}/${this.date}`)
    ).getDay();
  }
  getTime () {
    // 获取指定时间毫秒数
    return new Date(
      Date.parse(`${this.year}/${this.month}/${this.date}`)
    ).getTime();
  }
  getDaysCountOfMonth () {
    // 获取指定年月总归有多少天
    return new Date(this.year, parseInt(this.month, 10), 0).getDate();
  }
  diff (...args) {
    const [year, month, date] = args;
    if (args.length >= 2) {
      // console.log(year, month, date);
      // 两个时间差，默认是传入时间和当前时间差
      return (
        (YnDate(year, month, date).getTime() - this.getTime()) /
        1000 /
        60 /
        60 /
        24
      );
    } else {
      if (year instanceof YnDate) {
        return (year.getTime() - this.getTime()) / 1000 / 60 / 60 / 24;
      } else if (this.isDateFormat(year)) {
        return this.diff(...year.split("-"));
      } else {
        error(`${year} is not a instance of YnDate`);
      }
    }
  }
  isDateFormat (arg) {
    return /^(\d{4})(-)(\d{2})(-)(\d{2})$/.test(String(arg));
  }
  isBefore (...args) {
    // 是不是早于某个（默认当天）时间
    return this.diff(...args) > 0;
  }
  isAfter (...args) {
    // 是不是晚于某个（默认当天）时间
    return this.diff(...args) < 0;
  }
  isSame (...args) {
    // 是不是和某个时间相同（默认当天）
    return this.diff(...args) === 0;
  }
  isBetweenIncludeLeft (start, end) {
    return this.isBetween(start, end) || this.isSame(start);
  }
  isBetweenIncludeRight (start, end) {
    return this.isBetween(start, end) || this.isSame(end);
  }
  isBetweenIncludeBoth (start, end) {
    return this.isBetween(start, end) || this.isSame(start) || this.isSame(end);
  }
  isBetween (start, end) {
    return this.isAfter(start) && this.isBefore(end);
  }
}
export default (...args) => new YnDate(...args);
