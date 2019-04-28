import {Message} from 'element-ui'

Message.install = function (Vue) {
  Vue.prototype.$message = Message
}
export default Message
