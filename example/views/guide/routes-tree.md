## 菜单权限树

> 为开发者提供统一的权限控制处理方案，结合【路由配置】，开发者可以在路由配置项上添加buttons属性，从而达到控制标签页下按钮权限的目的，且树结构完全由开发配置的路由自动生成

> 统一处理的优势，开发者不需要额外开发权限菜单树的维护功能，该菜单树数据结构会根据完整的路由自动生成，不用在每次添加新菜单后还需要去维护数据库的基础树数据

> 数据库仅仅需要保存用户/角色拥有权限的数据即可，按照指定props传递给TabsView组件，组件会统一进行权限控制，用户在无权限的情况下即使直接输入对应的路由路径也无法访问相应的页面（后期升级功能）

[查看功能实例](/examples/menus)

- 路由设置

```javascript
export default {
  path: '/examples',
  title: 'Examples',
  order: 999,
  icon: 'fa-dribbble',
  children: [{
    path: '/roles',
    title: '角色管理',
    component: () => import('../views/examples/roles'),
    buttons: {
      'add-role': '新增角色',
      'edit-role': '编辑角色',
      'delete-role': '删除角色'
    }
  }, {
    path: '/menus',
    title: '菜单权限',
    component: () => import('../views/examples/menus')
  }]
}
```

- 组件使用

```vue
<template>
  <ea-routes-tree ref="menu-tree" class="menu-tree" :menu-tree="menuTree" :default-checked-keys="defaultCheckedKeys">
    <h4>权限菜单</h4>
  </ea-routes-tree>
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
      defaultCheckedKeys: []
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
    this.rootRoutes.forEach(item => {
      if (item.buttons) {
        item.buttons.forEach(button => {
          menus[item.path].buttons[button].checked = true
        })
      }
      this.defaultCheckedKeys.push(item.path)
    })
  }
}
</script>
```

## RoutesTree 组件说明

```vue
<template>
  <ea-routes-tree :menu-tree="menuTree" :default-checked-keys="defaultCheckedKeys"></ea-routes-tree>
</template>

<script>
// 经过 routesProcessor 对路由配置处理后生成的路由树结构数据，包含对应路由下的按钮配置数据
import {menuTree} from '../../routes/index'
// 这里可以结合后端返回的权限数据对menuTree进行相关处理，在编辑的时候数据回填
export default {
  data () {
    return {
      menuTree,
      defaultCheckedKeys: [] // 元素选中的路由path，只用包含最小级别子路由即可，父路由会根据子路由的选中情况自定
    }
  }
}
</script>
```

## RoutesTree Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|menuTree|菜单树结构数据|Object|-|{label: '全部菜单', path: '/*'}|
|nodeKey|树节点唯一值|String|-|'path'|
|defaultCheckedKeys|选中的树节点，树节点path的数组|Array|-|-|

## RoutesTree Methods

|方法名|说明|参数|
|---|---|---|
|getCheckedNodes|获取选中的树节点数据，{path, buttons, checkedButtons}，path是路由路径，buttons是封装对象key为button的authority-code，值为{checked, label}，checkedButtons为只读数组，包含该路由下选中的按钮的authority-code，通过该方法可以获取到完整的选中数据，进行处理后服务端保存|-|
