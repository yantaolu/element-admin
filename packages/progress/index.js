import {Progress} from 'element-ui'

Progress.install = function (Vue) {
  Vue.component('TfProgress', Progress)
}
export default Progress
