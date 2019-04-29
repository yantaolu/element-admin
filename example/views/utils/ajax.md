## Ajax 支持

> ajax 是基于 <a href="//www.npmjs.com/package/axios" target="_blank">axios</a> 及 <a href="http://bluebirdjs.com/docs/api-reference.html" target="_blank">bluebird</a> 进行二次封装的 XMLHttpRequest 工具类，这里对请求的发送进行了统一参数处理

- 基本示例

```vue
<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    data () {
      return {
        data: null
      }
    },
    fetchData () {
      // vue 组件内使用
      this.$ajax.get('***').then(d => {
        this.data = d
      })
    }
  }
}
</script>
```

```javascript
// 独立 js 文件中使用
import {ajax} from 'element-admin'
// data：类get请求的参数 或者类post请求提交的数据，根据实际情况传递
const data = {name: 'Yantao Lu', age: 29}
// ops：辅助参数，根据实际情况传递
// method 的可选值为 'GET', 'POST', 'DELETE', 'HEAD', 'PUT' 或 'PATCH'
// type 的可选值为 'formData' 或 'json'，针对 'POST', 'PUT', 或 'PATCH' 请求，默认以表单数据提交，当需要以json格式提交时传值 'json' 即可
// cache 针对 get 请求，设置是否需要缓存，默认不缓存，每次重新请求
// loading 设置是否显示加载状态，默认不显示
// 其他 axios 参数全部支持
const ops = {method: 'GET', type: 'formData', cache: false, loading: false, ...}

// ajax.get('url', data, ops) 返回的是 bluebird 的Promise对象，支持 then、catch 及 finally

ajax.get('url', data, ops).then(d => {}).catch(e => {}).finally(() => {})
```

- 常用方法

```javascript
import {ajax} from 'element-admin'

const url = '****'
const data = {}

// 默认ops为get请求
ajax.request(url, data, {}) 
// get 请求
ajax.get(url, data)
// delete 请求
ajax.delete(url, data)
// head请求
ajax.head(url, data)
// post请求
ajax.post(url, data)
// 以json格式传参发送post请求
ajax.postJson(url, data)
// put请求
ajax.put(url, data)
// 以json格式传参发送put请求
ajax.putJson(url, data)
// patch请求
ajax.patch(url, data)
// 以json格式传参发送patch请求
ajax.patchJson(url, data)
// jsonp支持 ops 默认为 {callback: 'callback'}，返回Promise
ajax.jsonp(url, data, ops)
```

- 并行执行多个请求

```javascript
import {ajax} from 'element-admin'

ajax.all([ajax.get('**'), ajax.get('**')]).then(ajax.spread((d1, d2) => {}))
Promise.all([ajax.get('**'), ajax.get('**')]).then(([d1, d2]) => {})
```

- 扩展使用 <a href="//www.npmjs.com/package/axios#config-defaults" target="_blank">配置、拦截器请参照axios</a>

```javascript
import {ajax} from 'element-admin'

// 默认配置
ajax.defaults.baseURL = '/'

// 获取axios本身
ajax.axios

// 获取自身axios实例
ajax.instance

// 创建axios实例
const ops = {baseUrl: '/'}
const instance1 = ajax.createInstance(ops)
// 等价于
const axios = ajax.axios
const instance2 = axios.create(ops)

// 拦截器
// request拦截器，可以统一发送前需要额外传递的参数
ajax.interceptors.request.use(function(config) {
  return config
}, function(error) {
  Promise.reject(error)
})

// response拦截器，可以对后端返回的数据进行统一解析，例如后端返回的统一实例处理
class ResultError extends Error {
  constructor (msg, code) {
   super(msg)
   this.code = code
  }
}

ajax.interceptors.response.use(function(response) {
  const data = response.data
  const code = parseInt(data.code)
  if (code !== 0) {
    // 未登录
    if (code === -3) {
    
    }
    return Promise.reject(new ResultError(data.msg, code))
  }
  return {
    ...response,
    data: data.data
  }
})
```
