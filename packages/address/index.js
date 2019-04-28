import Address from './src/address'

Address.install = function (Vue) {
  Vue.component('TfAddress', Address)
  Vue.component('TfAddr', Address)
}
export default Address
