import {DatePicker} from 'element-ui'

DatePicker.props.unlinkPanels = {
  type: Boolean,
  default: true
}

DatePicker.install = function (Vue) {
  Vue.component('EaDatePicker', DatePicker)
}
export default DatePicker
