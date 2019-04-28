import {Loading} from 'element-ui'

export default {
  name: 'Loading',
  install (Vue) {
    Vue.use(Loading.directive)
    Vue.prototype.$loading = Loading.service
  },
  directive: Loading.directive,
  service: Loading.service
}
