import {Popover} from 'element-ui'

Object.assign(Popover.methods, {
  close () {
    this.doClose()
  }
})

Popover.install = function (Vue) {
  Vue.component('TfPopover', Popover)
}
export default Popover
