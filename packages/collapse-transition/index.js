import {CollapseTransition} from 'element-ui'

CollapseTransition.install = function (Vue) {
  Vue.component('EaCollapseTransition', CollapseTransition)
}
export default CollapseTransition
