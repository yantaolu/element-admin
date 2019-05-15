# Element-Admin 是基于ElementUI二次封装的Vue组件库

- <a style="color: red;" href="//element-cn.eleme.io/#/zh-CN/component/installation" target="_blank">未详细说明的组件请参考ElementUI官方文档，使用其相关特性</a>

- <a style="color: red;" href="//github.com/yantaolu/ea-demo" target="_blank">完整项目代码样例</a> &gt; <a style="color: red;" href="//github.com/yantaolu/ea-demo/archive/master.zip">Download demo source code</a>

- npm 安装

  > 推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用
  
  ```
  npm install element-admin -S
  ```

- 基础使用

```javascript
// 依赖vue
import Vue from 'vue'
// ElementAdmin组件库
import ElementAdmin from 'element-admin'
// 样式表
import 'element-admin/lib/css/element-admin.css'

Vue.use(ElementAdmin)
```

- 组件尺寸

```javascript
// 依赖vue
import Vue from 'vue'
// ElementAdmin组件库
import ElementAdmin from 'element-admin'
// 样式表
import 'element-admin/lib/element-admin.css'

Vue.use(ElementAdmin, {size: 'small'})
```

- 国际化支持

```javascript
// 依赖vue
import Vue from 'vue'
// ElementAdmin组件库
import ElementAdmin from 'element-admin'
// 样式表
import 'element-admin/lib/element-admin.css'
// 国际化文件
import locale from 'element-admin/lib/locale/lang/en'

Vue.use(ElementAdmin, {locale})
```

- 主题定制，自己创建custom-theme.scss（文件名自定义），并在入口文件中引入，不再需要引入element-admin.css

```scss
/*Header*/
$--header-padding: 0;
/*Main*/
$--main-padding: 5px;
@import "~element-admin/lib/css/index";
```

```javascript
// 依赖vue
import Vue from 'vue'
// ElementAdmin组件库
import ElementAdmin from 'element-admin'
// 样式表
import 'custom-theme.scss'

Vue.use(ElementAdmin)
```

- <a href="//fontawesome.com/icons?d=gallery&m=free" target="_blank">font-awesome</a> 字体图标库支持，需要在 ea-icon 组件中使用 font-awesome 图标库时，请在入口文件中引入字体图标库样式表

```javascript
import 'element-admin/lib/css/font-awesome.min.css'
```

```vue
<ea-icon name='fa-glass'></ea-icon>
```
