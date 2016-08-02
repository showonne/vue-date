<template>
    <div id="app">
        <div class="input-box">
            <datepicker :value.sync="startDate" class="start-picker" min="2012-03-28"></datepicker>
            <datepicker :value.sync="endDate" class="end-picker" language="ch" min="2016-08-10" max="2016-10-28"></datepicker>
        </div>
        <hr>
        <h5>Selected Values: {{startDate}} - {{endDate}}</h5>
    </div>
</template>

<script>

import datepicker from './components/Datepicker.vue'
export default {
  data () {
    return {
        startDate: '',
        endDate: ''
    }
  },
  components: {
    datepicker: datepicker
  },
  methods: {
    log() {
        console.info(this.startDate, '-', this.endDate)
    }
  }
}
</script>

<style>
html {
  height: 100%;
}

#app{
    max-width: 750px;
    margin: 0 auto;
}
.input-box{
    display: flex;
    justify-content: space-around;
    padding-top: 40px;
}
.start-picker, .end-picker{
    width: 30%;
    height: 30px;
    font-size: 18px;
}


</style>
