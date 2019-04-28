import {Notification} from 'element-ui'

Notification.install = function (Vue) {
  Vue.prototype.$notify = Notification
}
export default Notification
