import {Alert} from 'element-ui'

Alert.install = function (Vue) {
  Vue.component('TfAlert', Alert)
}
export default Alert
