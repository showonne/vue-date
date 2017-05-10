<template>
    <div class="date-picker">
        <div class="input-wrapper" @mouseenter="showCancel = true" @mouseleave="showCancel = false">
            <div class="input" @click="togglePanel" v-text="range ? value[0] + ' -- ' + value[1] : value"></div>
            <transition name="fade">
                <img class="cancel-btn" src="./cancel.png" v-show="showCancel" @click="clear">
            </transition>
        </div>
        <transition name="toggle">
            <div class="date-panel" v-show="panelState" :style="coordinates">
                <div class="panel-header" v-show="panelType !== 'year'">
                    <div class="arrow-left" @click="prevMonthPreview()">&lt;</div>
                    <div class="year-month-box">
                        <div class="year-box" @click="chType('year')" v-text="tmpYear"></div>
                        <div class="month-box" @click="chType('month')">{{tmpMonth + 1 | month(language)}}</div>
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
                            :class="{selected: isSelected('year', item), invalid: validateYear(item)}" 
                            @click="selectYear(item)"
                        >
                        </li>
                    </ul>
                </div>
                <div class="type-month" v-show="panelType === 'month'">
                    <ul class="month-list">
                        <li v-for="(item, index) in monthList"
                            :class="{selected: isSelected('month', index), invalid: validateMonth(index)}" 
                            @click="selectMonth(index)"
                        >
                            {{item | month(language)}}
                        </li>
                    </ul>
                </div>
                <div class="type-date" v-show="panelType === 'date'">
                    <ul class="weeks">
                        <li v-for="item in weekList">{{item | week(language)}}</li>
                    </ul>
                    <ul class="date-list">
                        <li v-for="(item, index) in dateList"
                            :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
                                invalid: validateDate(item), firstItem: (index % 7) === 0}"
                            @click="selectDate(item)">
                            <div class="message" :class="{selected: isSelected('date', item)}">
                                <div class="bg"></div><span v-text="item.value"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data () {
            let now = new Date()
            return {
                showCancel: false,
                panelState: false,
                panelType: 'date',
                coordinates: {},
                year: now.getFullYear(),
                month: now.getMonth(),
                date: now.getDate(),
                tmpYear: now.getFullYear(),
                tmpMonth: now.getMonth(),
                tmpStartYear: now.getFullYear(),
                tmpStartMonth: now.getMonth(),
                tmpStartDate: now.getDate(),
                tmpEndYear: now.getFullYear(),
                tmpEndMonth: now.getMonth(),
                tmpEndDate: now.getDate(),
                minYear: Number,
                minMonth: Number,
                minDate: Number,
                maxYear: Number,
                maxMonth: Number,
                maxDate: Number,
                yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index),
                monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12],
                weekList: [0, 1, 2, 3, 4, 5, 6],
                rangeStart: false
            }
        },
        props: {
            language: {default: 'en'},
            min: {default: '1970-01-01'},
            max: {default: '3016-01-01'},
            value: {
                type: [String, Array],
                default: ''
            },
            range: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            togglePanel () {
                this.panelState = !this.panelState
                this.rangeStart = false
            },
            isSelected (type, item) {
                switch (type){
                    case 'year':
                        if(!this.range) return item === this.tmpYear
                        return (new Date(item, 0).getTime() >= new Date(this.tmpStartYear, 0).getTime() 
                            && new Date(item, 0).getTime() <= new Date(this.tmpEndYear, 0).getTime())
                    case 'month':
                        if(!this.range) return item === this.tmpMonth && this.year === this.tmpYear
                        return (new Date(this.tmpYear, item).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth).getTime() 
                            && new Date(this.tmpYear, item).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth).getTime())
                    case 'date':
                        if(!this.range) return this.date === item.value && this.month === this.tmpMonth && item.currentMonth
                        let month = this.tmpMonth
                        item.previousMonth && month--
                        item.nextMonth && month++
                        return (new Date(this.tmpYear, month, item.value).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime() 
                            && new Date(this.tmpYear, month, item.value).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime())
                }
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
                if(this.validateYear(year)) return
                this.tmpYear = year
                this.panelType = 'month'
            },
            selectMonth (month) {
                if(this.validateMonth(month)) return
                this.tmpMonth = month
                this.panelType = 'date'
            },
            selectDate (date) {
                setTimeout(() => {
                    if(this.validateDate(date)) return
                    if(date.previousMonth){
                        if(this.tmpMonth === 0){
                            this.year -= 1
                            this.tmpYear -= 1
                            this.month = this.tmpMonth = 11
                        }else{
                            this.month = this.tmpMonth - 1
                            this.tmpMonth -= 1
                        }
                    }else if(date.nextMonth){
                        if(this.tmpMonth === 11){
                            this.year += 1
                            this.tmpYear += 1
                            this.month = this.tmpMonth = 0
                        }else{
                            this.month = this.tmpMonth + 1
                            this.tmpMonth += 1
                        }
                    }
                    if(!this.range){

                        this.year = this.tmpYear
                        this.month = this.tmpMonth
                        this.date = date.value
                        let value = `${this.tmpYear}-${('0' + (this.month + 1)).slice(-2)}-${('0' + this.date).slice(-2)}`
                        this.$emit('input', value)
                        this.panelState = false

                    }else if(this.range && !this.rangeStart){

                        this.tmpEndYear = this.tmpStartYear = this.tmpYear
                        this.tmpEndMonth = this.tmpStartMonth = this.tmpMonth
                        this.tmpEndDate = this.tmpStartDate = date.value

                        this.rangeStart = true

                    }else if(this.range && this.rangeStart){
                        
                        this.tmpEndYear = this.tmpYear
                        this.tmpEndMonth = this.tmpMonth
                        this.tmpEndDate = date.value

                        let d1 = new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime(),
                            d2 = new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime()
                        if(d1 > d2){
                            let tmpY, tmpM, tmpD
                            tmpY = this.tmpEndYear 
                            tmpM = this.tmpEndMonth
                            tmpD = this.tmpEndDate

                            this.tmpEndYear = this.tmpStartYear
                            this.tmpEndMonth = this.tmpStartMonth
                            this.tmpEndDate = this.tmpStartDate

                            this.tmpStartYear = tmpY
                            this.tmpStartMonth = tmpM
                            this.tmpStartDate = tmpD
                        }
                        let RangeStart = `${this.tmpStartYear}-${('0' + (this.tmpStartMonth + 1)).slice(-2)}-${('0' + this.tmpStartDate).slice(-2)}`
                        let RangeEnd = `${this.tmpEndYear}-${('0' + (this.tmpEndMonth + 1)).slice(-2)}-${('0' + this.tmpEndDate).slice(-2)}`

                        let value = [RangeStart, RangeEnd]
                        this.$emit('input', value)

                        this.rangeStart = false
                        this.panelState = false
                    }
                }, 0)
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
            },
            close (e) {
                if(!this.$el.contains(e.target)){
                    this.panelState = false
                    this.rangeStart = false
                }
            },
            clear() {
                this.$emit('input', this.range ? ['', ''] : '')
            }
        },
        watch: {
            min (v) {
                let minArr = v.split('-')
                this.minYear = Number(minArr[0])
                this.minMonth = Number(minArr[1])
                this.minDate = Number(minArr[2])
            },
            max (v) {
                let maxArr = v.split('-')
                this.maxYear = Number(maxArr[0])
                this.maxMonth = Number(maxArr[1])
                this.maxDate = Number(maxArr[2])
            },
            range (newVal, oldVal) {
                if(newVal === oldVal) return
                if(newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'String'){
                    this.$emit('input', ['', ''])
                }
                if(!newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'Array'){
                    this.$emit('input', '')
                }
            }
        },
        computed: {
            dateList () {
                let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
                let dateList = Array.from({length: currentMonthLength}, (val, index) => {
                    return {
                        currentMonth: true,
                        value: index + 1
                    }
                })
                let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay()
                let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate()

                for(let i = 0, len = startDay; i < len; i++){
                    dateList = [{previousMonth: true, value: previousMongthLength - i}].concat(dateList)
                }
                for(let i = dateList.length, item = 1; i < 42; i++, item++){
                    dateList[dateList.length] = {nextMonth: true, value: item}
                }
                return dateList
            }
        },
        filters: {
            week: (item, lang) => {
                switch (lang) {
                    case 'en':
                        return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
                    case 'ch':
                        return {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'}[item]
                    case 'uk':
                        return {0: 'Пн', 1: 'Вт', 2: 'Ср', 3: 'Чт', 4: 'Пт', 5: 'Сб', 6: 'Нд'}[item]
                    default:
                        return item
                }
            },
            month: (item, lang) => {
                switch (lang) {
                    case 'en':
                        return {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                         7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}[item]
                    case 'ch':
                        return {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',
                         7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二'}[item]
                    case 'uk':
                        return {1: 'Січень', 2: 'Лютий', 3: 'Березень', 4: 'Квітень', 5: 'Травень', 6: 'Червень',
                         7: 'Липень', 8: 'Серпень', 9: 'Вересень', 10: 'Жовтень', 11: 'Листопад', 12: 'Грудень'}[item]
                    default:
                        return item
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
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

                if(this.range){
                    if(Object.prototype.toString.call(this.value).slice(8, -1) !== 'Array'){
                        throw new Error('Binding value must be an array in range mode.')
                    }
                    if(this.value.length){
                        let rangeStart = this.value[0].split('-')
                        let rangeEnd = this.value[1].split('-')
                        this.tmpStartYear = Number(rangeStart[0])
                        this.tmpStartMonth = Number(rangeStart[1]) - 1
                        this.tmpStartDate = Number(rangeStart[2])

                        this.tmpEndYear = Number(rangeEnd[0])
                        this.tmpEndMonth = Number(rangeEnd[1]) - 1
                        this.tmpEndDate = Number(rangeEnd[2])
                    }else{
                        this.$emit('input', ['', ''])
                    }
                    
                }
                if(!this.value){
                    this.$emit('input', '')
                }
                window.addEventListener('click', this.close)
            })
        },
        beforeDestroy () {
            window.removeEventListener('click', this.close)
        }
    }
</script>

<style scoped lang='less'>
    ul{
        padding: 0;
        margin: 0;
        list-style: none;
    }
    .date-picker{
        position: relative;
        height: 32px;
    }
    .input-wrapper{
        border: 1px solid #ccc;
        border-radius: 2px;
        vertical-align: middle;
        display: flex;
        justify-content: space-between;
        flex-flow: row nowrap;
        align-items: center;
        padding: 6px 10px 6px 4px;
        height: 32px;
        box-sizing: border-box;
    }
    .input{
        height: 100%;
        width: 100%;
        font-size: inherit;
        padding-left: 4px;
        box-sizing: border-box;
        outline: none;
    }
    .cancel-btn{
        height: 14px;
        width: 14px;
    }
    .date-panel{
        position: absolute;
        z-index: 5000;
        border: 1px solid #eee;
        box-sizing: border-box;
        width: 320px;
        padding: 5px 10px 10px;
        box-sizing: border-box;
        background-color: #fff;
        transform: translateY(4px);
    }
    .panel-header{
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
    }
    .arrow-left, .arrow-right{
        flex: 1;
        font-size: 20px;
        line-height: 2;
        background-color: #fff;
        text-align: center;
        cursor: pointer;
    }
    .year-range{
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
    .type-year, .type-month, .date-list{
        background-color: #fff;
    }

    .year-box, .month-box{
        transition: all ease .1s;
        font-family: Roboto, sans-serif;
        flex: 1;
        text-align: center;
        font-size: 20px;
        line-height: 2;
        cursor: pointer;
        background-color: #fff;
    }
    .year-list, .month-list{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            font-family: Roboto, sans-serif;
            transition: all .45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            cursor: pointer;
            text-align: center;
            font-size: 20px;
            width: 33%;
            padding: 10px 0;
            &:hover{
                background-color: #6ac1c9;
                color: #fff;
            }
            &.selected{
                background-color: #0097a7;
                color: #fff;
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
            box-sizing: border-box;
            border-bottom: 1px solid #fff;
            position: relative;
            margin: 2px;
            &:not(.firstItem){
                margin-left: 10px;
            }
            .message{
                font-family: Roboto, sans-serif;
                font-weight: 300;
                font-size: 14px;
                position: relative;
                height: 30px;
                &.selected{
                    .bg{
                        background-color: rgb(0, 151, 167);
                    }
                    span{
                        color: #fff;
                    }
                }
                &:not(.selected){
                    .bg{
                        transform: scale(0);
                        opacity: 0;
                    }
                    &:hover{
                        .bg{
                            background-color: rgb(0, 151, 167);
                            transform: scale(1);
                            opacity: .6;
                        }
                        span{
                            color: #fff;
                        }
                    }
                }
                .bg{
                    height: 30px;
                    width: 100%;
                    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                    border-radius: 50%;
                    position: absolute;
                    z-index: 10;
                    top: 0;
                    left: 0;
                }
                span{
                    position: absolute;
                    z-index: 20;
                    left: 50%;
                    top: 50%;
                    transform: translate3d(-50%, -50%, 0);
                }
            }
            &.invalid{
                cursor: not-allowed;
                color: #ccc;
            }
        }
        
    }
    .weeks{
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
        .preMonth, .nextMonth{
            color: #ccc;
        }
        li{
            font-family: Roboto;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
        }
    }
    .toggle-enter, .toggle-leave-active{
        opacity: 0;
        transform: translateY(-10px);
    }
    .toggle-enter-active, .toggle-leave-active{
        transition: all ease .2s;
    }
    .fade-enter, .fade-leave-active{
        opacity: 0;
        transform: scale3d(0, 0, 0);
    }
    .fade-enter-active, .fade-leave-active{
        transition: all ease .1s;
    }
</style>
