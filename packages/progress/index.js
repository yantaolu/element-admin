import {Progress} from 'element-ui'

Progress.install = function (Vue) {
  Vue.component('EaProgress', Progress)
}
export default Progress
