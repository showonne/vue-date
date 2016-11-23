<template>
    <div id="app">
        <h2>Select Date:</h2>
        <datepicker v-model="selected" class="picker"></datepicker>
        <br>
        <h5>Selected date is : <b>{{selected}}</b></h5>
        <hr>
        <h2>Range:</h2>
        <div class="range">
            <span>language: en</span>
            <datepicker v-model="start" class="picker" min="2015-01-01" max="2020-01-01"></datepicker>
            <span>language: ch</span>
            <datepicker language="ch" v-model="end" class="picker" :min="start" max="2020-01-08"></datepicker>
        </div>
        <h5>Selected Range: <b>{{start}}</b> - <b>{{end}}</b>, the range between <b>2015-01-01 -- 2020-01-08</b> and the second's min date decided by first one.</h5>
        <hr/>
        <h2>Range selector in single datepicker.</h2>
        <datepicker language="ch" v-model="range" class="picker picker-range" :min="start" max="2020-01-08" :range="true">
        </datepicker>
        <h5>The range is from <b>{{range[0]}}</b> to <b>{{range[1]}}</b> && the sync value is an Array: <b>[{{range[0]}}, {{range[1]}}]</b></h5>
    </div>
</template>

<script>
    import datepicker from './Datepicker.vue'
    export default {
        name: 'Demo',
        data () {
            return {
                selected: '2016-08-03',
                start: '2016-01-01',
                end: '2015-11-01',
                range: ['2016-01-01', '2016-01-11']
            }
        },
        methods: {
            change(key, value) {
                console.log(key, value)
            }
        },
        components: { datepicker }
    }
</script>

<style>
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