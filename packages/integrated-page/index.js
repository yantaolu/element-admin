import IntegratedPage from './src/integrated-page'
import TypeCheck from '../../src/utils/type-check'

IntegratedPage.install = function (Vue) {
  Vue.component(IntegratedPage.name, IntegratedPage)
}

// 通过配置动态生成vue组件
IntegratedPage.loadConfig = (cof) => {
  if (!TypeCheck.isObject(cof)) {
    throw new Error('The config must be object.')
  }

  return {
    render (h) {
      const self = this
      return h('tf-integrated-page', {
        class: '',
        props: {
          conditions: self.conditions,
          conditionSize: self.conditionSize,
          autoFetch: self.autoFetch,
          buttons: self.computedButtons,
          columns: self.columns,
          fields: self.fields,
          labelWidth: self.labelWidth
        },
        on: {
          'fetch-data': self.fetch
        }
      })
    },
    data () {
      return Object.assign({}, cof)
    },
    computed: {
      computedButtons () {
        return {
          add: this.getButton('add'),
          edit: this.getButton('edit'),
          delete: this.getButton('delete'),
          view: this.getButton('view'),
          refresh: this.getButton('refresh')
        }
      }
    },
    methods: {
      fetch (args) {
        cof.fetchData.call(this, args)
      },
      getButton (type) {
        let button = (this.buttons && this.buttons[type]) || this[type] || {}
        if (TypeCheck.isFunction(button.submit)) {
          button.submit = button.submit.bind(this)
        }
        return button
      }
    }
  }
}

export default IntegratedPage
