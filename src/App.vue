<template>
  <datepicker :value.sync="startDate" id="picker"></datepicker>
</template>

<script>

import datepicker from './components/Datepicker.vue'
export default {
  props: ['startDate'],
  components: {
    datepicker: datepicker
  }
}
</script>

<style>
html {
  height: 100%;
}

#picker{
  position: relative;
  left: 30%;
  top: 10px;
}


</style>
