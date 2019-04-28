import Bluebird from 'bluebird'
import axios from 'axios'
import qs from 'qs'
import {Loading} from 'element-ui'

class ResultError extends Error {
  constructor (msg, code) {
    super(msg)
    this.code = code
  }
}

const baseURL = '/'
const instance = axios.create({
  baseURL,
  timeout: 30 * 1000
})

const getGlobalJSONPFunctionName = () => {
  return '__JSONP__' + Math.random().toString(16).substr(2)
}

/**
 * ajax请求
 * @param url 请求地址
 * @param data 请求参数 / 提交数据
 * @param ops 附加参数 {method = 'GET', type = 'formData', cache = false, loading = false, ...}
 * @returns {Promise}
 */
const fetch = (url = '/', data = {}, ops = {}) => {
  // 方法
  const method = (ops.method || 'GET').toUpperCase()
  delete ops.method
  // 提交参数类型
  const type = ops.type === 'json' ? 'json' : 'formData'
  delete ops.type
  // GET请求是否缓存
  const cache = ops.cache === true
  delete ops.cache
  // Loading状态
  const loading = ops.loading === true
  delete ops.loading
  // axios参数
  let options = {
    url,
    method: method
  }

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  if (['PUT', 'POST', 'PATCH'].includes(method)) {
    options.data = data
    if (type === 'formData') {
      Object.assign(options, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: data => qs.stringify(data, {arrayFormat: ops.arrayFormat || 'repeat'})
      })
    }
  } else {
    // 请求是否使用缓存，默认不缓存，请求参数增加时间戳
    if (cache === false) {
      Object.assign(data, {_: new Date().getTime()})
    }
    options.params = data
    options.paramsSerializer = function (params) {
      return qs.stringify(params, {arrayFormat: ops.arrayFormat || 'repeat'})
    }
  }

  delete ops.arrayFormat

  Object.assign(options, ops)

  return new Bluebird((resolve, reject) => {
    let $loading = loading && Loading.service({
      fullscreen: true,
      text: '数据加载中...',
      background: 'rgba(255,255,255,0)'
    })
    instance(options).then(response => {
      if (response.status === 200) {
        resolve(response.data)
      } else {
        reject(response.statusText)
      }
    }).catch(e => {
      let status = e && e.response && e.response.status
      let error
      switch (status) {
        case 400:
          error = new ResultError('请求参数有误，无法被服务器理解', status)
          break
        case 403:
          error = new ResultError('无权限，服务器拒绝您的请求', status)
          break
        case 404:
          error = new ResultError('请求路径不存在', status)
          break
        case 405:
          error = new ResultError('请求方法错误', status)
          break
        case 500:
          error = new ResultError('系统错误，请稍后重试', status)
          break
        case 504:
          error = new ResultError('请求超时', status)
          break
        default:
          error = new ResultError(e.message, status)
          break
      }
      reject(error || e)
    }).finally(() => {
      $loading && $loading.close()
    })
  })
}

const ajax = {
  /**
   * XmlRequest请求，默认get请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  request: (url = '', data = {}, ops = {}) => fetch(url, data, ops),
  /**
   * XmlRequest get请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  get: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'GET'}),
  /**
   * XmlRequest delete请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  delete: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'DELETE'}),
  /**
   * XmlRequest head请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  head: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'HEAD'}),
  /**
   * XmlRequest post请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  post: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'POST'}),
  /**
   * XmlRequest 以json格式传参post请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  postJson: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'POST', type: 'json'}),
  /**
   * XmlRequest put请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  put: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'PUT'}),
  /**
   * XmlRequest 以json格式传参put请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  putJson: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'PUT', type: 'json'}),
  /**
   * XmlRequest patch请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  patch: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'PATCH'}),
  /**
   * XmlRequest 以json格式传参patch请求
   * @param url 地址
   * @param data 参数
   * @param ops 附加属性
   * @returns {Promise}
   */
  patchJson: (url = '', data = {}, ops = {}) => fetch(url, data, {...ops, method: 'PATCH', type: 'json'}),
  /**
   * JSONP
   */
  jsonp: (url = '', data = {}, ops = {}) => {
    return new Bluebird((resolve, reject) => {
      // 创建script标签
      let script = document.createElement('script')
      // 格式化url，去除末尾多余的 "?" "&"
      let src = url.replace(/[&|?]+$/, '')
      // jsonp 全局回调函数名
      let callback = getGlobalJSONPFunctionName()
      while (window[callback]) {
        callback = getGlobalJSONPFunctionName()
      }
      // jsonp 全局回调函数
      window[callback] = function (data) {
        // 删除全局回调函数
        try {
          delete window[callback]
        } catch (e) {
          window[callback] = null
        }
        // 返回Promise
        let promise = Bluebird.resolve({data})
        // response 拦截器
        ops.intercept !== false && instance.interceptors.response.forEach(({fulfilled, rejected}) => {
          promise = promise.then(fulfilled, rejected)
        })
        // 返回结果或者异常
        promise.then(result => {
          document.body.removeChild(script)
          resolve(result.data)
        }).catch(e => {
          reject(e)
        })
      }
      // 拼装请求参数
      Object.assign(data, {[ops.callback || 'callback']: callback})
      // qs 序列化参数、并追加参数
      src = `${src}${src.indexOf('?') > 0 ? '&' : '?'}${qs.stringify(data, {arrayFormat: ops.arrayFormat || 'repeat'})}`
      script.type = 'text/javascript'
      script.src = src
      // jsonp 异常
      script.onerror = e => {
        const target = e.target || e.srcElement
        let error = new Error(`JSONP: fail to load ${target.src}`)
        ops.intercept !== false && instance.interceptors.response.handlers && instance.interceptors.response.handlers.forEach(({rejected}) => {
          if (rejected) {
            error = rejected(error)
          }
        })
        document.body.removeChild(script)
        reject(error)
      }
      document.body.appendChild(script)
    })
  },
  /**
   * axios.all
   */
  all: axios.all,
  /**
   * axios.spread
   */
  spread: axios.spread,
  /**
   * 创建axios实例
   * @param ops
   * @returns {AxiosInstance}
   */
  createInstance: (ops = {}) => {
    return axios.create(ops)
  },
  axios: axios,
  instance,
  defaults: instance.defaults,
  interceptors: instance.interceptors
}

export default ajax
