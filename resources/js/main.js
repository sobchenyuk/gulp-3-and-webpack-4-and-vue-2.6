import Vue from 'vue'
import Test from 'js/components/test.vue'

new Vue({
    el: '#js-test-vue',
    components: { 'test' : Test},
    template: '<test></test>'
})
