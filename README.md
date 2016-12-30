# vue-datepicker

> datepicker component for Vue.js, already support Vue.js 2.x, the Vue.js 1.x version is on branch `vue-1.x`.


Live Demo is [here(browser)](http://www.showonne.com/vue-date/dist/browser/) and [here(webpack)](http://www.showonne.com/vue-date/dist/webpack/)

## Installation

>npm install vue-date --save

## Usage

#### use with single `.vue` file:

```html
<template>
    <div>
        <datepicker v-model="date"></datepicker>
    </div>
</template>

<script>
    import datepicker from 'vue-date'
    export default {
        data() {
            return {
                date: '2016-10-16'
            }
        },
        components: { datepicker }
    }
</script>
```

#### use in browser:
```html
//index.html
<html>
    <script src="path/to/vue.js"></script>
    <script src="path/to/index.js"></script>
    <body>
        <div id="app">
            <datepicker v-model="date"></datepicker>
        </div>
        <script>
            new Vue({
                el: '#app',
                data: {
                    date: '2016-10-16'
                },
                components: { datepicker }
            })
        </script>
    </body>
</html>
```

## Props

#### language
###### Type: `String`
###### Default: `en`
###### Optional: `en(English)`, `ch(Chinese)`
The language type. Only support `en`(English) and `ch`(Chinese) now.

#### min
###### Type: `String`
###### Default: `1970-01-01`
The minimum date.

```html
//pass string
<datepicker v-model="start" min="2015-01-01"</datepicker>
//or pass variable
<datepicker v-model="start" :min="variable"></datepicker>
```

#### max
###### Type: `String`
###### Default: `3016-01-01`
The maximum date. Usage is same of `min`.

#### range
###### Type: `Boolean`
###### Default: `false`
Use range mode or not. If  pass `true`, the binding value should be an Array  containg the range start and range end. eg. `['1970-01-01', '3016-01-01']`

## Licence
MIT
