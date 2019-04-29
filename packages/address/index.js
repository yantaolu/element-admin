import Address from './src/address'

Address.install = function (Vue) {
  Vue.component('EaAddress', Address)
  Vue.component('EaAddr', Address)
}
export default Address
