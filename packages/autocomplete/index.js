import {Autocomplete} from 'element-ui'

Autocomplete.install = function (Vue) {
  Vue.component('EaAutocomplete', Autocomplete)
}
export default Autocomplete
