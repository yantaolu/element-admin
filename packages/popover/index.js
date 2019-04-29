import {Popover} from 'element-ui'

Object.assign(Popover.methods, {
  close () {
    this.doClose()
  }
})

Popover.install = function (Vue) {
  Vue.component('EaPopover', Popover)
}
export default Popover
