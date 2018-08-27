// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
Vue.config.productionTip = false
import 'common/stylus/index.styl'
//点击有300ms的延迟
fastclick.attach(document.body)
Vue.use(VueLazyload,{
  loading:require('common/images/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App},
  template: '<App/>'
})
