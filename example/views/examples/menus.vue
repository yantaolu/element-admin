<template>
  <tf-routes-tree
    ref="menu-tree" class="menu-tree" :menu-tree="menuTree" :default-expand-all="defaultExpandAll"
    :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys">
    <h4>权限菜单</h4>
  </tf-routes-tree>
</template>

<script>
import {menuTree} from '../../routes/index'

let menus = {}

const parseMenu = (menu) => {
  if (!menu.children) {
    menus[menu.path] = menu
  } else {
    menu.children.forEach(child => {
      parseMenu(child)
    })
  }
}
parseMenu(menuTree)

export default {
  name: 'menu-management',
  methods: {
    tabShow () {
    }
  },
  data () {
    return {
      menuTree: menuTree,
      defaultExpandAll: true,
      defaultCheckedKeys: [],
      defaultExpandedKeys: []
    }
  },
  computed: {
    rootRoutes () {
      return this.$store.getters.rootRoutes
    }
  },
  watch: {
    rootRoutes (arr) {
      arr.forEach(item => {
        if (item.buttons) {
          item.buttons.forEach(button => {
            menus[item.path].buttons[button].checked = true
          })
        }
        this.defaultCheckedKeys.push(item.path)
      })
    }
  },
  mounted () {
    this.$on('tabShow', function () {
    })
    this.rootRoutes.forEach(item => {
      if (item.buttons) {
        item.buttons.forEach(button => {
          menus[item.path].buttons[button].checked = true
        })
      }
      this.defaultCheckedKeys.push(item.path)
    })
    this.defaultExpandAll = true
    // this.defaultExpandedKeys = this.defaultCheckedKeys

    // setTimeout(() => {
    //   this.defaultExpandedKeys = ['/examples/menus']
    // }, 30000)

    // this.$ajax.jsonp('http://10.77.0.105:3000/mock/11/jsonptest', {sssssss: 'ddddd'}).then(d => {
    //   console.log(d)
    // })
    // console.log(window.top.document.cookie, window.document.cookie)
    // console.log(window.top.sessionStorage.getItem('node'))
    // console.log(this.$route.query)
  }
}
</script>
