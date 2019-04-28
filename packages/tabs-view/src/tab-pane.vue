<template>
  <transition name="tf-slide-fade">
    <div class="tf-tab-pane" v-show="show">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'private-tab-pane',
  props: {
    context: {
      type: Object,
      default: () => ({})
    },
    closable: {
      type: Boolean,
      default: true
    },
    indexRouteName: String,
    parameters: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    show () {
      return this.$parent.value === this.context.name
    },
    name () {
      return this.context.name
    },
    icon () {
      return this.context.icon
    },
    title () {
      return this.context.title
    },
    component () {
      return this.context.component
    }
  },
  watch: {
    title () {
      this.updateNav()
    },
    icon () {
      this.updateNav()
    },
    closable () {
      this.updateNav()
    }
  },
  methods: {
    // 打开标签页
    openTab (path, query = {}, ops = {}) {
      this.$emit('updateTabsValue', path)
      let arr = path.split('/').filter(val => val.trim() !== '')
      const tabCode = arr.pop()
      const params = {}
      const routeQuery = this.$route.query
      this.parameters.forEach(key => {
        (typeof routeQuery[key] !== 'undefined' && routeQuery[key] !== '' && routeQuery[key] !== null) && (params[key] = routeQuery[key])
      })
      this.$router.push({
        name: arr.length ? arr.join('-') : this.indexRouteName,
        query: {
          ...params,
          ...query
        },
        params: {
          tabCode,
          refresh: ops.refresh !== false,
          title: ops.title
        }
      })
    },
    // 更新标签
    updateNav () {
      this.$parent.updateNav()
    },
    // openTab的别名
    open (path, query = {}, ops = {}) {
      this.openTab(path, query, ops)
    },
    // 设置标签头
    setTitle (title) {
      this.$emit('setTitle', this.context, title)
    },
    // 刷新标签页
    refresh () {
      this.$emit('refresh', this.context)
    },
    // 关闭标签页
    close () {
      this.$emit('close', this.context)
    },
    // 关闭标签页并跳转至新的路径
    closeTo (path = '/', query = {}, ops = {}) {
      this.open(path, query, ops)
      this.$emit('close', this.context)
    },
    // 增加路由
    addRoute (path = '', params = {}) {
      if (!path || !params.component) {
        return
      }
      const arr = path.split('/').filter(code => code !== '')
      params.tabCode = `tab-${arr.join('-')}`
      arr.pop()
      arr.push(':tabCode')
      this.$emit('addRoute', arr.join('/'), params)
    }
  },
  mounted () {
    this.updateNav()
  },
  destroyed () {
    this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
    this.updateNav()
  }
}
</script>
