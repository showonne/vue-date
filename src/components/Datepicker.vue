<template>
    <div class="date-picker">
        <input class="input" type="text" @click="togglePanel" v-model="value">
        <div class="date-panel" v-show="panelState" style="{top: panelMargin}">
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
                        :class="{selected: item === year}" 
                        @click="selectYear(item)"
                    >
                    </li>
                </ul>
            </div>
            <div class="type-month" v-show="panelType === 'month'">
                <ul class="month-list">
                    <li v-for="item in monthList" 
                        v-text="item | month language"
                        :class="{selected: $index === month}" 
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
                        track-by="$index" 
                        :class="{preMonth: item.previousMonth,nextMonth: item.nextMonth, selected: currentDate === item.value && item.currentMonth}"
                        @click="selectDate(item)">
                        {{item.value}}
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
                now: now,
                panelType: 'date',
                year: now.getFullYear(),
                month: now.getMonth(),
                date: now.getDate(),
                day: now.getDay(),
                currentDate: now.getDate(),
                monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12],
                weekList: [0, 1, 2, 3, 4, 5, 6],
                yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index)
            }
        },
        props: {
            language: {
                type: String,
                default: 'en'
            },
            value: {
                default: null
            }
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
            value () {
                return `${this.year}-${this.month + 1}-${this.currentDate}`
            },
            panelMargin() {
                retrun `${window.getComputedStyle(this.$el.children[0], null).height + 4}px`
            }
        },
        methods: {
            togglePanel() {
                this.panelState = !this.panelState
            },
            selectDate(date) {
                if(date.previousMonth){
                    this.month -= 1
                }else if(date.nextMonth){
                    this.month += 1
                }
                this.currentDate = date.value
                this.panelState = false
            },
            selectMonth(month) {
                this.month = month
                this.panelType = 'date'
            },
            selectYear(year) {
                this.year = year
                this.panelType = 'month'
            },
            chType(type) {
                this.panelType = type
            },
            chYearRange(next) {
                if(next){
                    this.yearList = this.yearList.map((i) => i + 12)
                }else{
                    this.yearList = this.yearList.map((i) => i - 12)
                }
            }
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
        padding: 0;
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
        }
    }
    .month-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
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
        }
    }
    .year-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
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
        }
    }
</style>

