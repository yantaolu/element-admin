import {Autocomplete} from 'element-ui'

Autocomplete.install = function (Vue) {
  Vue.component('TfAutocomplete', Autocomplete)
}
export default Autocomplete
