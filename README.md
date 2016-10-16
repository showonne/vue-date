# vue-datepicker

> datepicker component for Vue.js


Live Demo is [here(browser)](http://www.showonne.com/vue-datepicker/dist/browser/) and [here(webpack)](http://www.showonne.com/vue-datepicker/dist/webpack/)

##Usage

use with single `.vue` file:

    //App.vue
    <script>
        import datepicker from 'path/to/datepicker.vue'
        export default {
            components: { datepicker }
        }
    </script>

use in browser:

    //index.html
    <html>
        <script src="path/to/vue.js"></script>
        <script src="path/to/datepicker.js"></script>
        <body>
            <div id="app"></div>
            <script>
                new Vue({
                    el: '#app',
                    components: { datepicker }
                })
            </script>
        </body>
    </html>
