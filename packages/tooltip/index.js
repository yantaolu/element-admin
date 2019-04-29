import {Tooltip} from 'element-ui'

Tooltip.install = function (Vue) {
  Vue.component('EaTooltip', Tooltip)
}
export default Tooltip
