<template>
    <div class="date-picker">
        <div class="input" type="text" @click="togglePanel" v-text="value"></div>
        <div class="date-panel" v-show="panelState" :style="coordinates" transition="toggle">
            <div class="panel-header" v-show="panelType !== 'year'">
                <div class="arrow-left" @click="prevMonthPreview()">&lt;</div>
                <div class="year-month-box">
                    <div class="year-box" @click="chType('year')" v-text="tmpYear"></div>
                    <div class="month-box" @click="chType('month')" v-text="tmpMonth + 1 | month language"></div>
                </div>
                <div class="arrow-right" @click="nextMonthPreview()">&gt;</div>
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
                        :class="{selected: item === tmpYear, invalid: validateYear(item)}" 
                        @click="selectYear(item)"
                    >
                    </li>
                </ul>
            </div>
            <div class="type-month" v-show="panelType === 'month'">
                <ul class="month-list">
                    <li v-for="item in monthList"
                        v-text="item | month language"
                        :class="{selected: $index === tmpMonth, invalid: validateMonth($index)}" 
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
                        :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
                            selected: date === item.value && month === tmpMonth && item.currentMonth, invalid: validateDate(item)}"
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
                tmpYear: now.getFullYear(),
                tmpMonth: now.getMonth(),
                yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index),
                monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12],
                weekList: [0, 1, 2, 3, 4, 5, 6]
            }
        },
        props: {
            language: {default: 'en'},
            min: {default: '1970-01-01'},
            max: {default: '3016-01-01'},
            minYear: Number,
            minMonth: Number,
            minDate: Number,
            maxYear: Number,
            maxMonth: Number,
            maxDate: Number,
            value: String
        },
        filters: {
            week (item, lang) {
                switch (lang) {
                    case 'en':
                        return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
                    case 'ch':
                        return {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'}[item]
                    default:
                        return item
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
                let currentMonthLength = new Date(this.tmpMonth, this.tmpMonth + 1, 0).getDate()
                let dateList = Array.from({length: currentMonthLength}, (val, index) => {
                    return {
                        currentMonth: true,
                        value: index + 1
                    }
                })
                let startDay = new Date(this.year, this.tmpMonth, 1).getDay()
                let previousMongthLength = new Date(this.year, this.tmpMonth, 0).getDate()

                for(let i = 0, len = startDay; i < len; i++){
                    dateList = [{previousMonth: true, value: previousMongthLength - i}].concat(dateList)
                }
                for(let i = dateList.length, len = 42, item = 1; i < len; i++, item++){
                    dateList[dateList.length] = {nextMonth: true, value: item}
                }

                return dateList
            }
        },
        methods: {
            togglePanel () {
                this.panelState = !this.panelState
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
            prevMonthPreview () {
                this.tmpMonth = this.tmpMonth === 0 ? 0 : this.tmpMonth - 1
            },
            nextMonthPreview () {
                this.tmpMonth = this.tmpMonth === 11 ? 11 : this.tmpMonth + 1
            },
            selectYear (year) {
                if(this.validateYear(year)){
                    return
                }else{
                    this.tmpYear = year
                    this.panelType = 'month'
                }
            },
            selectMonth (month) {
                if(this.validateMonth(month)){
                    return
                }else{
                    this.tmpMonth = month
                    this.panelType = 'date'
                }
            },
            selectDate (date) {
                if(this.validateDate(date))
                    return
                if(date.previousMonth){
                    this.month = this.tmpMonth - 1
                    this.tmpMonth -= 1
                }else if(date.nextMonth){
                    this.month = this.tmpMonth + 1
                    this.tmpMonth += 1
                }
                this.month = this.tmpMonth
                this.date = date.value
                this.value = `${this.tmpYear}-${('0' + (this.month + 1)).slice(-2)}-${('0' + this.date).slice(-2)}`
                this.panelState = false
            },
            validateYear (year) {
                return (year > this.maxYear || year < this.minYear) ? true : false
            },
            validateMonth (month) {
                if(new Date(this.tmpYear, month).getTime() >= new Date(this.minYear, this.minMonth - 1).getTime()
                    && new Date(this.tmpYear, month).getTime() <= new Date(this.maxYear, this.maxMonth - 1).getTime()){
                    return false
                }
                return true
            },
            validateDate (date) {
                let mon = this.tmpMonth
                if(date.previousMonth){
                    mon -= 1
                }else if(date.nextMonth){
                    mon += 1
                }
                if(new Date(this.tmpYear, mon, date.value).getTime() >= new Date(this.minYear, this.minMonth - 1, this.minDate).getTime()
                    && new Date(this.tmpYear, mon, date.value).getTime() <= new Date(this.maxYear, this.maxMonth - 1, this.maxDate).getTime()){
                    return false
                }
                return true
            }
        },
        ready () {
            if(this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300){
                this.coordinates = {right: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
            }else{
                this.coordinates = {left: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
            }
            let minArr = this.min.split('-')
            this.minYear = Number(minArr[0])
            this.minMonth = Number(minArr[1])
            this.minDate = Number(minArr[2])

            let maxArr = this.max.split('-')
            this.maxYear = Number(maxArr[0])
            this.maxMonth = Number(maxArr[1])
            this.maxDate = Number(maxArr[2])
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
        border-radius: 2px;
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
        width: 100%;
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
    .type-year, .type-month{
        background-color: #fff;
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
    .year-list, .month-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            transition: all ease .1s;
            cursor: pointer;
            text-align: center;
            font-size: 20px;
            width: 33%;
            padding: 10px 0;
            &:not(.invalid) {
                &:hover{
                    background-color: #eee;
                }
            }
            &.selected{
                background-color: #e04831;
                color: #fff;
                &:hover{
                    background-color: #f79bab;
                }
            }
            &.invalid{
                cursor: not-allowed;
                color: #ccc;
            }
        }
    }
    .date-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        .valid:hover{
            background-color: #eee;
        }
        li{
            transition: all ease .1s;
            cursor: pointer;
            &:not(.invalid){
                &:hover{
                    background-color: #eee;
                }
            }
            &.selected{
                background-color: #e04831;
                color: #fff;
                &:hover{
                    background-color: #f79bab;
                }
            }
            &.invalid{
                cursor: not-allowed;
                color: #ccc;
            }
        }
        
    }
    .weeks{
        background-color: #eee;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            font-weight: 600;
        }
    }
    .weeks, .date-list{
        width: 100%;
        text-align: center;
        list-style: none;
        .preMonth, .nextMonth{
            color: #ccc;
        }
        li{
            font-family: Roboto;
            width: 14%;
            height: 30px;
            text-align: center;
            line-height: 30px;

        }
    }
    .toggle{
        &-transition{
            transition: all ease .2s;
        }
        &-enter, &-leave{
            opacity: 0;
        }
    }
</style>
