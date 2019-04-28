# 基本使用

> 组件库目前包含了（弃用的组件以外的）所有 ElementUI 组件，使用方式和 ElementUI 相同，为了后续的扩展以及统一升级，将组件名更新为 tf 前缀

> 简单来说目前是基于 ElementUI 做了一层封装，支持 ElementUI 原来所有属性，后期可以定制或者替换，使用者无感平行升级

> 这里所有的标签均以 "tf-" 作为前缀，不可使用 "el-"

- 全局注册的组件有以下组件，vue组件中可以直接使用，在入口文件中导入后不再需要额外引入

```javascript
import {
  Address,
  Alert,
  Aside,
  Autocomplete,
  Badge,
  BreadcrumbItem,
  Breadcrumb,
  ButtonGroup,
  Button,
  Card,
  CarouselItem,
  Carousel,
  Cascader,
  CheckboxButton,
  CheckboxGroup,
  Checkbox,
  Col,
  CollapseItem,
  CollapseTransition,
  Collapse,
  ColorPicker,
  Container,
  DatePicker,
  Dialog,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Footer,
  FormItem,
  Form,
  Header,
  Icon,
  InputNumber,
  Input,
  Main,
  MenuItemGroup,
  MenuItem,
  Menu,
  NavMenu,
  OptionGroup,
  Option,
  Pagination,
  Popover,
  Progress,
  RadioButton,
  RadioGroup,
  Radio,
  Rate,
  RoutesTree,
  Row,
  Scrollbar,
  Select,
  Slider,
  Spinner,
  Step,
  Steps,
  Submenu,
  Switch,
  TabPane,
  Table,
  Tabs,
  Tag,
  TimePicker,
  TimeSelect,
  Tooltip,
  Transfer,
  Tree,
  Upload
} from 'element-admin'
```

```vue
<template>
  <div>
    <!--使用方法-->
    <tf-alert></tf-alert>
    <tf-aside></tf-aside>
    <tf-autocomplete></tf-autocomplete>
    <tf-button></tf-button>
    <!--其他类似-->
  </div>
</template>
```

- TabsView 为局部注册的组件，请在使用时导入，这里仅用作[路由作标签页](/guide/tabs)系统

```vue
<template>
  <tabs-view></tabs-view>
</template>

<script>
import {TabsView} from 'element-admin'
export default {
  components: {TabsView}
}
</script>
```

- 消息通知主要包含Alert、Message、MessageBox及Notification，请参考ElementUI官方文档
