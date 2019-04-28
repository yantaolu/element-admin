## 0.0.4

2018.12.24

#### 更新日志

1. 更名为element-admin发布到公网npm

---

## 0.9.17

2018.12.24

#### 更新日志

1. [Table](/integrated/table)组件优化，增加column快速格式化日期属性dateFormat，用以代替renderCell或者formatter

2. 优化SPA模式下标签页关闭this.$parent.close()方法内部实现

---

## 0.9.12

2018.12.03

#### 更新日志

1. [QueryConditions](/integrated/query-conditions)地址类型查询条件增加fields属性，用以拆分地址组件的数据方便后端接口接收

2. [Address](/integrated/address)地址组件前端取数据优化，同一省、市、区只取一次数据，前端进行缓存，避免过多次数的数据请求

---

## 0.9.6

2018.11.23

#### 更新日志

1. [Address](/integrated/address)地址组件扩展，支持选择层级，change事件传递部分附加数据

2. [QueryConditions](/integrated/query-conditions)组件增加地址组件支持

3. 优化SPA模式下（即独立展示标签内容时）的兼容性

---

## 0.9.5

2018.11.08

#### 更新日志

1. [QueryConditions](/integrated/query-conditions)组件，日期范围条件增加maxRange属性，限制用户选择日期的最大范围，可以防止用户选择过长时间范围查询数据时导致服务器异常，支持年（y）、月（m）、周（w）、日（d）参照JIRA工时

---

## 0.9.4

2018.11.02

#### 更新日志

1. 修复特定情况（标签页打开过多出现滚动时）下标签页关闭所有时，出现标签页标题栏显示异常的情况

---

## 0.9.2

2018.10.23

#### 更新日志

1. [导航菜单](/guide/nav)新增父节点支持加载页面并显示子节点

2. 更新Element-UI底包后，导航菜单active显示兼容性修复

3. [TabsView](/guide/tabs)组件增加closeTo方法，关闭并跳转

4. [TabsView](/guide/tabs)组件支持动态增加临时路由（刷新页面时，路由不生效，因为路由是在页面展示后加入的）

---

## 0.8.7

2018.09.20

#### 更新日志

1. [TabsView](/guide/tabs)组件重构，优化组件交互逻辑，数据状态提升，优化标签页关闭并新开其他标签页的刷新逻辑

---

## 0.8.4

2018.09.13

#### 更新日志

1. [QueryConditions](/integrated/query-conditions)组件，日期范围选择条件优化，增加额外的start和end属性，分别接收日期范围开始和结束时间参数，使用更加人性化

---

## 0.8.2

2018.09.11

#### 更新日志

1. [QueryConditions](/integrated/query-conditions)组件支持异步动态下拉列表/搜索建议输入

---

## 0.8.0

2018.09.10

#### 更新日志

1. [QueryConditions](/integrated/query-conditions)组件支持form表单校验，提供输入框附加属性支持

---

## 0.7.5

2018.08.30

#### 更新日志

1. 修复[QueryConditions](/integrated/query-conditions)组件中日期范围选择不生效的bug

---

## 0.7.3

2018.08.23

#### 更新日志

1. 优化标签页刷新机制

---

## 0.7.1

2018.08.21

#### 更新日志

1. [ajax工具](/utils/ajax)类，jsonp支持统一的response拦截器

---

## 0.6.5

2018.08.15

#### 更新日志

1. 标签页内容支持独自显示，例如被&lt;iframe&gt;加载，正常的标签页路由前加指定前缀 "/spa" 即可用于标签页单页浏览，标签页中的超链接会根据实际情况跳转，[实例](/spa/logs)

---

## 0.6.2

2018.08.08

#### 更新日志

1. [ajax工具](/utils/ajax)类，增加jsonp支持，建议使用 0.7.1 之后的版本

2. 修复部分组件不能用的BUG

3. ElementUI底包更新到2.4.5版本

---

## 0.5.7

2018.08.07

#### 更新日志

1. [TabsView](/guide/tabs)增加关闭当前标签页的方法

2. [TabsView](/guide/tabs)openTab方法增加别名open

---

## 0.5.6

2018.08.02

#### 更新日志

1. [Table](/integrated/table)组件，增加 "url" props，通过指定url可以配置列表加载数据的ajax请求地址

2. [Table](/integrated/table)组件，增加 "defaults" 配置，通过配置 defaults，可以设置table全局属性，例如分页请求的参数名、排除的参数名、数据请求前置参数处理、数据请求后置结果处理

3. [Table](/integrated/table)组件，增加 "config" props，通过配置覆盖全局 defaults 配置
---

## 0.5.5

2018.08.01

#### 更新日志

1. 修复[QueryConditions](/integrated/query-conditions)自动将条件分行逻辑中的bug

---

## 0.5.1

2018.07.31

#### 更新日志

1. 增加[Addr](/integrated/address)组件，作为统一的地址选择组件

---

## 0.5.0

2018.07.24

#### 更新日志

1. 替换ajax工具依赖的qs模块，替换为<a href="https://www.npmjs.com/package/qs" target="_blank">https://www.npmjs.com/package/qs</a>，支持数组的转换规则arrayFormat

2. IE兼容性优化，ValidateRules由静态类改为普通对象，因为IE下类的静态length属性不能重新赋值

3. IE兼容性优化，部分目录未加入babel编译，在IE下部分特性不支持

---

## 0.4.6

2018.07.23

#### 更新日志

1. 修复[TabsView](/guide/tabs)标签页标题栏出现滚动条时，再次点击已经打开的菜单，标签标题不能自动获取焦点的问题

2. [IntegratedPage](/integrated/integrated-page)中buttons配置增加更简单的url配置，开发者可以自定义submit的事件，也可以指定submit的url由组件进行post请求提交数据

---

## 0.4.5

2018.07.20

#### 更新日志

1. [IntegratedPage](/integrated/integrated-page)增加配置方式生成vue组件，可以像jQuery一样通过配置属性生成完整功能的列表页

---

## 0.4.4

2018.07.19

#### 更新日志

1. [IntegratedPage](/integrated/integrated-page)组件功能完善，增、删、改、查交互实现，接口定义，可以利用该组件快速开发列表页

2. 更新全局Promise，使用bluebird替代替全局Promise

3. 修复[ValidatRules](/utils/validate-rules)部分校验未返回结果的bug

---

## 0.4.2

2018.07.18

#### 更新日志

1. 增加[ValidatRules](/utils/validate-rules)工具类，为表单校验提供常用的检验规则

---

## 0.4.1

2018.07.17

#### 更新日志

1. 增加[QueryConditions](/integrated/query-conditions)组件，为查询条件提供布局方案

2. 增加[IntegratedPage](/integrated/integrated-page)组件，为简单列表页面开发提供完整的组件，使开发者仅仅关注业务数据即可，不用再为简单的列表页面重复的写代码

---

## 0.3.8

2018.07.11

#### 更新日志

1. [TabsView](/guide/tabs) 内部优化，增加 props 'components' 代替组件注册的方式，请尽量使用新的方式

2. [TabsView](/guide/tabs) 增加权限控制逻辑，props 'authorities' 设置权限时，同时会控制该标签页下的按钮权限，如何配置权限请参照[菜单权限树](/guide/routes-tree)

3. [TabsView](/guide/tabs) 增加403及404插槽，开发者可以自定义403页面和404页面

---

## 0.3.6

2018.07.10

#### 更新日志

1. 增加[RoutesTree](/guide/routes-tree)组件，为权限控制（菜单、路由、按钮）提供统一解决方案，包含标签页及标签页下按钮权限

2. 优化工具函数 routesProcessor 内部处理逻辑，增加权限控制相关逻辑处理

3. 完善菜单权限树逻辑，提供统一解决方案，暂时为完全实现

---

## 0.3.0

2018.07.05

#### 更新日志

1. 完善[TabsView](/guide/tabs)组件功能，增加标题栏右键菜单功能（刷新、关闭其他、关闭所有）

2. 增加默认标签页路由解析器routes-processor，improt {routesProcessor} from 'element-admin'，主要解析路由数据，用于整合导航菜单、标签页组件、标签页路由、菜单树数据

3. 增加一级独立菜单支持，一级菜单可以指定其对应的标签页

---

## 0.2.0

2018.07.02

#### 更新日志

1. 封装[Table](/integrated/table)组件，支持分页、flex布局，增加部分属性

2. 移除[TableColumn](/deprecated/table-column)组件，使用Table的columns属性代替

3. 封装[NavMenu](/guide/nav)组件，支持递归无限层级，路由支持

4. 封装[TabsView](/guide/tabs)组件（需要局部引入并注册子组件（标签页）），单页面内容以标签页方式显示，非常适合管理系统平台，路由支持，会根据路由自动切换，浏览器前进、后退、刷新等操作均支持

5. ajax支持，使用axios封装[ajax工具](/utils/ajax)类，支持常用各种请求方式，统一形参，针对 'PUT', 'POST', 'PATCH' 请求增加json提交支持

---

## 0.1.0

2018.06.27

#### 更新日志

1. 项目依赖<a href="//element-cn.eleme.io/#/zh-CN" target="_blank">ElementUI</a>、<a href="//www.npmjs.com/package/axios" target="_blank">axios</a>、<a href="http://bluebirdjs.com/docs/api-reference.html" target="_blank">bluebird</a>

2. 基本封装，包装ElementUI所有组件，修改组件名称

3. 增加入口文件生成脚本，自动生成入口文件

4. 增加example示例
