// import {Cascader} from 'element-ui'
import Cascader from './src/main'

Cascader.install = function (Vue) {
  Vue.component('EaCascader', Cascader)
}
export default Cascader
