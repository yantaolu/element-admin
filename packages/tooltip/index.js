import {Tooltip} from 'element-ui'

Tooltip.install = function (Vue) {
  Vue.component('TfTooltip', Tooltip)
}
export default Tooltip
