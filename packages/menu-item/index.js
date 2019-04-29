import {MenuItem} from 'element-ui'

MenuItem.install = function (Vue) {
  Vue.component('EaMenuItem', MenuItem)
}
export default MenuItem
