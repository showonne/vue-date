<template>
  <div class="main">
    <div class="header">
      <!-- 向左翻页 -->
      <div class="btn-block left">
        <span class="dateBtn" @click="reduceYear()"><<</span>
        <span class="dateBtn" @click="reduceMonth()"><</span>
      </div>
      <!-- 向右翻页 -->
      <div class="btn-block right">
        <span class="dateBtn" @click="addMonth()">></span>
        <span class="dateBtn" @click="addYear()">>></span>
      </div>
      <div class="date-block">
        <span>
          <b class="year">{{year}}</b> 年</span>
        <span>
          <b class="month">{{month}}</b> 月</span>
      </div>
    </div>
    <div class="dateContent">
      <div class="weekContent">
        <span v-for="(item,index) of week" :key="index">{{item}}</span>
      </div>
      <div class="date-list">
        <span v-for="(item,index) of previousMonth" class="lastMonth">{{item}}</span>
        <span v-for="(item,index) of monthDay[month - 1]" :class="[{nowData:nowData==index },{active:currIndex===index}]" @click="selectDay($event,index)" class="nowMonth">{{item}}</span>
        <span v-for="(item,index) of nextMonth" class="nextMonth">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script type="es6">
export default {
  data() {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: 0,
      // 上月剩余
      previousMonth: [],
      monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      // 下月剩余
      nextMonth: [],
      // 当前被点击索引
      currIndex: '',
      nowData: new Date().getDate() - 1,
    }
  },
  created() {
    this.dayScreen();
  },
  watch: {
    year(val) {
      let reg = /^[1-9]\d*$/g;
      if (!reg.test(val)) {
        let date = new Date();
        this.year = date.getFullYear();
      }
      if (val < 0) {
        this.year = 1;
      }
      if (val > 10000) {
        this.year = 10000;
      }
      this.dayScreen();
    },
    month(val) {
      let reg = /^[1-9]\d*$/g;
      if (!reg.test(val)) {
        let date = new Date();
        this.month = date.getMonth() + 1;
      }
      if (val < 1) {
        this.month = 1;
      }
      if (val > 12) {
        this.month = 12;
      }
      this.dayScreen();
    }
  },
  methods: {
    // 显示选中的日期
    isActive(index) {
      this.currIndex = index;
    },
    // 获取当前日期
    selectDay(e, index) {
      this.isActive(index);
      let currDate = new Date(this.year, this.month - 1, e.target.innerText),
        currNodeDate = this.formatDate(currDate)
      this.$emit("node-click", currNodeDate);
    },
    reduceYear() {
      this.year--
    },
    reduceMonth() {
      this.month--
    },
    addMonth() {
      this.month++
    },
    addYear() {
      this.year++
    },
    // 判断是否是当前月
    if_nowData() {
      if (this.year == new Date().getFullYear() && this.month == new Date().getMonth() + 1) {
        this.nowData = new Date().getDate() - 1
      } else {
        this.nowData = null
      }
    },
    // 判断是否是闰年
    if_leapYear() {
      if (((this.year % 4) == 0) && ((this.year % 100) != 0) || ((this.year % 400) == 0)) {
        this.monthDay[1] = 29
      } else {
        this.monthDay[1] = 28
      }
    },
    // 日期显示
    dayScreen() {
      this.if_nowData();
      this.if_leapYear();
      // 上一个月
      let firstDate = new Date(this.year, this.month - 1, 1),
        // 获取上个月的第一天是周几
        firstWeek = firstDate.getDay(),
        preMonthDay = null;

      // 如果当前是1月
      if (this.month == 1) {
        // 则上月天数为12月的
        preMonthDay = this.monthDay[11];
      } else {
        // 否则就是上个月的
        preMonthDay = this.monthDay[this.month - 1];
      }
      // 遍历上个月的天数
      for (let i = 0; i < preMonthDay; i++) {
        this.previousMonth[i] = i + 1;
      }
      // 取出最后几个天数
      if (firstWeek == 0) {
        this.previousMonth = this.previousMonth.slice(-7);
      } else {
        this.previousMonth = this.previousMonth.slice(-firstWeek);
      }
      // 下一个月
      let endDate = new Date(this.year, this.month + 1, this.monthDay[this.month + 1]);
      let endWeek = endDate.getDay();
      let nextMonthDay = null;
      if (this.month == 12) {
        nextMonthDay = this.monthDay[0];
      } else {
        nextMonthDay = this.monthDay[this.month];
      }
      for (let i = 0; i < nextMonthDay; i++) {
        this.nextMonth[i] = i + 1;
      }
      if (endWeek == 6) {
        this.nextMonth = this.nextMonth.slice(0, 7);
      } else {
        this.nextMonth = this.nextMonth.slice(0, 6 - endWeek);
      }
    },
    //格式化日期：yyyy-MM-dd
    formatDate(date) {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      if (mymonth < 10) {
        mymonth = `0${mymonth}`;
      }
      if (myweekday < 10) {
        myweekday = `0${myweekday}`;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
    },
  },
  computed: {
  }
}
</script>

<style scoped>
.main {
  background: rgba(0, 0, 0, 0.4);
  /* border-color: rgba(0, 0, 0, 0.2); */
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  width: 260px;
  padding: 2px;
  line-height: 18px;
  user-select: none;
}

.main .header {
  position: relative;
  border: 0;
  font-weight: 700;
  width: 100%;
  padding: 4px 0;
  color: #676767;
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);
}

.main .header .btn-block {
  display: inline-block;
  width: auto;
  /* user-select: none; */
}

.main .header .btn-block .dateBtn {
  color: #b57878;
  text-decoration: none;
  vertical-align: top;
  cursor: pointer;
  text-align: center;
  margin-top: 2px;
  padding: 6px 10px;
  width: 14px;
  height: 14px;
}

.main .header .btn-block .dateBtn:hover {
  color: #FF9600 !important;
}

.main .header .date-block {
  text-align: center;
  padding: 0;
}

.main .header .date-block span {
  font-size: 16px;
  vertical-align: top;
}




























/* 上面时间栏的样式 */


/* .main .header .date-block span b:hover {
  cursor: pointer;
  color: #fff !important;
  background-color: rgba(255, 255, 225, 0.15);
} */

.main .dateContent {
  width: 100%;
}

.main .dateContent .weekContent {
  width: 100%;
}

.main .dateContent .date-list {
  font-size: 0;
}


.main .dateContent .date-list .nowMonth.nowData {
  position: relative;
}

.main .dateContent .date-list .nowMonth.nowData::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2d8cf0;
  position: absolute;
  top: 4px;
  right: 4px;
}


.main .dateContent .date-list .nowMonth.active,
.main .dateContent .date-list .nowMonth:hover {
  background-color: #2d8cf0;
  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.main .dateContent .date-list .lastMonth,
.main .dateContent .date-list .nextMonth {
  color: #80a9af;
}

.main .dateContent span {
  display: inline-block;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  font-size: 14px;
}

.left {
  float: left;
}

.right {
  float: right;
}
</style>
