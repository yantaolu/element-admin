import {Alert} from 'element-ui'

Alert.install = function (Vue) {
  Vue.component('EaAlert', Alert)
}
export default Alert
