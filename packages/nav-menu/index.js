import NavMenu from './src/nav-menu'

NavMenu.install = function (Vue) {
  Vue.component(NavMenu.name, NavMenu)
}
export default NavMenu
