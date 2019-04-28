import {MenuItem} from 'element-ui'

MenuItem.install = function (Vue) {
  Vue.component('TfMenuItem', MenuItem)
}
export default MenuItem
