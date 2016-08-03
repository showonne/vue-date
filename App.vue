<template>
    <div class="app">
        <h2>Select Date:</h2>
        <datepicker :value.sync="selected" class="picker"></datepicker>
        <br>
        <h5>Selected date is : <b>{{selected}}</b></h5>
        <hr>
        <h2>Range:</h2>
        <div class="range">
            <span>language: en</span>
            <datepicker :value.sync="start" class="picker" min="2015-01-01" max="2020-01-01"></datepicker>
            <span>language: ch</span>
            <datepicker language="ch" :value.sync="end" class="picker" :min.sync="start" max="2020-01-08"></datepicker>
        </div>
        <h5>Selected Range: <b>{{start}}</b> - <b>{{end}}</b>, the range between <b>2015-01-01 -- 2020-01-08</b> and the second's min date decided by first one.</h5>
    </div>
</template>

<script>
    import datepicker from './Datepicker.vue'
    export default {
        data () {
            return {
                selected: '2016-08-03',
                start: '',
                end: ''
            }
        },
        components: { datepicker }
    }
</script>

<style>
    .app{
        width: 750px;
        margin: 0 auto;
        border: 1px solid #ccc;
        padding: 10px;
        min-height: 680px;
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