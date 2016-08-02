<template>
    <div class="date-picker">
        <div class="input" type="text" @click="togglePanel" v-text="value"></div>
        <div class="date-panel" v-show="panelState" :style="coordinates" :style="positionX">
            <div class="panel-header" v-show="panelType !== 'year'">
                <div class="arrow-left" @click="month = month > 0 ? month - 1 : month">&lt;</div>
                <div class="year-month-box">
                    <div class="year-box" @click="chType('year')" v-text="year"></div>
                    <div class="month-box" @click="chType('month')" v-text="month + 1 | month language"></div>
                </div>
                <div class="arrow-right" @click="month = month < 11 ? month + 1 : month">&gt;</div>
            </div>
            <div class="panel-header" v-show="panelType === 'year'">
                <div class="arrow-left" @click="chYearRange(0)">&lt;</div>
                <div class="year-range">
                    <span v-text="yearList[0]"></span> - <span v-text="yearList[yearList.length - 1]"></span>
                </div>
                <div class="arrow-right" @click="chYearRange(1)">&gt;</div>
            </div>
            <div class="type-year" v-show="panelType === 'year'">
                <ul class="year-list">
                    <li v-for="item in yearList"
                        v-text="item"
                        :class="{selected: item === year, invalid: validateYear(item)}" 
                        @click="selectYear(item)"
                    >
                    </li>
                </ul>
            </div>
            <div class="type-month" v-show="panelType === 'month'">
                <ul class="month-list">
                    <li v-for="item in monthList"
                        v-text="item | month language"
                        :class="{selected: $index === month, invalid: validateMonth($index)}" 
                        @click="selectMonth($index)"
                    >
                    </li>
                </ul>
            </div>
            <div class="type-date" v-show="panelType === 'date'">
                <ul class="weeks">
                    <li v-for="item in weekList" v-text="item | week language"></li>
                </ul>
                <ul class="date-list">
                    <li v-for="item in dateList"
                        v-text="item.value" 
                        track-by="$index" 
                        :class="{preMonth: item.previousMonth,nextMonth: item.nextMonth, selected: date === item.value && item.currentMonth, invalid: validateDate(item)}"
                        @click="selectDate(item)">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            let now = new Date()
            return {
                panelState: false,
                panelType: 'date',
                coordinates: {},
                year: now.getFullYear(),
                month: now.getMonth(),
                date: now.getDate(),
                yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index),
                monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12],
                weekList: [0, 1, 2, 3, 4, 5, 6]
            }
        },
        props: {
            language: {
                type: String,
                default: 'en'
            },
            value: {default: null},
            min: {default: '1970-01-01'},
            minYear: {default: ''},
            minMonth: {default: ''},
            minDate: {default: ''},
            max: {default: '3016-01-01'},
            maxYear: {default: ''},
            maxMonth: {default: ''},
            maxDate: {default: ''},
            invalidYear: {default: false},
            invalidMonth: {default: false},
            invalidDate: {default: false}
        },
        filters: {
            week (item, lang) {

                switch (lang) {
                    case 'en':
                        return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
                    case 'ch':
                        return {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'}[item]
                    default:
                    return
                }
            },
            month (item, lang) {

                switch (lang) {
                    case 'en':
                        return {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                         7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}[item]
                    case 'ch':
                        return {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',
                         7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二'}[item]
                    default:
                        return item
                }
            }
        },
        computed: {
            dateList () {
                let currentMonthLength = new Date(this.year, this.month + 1, 0).getDate()

                let dateList = Array.from(new Array(currentMonthLength), (val, index) => {
                    return {
                        currentMonth: true,
                        value: index + 1
                    }
                })

                let startDay = new Date(this.year, this.month, 1).getDay()

                let previousMongthLength = new Date(this.year, this.month, 0).getDate()

                for(let i = 0, len = startDay; i < len; i++){
                    dateList.unshift({previousMonth: true, value: previousMongthLength - i})
                }

                for(let i = dateList.length, len = 42, item = 1; i < len; i++, item++){
                    dateList.push({nextMonth: true, value: item})
                }

                return dateList

            },
            value: {
                get () {
                    return `${this.year}-${this.month + 1}-${this.date}`
                }
            }
        },
        methods: {
            togglePanel () {
                this.panelState = !this.panelState
            },
            selectDate (date) {
                if(date.previousMonth){
                    this.month -= 1
                }else if(date.nextMonth){
                    this.month += 1
                }
                this.date = date.value
                this.panelState = false
            },
            selectMonth (month) {
                this.month = month
                this.panelType = 'date'
            },
            selectYear (year) {
                this.year = year
                this.panelType = 'month'
            },
            chType (type) {
                this.panelType = type
            },
            chYearRange (next) {
                if(next){
                    this.yearList = this.yearList.map((i) => i + 12)
                }else{
                    this.yearList = this.yearList.map((i) => i - 12)
                }
            },
            validateYear(year){
                return (year > this.maxYear || year < this.minYear) ? true : false
            },
            validateMonth(month){
                if(this.validateYear(this.year)){
                    return true
                }else if(this.year === this.maxYear){
                    return month > this.maxMonth - 1 ? true : false
                }else if(this.year === this.minYear){
                    return month < this.minMonth - 1 ? true : false
                }
            },
            validateDate(date) {
                //validate date logic
                if(this.validateMonth(this.month)){
                    return true
                }else if(this.month === this.minMonth -1){
                    return date.value < this.minDate ? true : false
                }else if(this.month === this.maxMonth -1){
                    return date.value > this.maxDate ? true : false
                }else{
                    return false
                }
            }
        },
        ready() {
            if(this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300){
                this.coordinates = {right: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
            }else{
                this.coordinates = {left: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
            }

            let minArr = this.min.split('-')
            this.minYear = Number(minArr[0])
            this.minMonth = Number(minArr[1])
            this.minDate = Number(minArr[2])
            console.info('min: ', this.minYear, this.minMonth, this.minDate)

            let maxArr = this.max.split('-')
            this.maxYear = Number(maxArr[0])
            this.maxMonth = Number(maxArr[1])
            this.maxDate = Number(maxArr[2])
            console.info('max: ', this.maxYear, this.maxMonth, this.maxDate)
        }
    }
</script>

<style scoped lang='less'>
    .date-picker{
        position: relative;
    }
    .input{
        width: 100%;
        height: 100%;
        font-size: inherit;
        line-height: 2;
        padding-left: 4px;
        box-sizing: border-box;
        outline: none;
        border: 1px solid #ccc;
    }
    .date-panel{
        position: absolute;
        border: 1px solid #eee;
        box-sizing: border-box;
        width: 300px;
    }
    .panel-header{
        display: flex;
        flex-flow: row nowrap;
        background-color: #8099fc;
        min-width: 300px;
    }
    .arrow-left, .arrow-right{
        flex: 1;
        font-size: 20px;
        line-height: 2;
        color: #fff;
        text-align: center;
        cursor: pointer;
        &:hover{
            background-color: #3f51b5;
        }
    }
    .type-year, .type-month, .type-date{
        width: 100%;
    }
    .year-range{
        color: #fff;
        font-size: 20px;
        line-height: 2;
        flex: 3;
        display: flex;
        justify-content: center;
    }
    .year-month-box{
        flex: 3;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
    }
    .year-box, .month-box{
        transition: all ease .1s;
        color: #fff;
        flex: 1;
        text-align: center;
        font-size: 20px;
        line-height: 2;
        cursor: pointer;
        &:hover{
            background-color: #3f51b5;
        }
    }
    .weeks, .date-list{
        background-color: #fff;
        justify-content: space-between;
        text-align: center;
        width: 300px;
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        li{
            width: 14%;
            height: 30px;
            text-align: center;
            line-height: 30px;
            
        }
    }
    .weeks{
        background-color: #eee;
        li{
            font-weight: 800;
        }
    }
    .date-list{
        li{
            transition: all ease .1s;
            cursor: pointer;
            &.preMonth, &.nextMonth{
                color: #ccc;
            }
            &:hover{
                background-color: #eee;
            }
            &.selected{
                background-color: #e04831;
                color: #fff;
            }
            &.invalid{
                cursor: not-allowed;
            }
        }
    }
    .month-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            transition: all ease .1s;
            text-align: center;
            font-size: 20px;
            width: 33%;
            padding: 10px 0;
            cursor: pointer;
            &:hover{
                background-color: #eee;
            }
            &.selected{
                background-color: #e04831;
                color: #fff;
            }
            &.invalid{
                cursor: not-allowed;
            }
        }
    }
    .year-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            transition: all ease .1s;
            text-align: center;
            font-size: 20px;
            width: 33%;
            padding: 10px 0;
            cursor: pointer;
            &:hover{
                background-color: #eee;
            }
            &.selected{
                background-color: #e04831;
                color: #fff;
            }
            &.invalid{
                cursor: not-allowed;
            }
        }
    }
</style>
