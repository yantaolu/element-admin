## Promise 支持

> Promise 功能由 bluebird 库提供支持，内部封装的 ajax 类使用了该功能，返回Promise对象

> 已经使用该Promise代替了浏览器原生的Promise，可在代码中直接使用

```javascript
async function asyncFunction () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({date: new Date()})
    }, 3000)
  })
}

const result = await asyncFunction()
console.log(result.date)
```
