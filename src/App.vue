<template>
    <div id="app">
        <h2>Select Date:</h2>
        <h3>Select Language:</h3>
        <select v-model="language" style="margin-bottom: 10px;">
            <option :value="item.value" v-for="item in langList" :key="item.value">{{item.label}}</option>
        </select>
        <datepicker :language="language" v-model="selected" class="picker"></datepicker>
        <br>
        <h5>Selected date is : <b>{{selected}}</b></h5>
        <hr>
        <h2>Range:</h2>
        <div class="range">
            <datepicker v-model="start" class="picker" min="2015-01-01" max="2020-01-01"></datepicker>
            <datepicker v-model="end" class="picker" :min="start" max="2020-01-08"></datepicker>
        </div>
        <h5>Selected Range: <b>{{start}}</b> - <b>{{end}}</b>, the range between <b>2015-01-01 -- 2020-01-08</b> and the second's min date decided by first one.</h5>
        <hr/>
        <h2>Range selector in single datepicker.</h2>
        <datepicker v-model="range" class="picker picker-range" :min="start" max="2020-01-08" :range="true">
        </datepicker>
        <h5>The range is from <b>{{range[0]}}</b> to <b>{{range[1]}}</b> && the sync value is an Array: <b>[{{range[0]}}, {{range[1]}}]</b></h5>
        <hr>
        <h2>Clear Date:</h2>
        <h5>Just change datepicker's value to empty string.</h5>
        <h5>Date: {{init}}</h5>
        <datepicker v-model="init" class="picker"></datepicker>
        <button @click="clear" class="btn">Clear</button>
        <hr/>
        <h2>Mutate Range Mode</h2>
        <datepicker :class="{'picker': !event_date.range, 'picker-range': event_date.range}" :range="event_date.range" v-model="event_date.date" @input="updateEventDate">
        </datepicker>
        <input type="checkbox" id="isrange" v-model="event_date.range"><label for="isrange">Switch range mode</label>
    </div>
</template>

<script>
    import datepicker from './Datepicker.vue'
    export default {
        name: 'Demo',
        data () {
            return {
                langList: [
                    {value: 'en', label: 'English'},
                    {value: 'zh-cn', label: 'Chinese'},
                    {value: 'uk', label: 'Ukrainsk'},
                    {value: 'es', label: 'Spanish'}
                ],
                language:"en",
                selected: '2016-08-03',
                start: '2016-01-01',
                end: '',
                range: ['2016-01-01', '2016-01-11'],
                init: '2016-12-26',
                event_date: {
                    date: '',
                    range: false
                }
            }
        },
        methods: {
            change(key, value) {
                console.log(key, value)
            },
            clear() {
                this.init = ' '
            },
            updateEventDate(val) {
                console.log(val)
            }
        },
        mounted() {
            this.range = ['2016-01-02', '2016-01-11']
        },
        components: { datepicker }
    }
</script>

<style>
    .btn{
        margin-top: 20px;
    }
    #app{
        width: 750px;
        margin: 0 auto;
        border: 1px solid #ccc;
        padding: 10px;
        min-height: 1280px;
        box-sizing: border-box;
    }
    .picker{
        width: 200px;
    }
    .picker-range{
        width: 220px;
    }
    .range{
        display: flex;
        justify-content: space-around;
    }
    b{
        font-weight: 800;
        font-size: 16px;
        color: red;
    }
</style>