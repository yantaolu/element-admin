import {DatePicker} from 'element-ui'

DatePicker.props.unlinkPanels = {
  type: Boolean,
  default: true
}

DatePicker.install = function (Vue) {
  Vue.component('TfDatePicker', DatePicker)
}
export default DatePicker
