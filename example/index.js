// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import {getRoutes} from './routes/index'
import Router from 'vue-router'
import store from './store/index'
import Components from './components/custom-components'
import ElementAdmin from '../src/index'
// import locale from 'element-admin/lib/locale/lang/en'
// font-awesome 字体图标库
import 'font-awesome/css/font-awesome.min.css'
import 'highlight.js/styles/googlecode.css'
import 'github-markdown-css'

getRoutes().then(routes => {
  Vue.use(Router)
  Vue.use(ElementAdmin, {size: 'small'})
  Vue.use(Components)

  const router = new Router({
    mode: 'history',
    routes
  })

  router.beforeEach((to, from, next) => {
    next()
  })

  router.afterEach(() => {
    window.scrollTo(0, 0)
  })

  Vue.config.productionTip = false
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
  })
})
