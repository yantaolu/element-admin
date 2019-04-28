import {CollapseTransition} from 'element-ui'

CollapseTransition.install = function (Vue) {
  Vue.component('TfCollapseTransition', CollapseTransition)
}
export default CollapseTransition
