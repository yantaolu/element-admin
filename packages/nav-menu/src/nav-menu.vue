<template>
  <el-menu
    class="nav-menu" :background-color="backgroundColor" :style="style"
    :text-color="textColor" :active-text-color="activeTextColor"
    :default-openeds="openedIndexes" :collapse="collapse"
    @select="handleMenuSelect" unique-opened>
    <template v-for="item in menus">
      <nav-submenu
        v-if="item.hidden !== true && item.children && item.children.length"
        :key="item.code" :index="item.code" :item="item"
        :text-color="textColor" :active-text-color="activeTextColor" :menu="menu"
        @sub-click="handleMenuClick" @handleAddTab="handleAddTab"></nav-submenu>
      <nav-menu-item
        v-else-if="item.hidden !== true"
        :key="item.code" :index="item.code" :item="item"
        :text-color="textColor" :active-text-color="activeTextColor" :menu="menu"
        @handleAddTab="handleAddTab"></nav-menu-item>
    </template>
  </el-menu>
</template>
<script>
import NavSubmenu from './nav-submenu'
import NavMenuItem from './nav-menu-item'
import {Menu} from 'element-ui'

export default {
  name: 'TfNavMenu',
  components: {ElMenu: Menu, NavSubmenu, NavMenuItem},
  props: {
    backgroundColor: {
      type: String,
      default: '#495060'
    },
    textColor: {
      type: String,
      default: '#bcbcbc'
    },
    activeTextColor: {
      type: String,
      default: '#409EFF'
    },
    menus: {
      type: Array,
      default: () => []
    },
    collapse: {
      type: Boolean,
      default: false
    },
    router: {
      type: Boolean,
      default: true
    },
    indexName: {
      type: String,
      default: 'index'
    }
  },
  data () {
    return {
      openedIndexes: ['1'],
      menu: '',
      counter: {}
    }
  },
  computed: {
    style () {
      return {
        borderColor: this.backgroundColor
      }
    },
    indexMenu () {
      return this.menus[0] && this.menus[0].code
    }
  },
  methods: {
    handleMenuClick (data) {
      this.handleMenuSelect(data.code)
    },
    handleMenuSelect (menuCode) {
      this.updateRoute(menuCode)
      this.$emit('handleMenuSelect', menuCode)
    },
    handleAddTab (menuCode) {
      this.updateRoute(menuCode, true)
      this.$emit('handleMenuSelect', menuCode, true)
    },
    updateRoute (menuCode, newTab = false) {
      if (!this.router) {
        return
      }
      let paths = decodeURIComponent(menuCode).split('/').filter(path => path !== '')
      let tabCode = paths.pop() || ''
      // 新开标签页
      if (newTab) {
        if (this.counter[menuCode] === undefined) {
          this.counter[menuCode] = 0
        }
        this.counter[menuCode] += 1
        tabCode = `${tabCode}-${this.counter[menuCode]}`
      }
      this.$router.push({
        name: paths.length ? paths.join('-') : this.indexName,
        // query,
        params: {
          tabCode,
          refresh: true,
          newTab
        }
      })
    },
    getValidMenu (menus, code) {
      const len = menus.length
      let valid = null
      for (let i = 0; i < len; i++) {
        let menu = menus[i]
        if (menu.code === code) {
          valid = menu
        } else if (menu.children) {
          valid = this.getValidMenu(menu.children, code)
        }
        if (valid) {
          break
        }
      }
      return valid
    },
    // 更新菜单的active状态
    updateMenuActive (menu) {
      // 多个标签页
      if (/-[\d]+$/.test(menu)) {
        const reg = /-[\d]+$/.exec(menu)
        const num = (reg && Math.abs(reg[0])) || 0
        menu = menu.replace(/-[\d]+$/, '')
        // 计数器
        if (!this.counter[menu] || this.counter[menu] < num) {
          this.counter[menu] = num
        }
      }

      // 找到对应的菜单
      let arr = menu.split('/')
      while (!this.getValidMenu(this.menus, menu) && arr.length > 0) {
        arr.pop()
        menu = arr.join('/')
      }

      const valid = this.getValidMenu(this.menus, menu)
      this.menu = menu
      if (valid) {
        const openedIndexes = []
        if (!valid.children) {
          arr.pop()
        }
        while (arr.length > 0) {
          openedIndexes.unshift(arr.join('/'))
          arr.pop()
        }
        this.$set(this, 'openedIndexes', openedIndexes)
      } else {
        this.$set(this, 'openedIndexes', [this.indexMenu])
      }
    }
  },
  watch: {
    /**
     * 路由更新时，需要更新标签页
     * @param route
     */
    $route (route) {
      this.router && this.updateMenuActive(route.path.substring(1))
    }
  },
  mounted () {
    this.router && this.updateMenuActive(this.$route.path.substring(1))
  }
}
</script>
