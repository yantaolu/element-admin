import {MessageBox} from 'element-ui'

MessageBox.install = function (Vue) {
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
}
export default MessageBox
