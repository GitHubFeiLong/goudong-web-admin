import axios from 'axios'
import { Message } from 'element-ui'
import Router from '@/router/index'
import store from '@/store/index'
import Token from '@/pojo/Token'
import { validateDate, validateUrlAuthentication, validateUrlNotAuthentication } from '@/utils/validate'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import { TOKEN_LOCAL_STORAGE } from '@/constant/LocalStorageConst'
import { refresh } from '@/api/user'
import { AUTHORIZATION, BEARER } from '@/constant/HttpHeaderConst'
import { DO_NOT_HANDLE_ERROR_MESSAGE } from "@/constant/DataMapConst";

// 按照axios官方提示需要引入这两步
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

/*
  记录下笔记：
  1. 顺序大致如下 ：请求拦截器 -> 响应拦截器 -> 自定义的catch -> 响应拦截器里的catch
  2. resolve和reject的参数共享，和后端的引用变量一样
 */

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.GATEWAY_URL, // url = base url + request url
  timeout: 20000, // request timeout
  // 是否跨站点访问控制请求
  withCredentials: true,
  // 请求头配置
  headers: {
    get: {
      'X-Client-Side': 'browser',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    post: {
      'X-Client-Side': 'browser',
      'Content-Type': 'application/json;',
    },
    put: {
      'X-Client-Side': 'browser',
      'Content-Type': 'application/json;',
    },
    patch: {
      'X-Client-Side': 'browser',
      'Content-Type': 'application/json;'
    }
  },
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function(data) {
    if (data instanceof FormData) {
      return data
    }
    if (typeof data === 'object') {
      return JSON.stringify(data)
    }
    return data
  }],
  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 reject
  validateStatus(status) {
    return status < 500
  },
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [(data) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      return JSON.parse(data)
    }
    return data
  }]
})

// 是否正在刷新的标记
let isRefreshing = false
// 需要取消请求的集合
const cancelTokens = []

service.interceptors.request.use(async config => {
  /*
    判断当前时间 accessExpires refreshExpires 三个时间
    1. 当前时间小于accessExpires 正常请求
    2. 当前时间大于accessExpires，但小于refreshExpires 先刷新令牌在正常请求
    3. 当前时间大于refreshExpires正常请求（响应拦截器会将其重定向登录页）
   */
  // 自定义的方法，用来获取toke对象，token的格式就是上面令牌的格式（有4个属性）
  const token = LocalStorageUtil.getToken();
  // 判断当前请求接口既不是登录请求，也不是刷新令牌请求时
  if (validateUrlNotAuthentication(config.url)) {
    const now = new Date()
    // 判断是否需要请求刷新令牌接口（当前时间大于accessExpires，但小于refreshExpires 先刷新令牌在正常请求）
    const flag = token && validateDate(token.accessExpires) && validateDate(token.refreshExpires) && now > new Date(token.accessExpires) && now < new Date(token.refreshExpires)
    // 需要请求刷新令牌接口
    if (flag) {
      // 当没有token时，发送了添加购物车的请求，此时取消本次请求
      config.cancelToken = source.token;
      // cancel函数可以不用传参，也可以传入取消后执行的操作，取消后可提示用户需要登录
      cancelTokens.push(() => source.cancel("令牌无效取消请求"));

      // 将本次请求放入待取消请求集合
      // cancelTokens.push(service.CancelToken.source())
      console.log("即将刷新令牌")
      // 调用刷新令牌方法，开始刷新本地令牌
      await refreshingToken(token, config)
    }
  }

  // 在请求头中添加token(这里再次使用方法获取实时的令牌，因为刷新令牌会修改本地存储的token)
  if (LocalStorageUtil.getToken() && LocalStorageUtil.getAccessToken()) {
    // eslint-disable-next-line require-atomic-updates
    config.headers[AUTHORIZATION] = BEARER + LocalStorageUtil.getAccessToken()
  }
  console.log("请求拦截器", config)
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  console.log('响应拦截:', response)
  // 响应码
  const { status, config } = response
  const result = response.data

  if (status === 401) {
    Message({
      message: result.clientMessage,
      type: 'error',
      duration: 5 * 1000
    })
    // 清空用户登录状态
    store.dispatch('user/resetToken')
    // 跳转到登录页
    Router.push({ path: '/login' })
    return Promise.reject(result)
  }

  if (status < 200 || status >= 400) {
    // 设置响应为错误，
    if (result && result.dataMap && !result.dataMap[DO_NOT_HANDLE_ERROR_MESSAGE]) {
      Message({
        message: result.clientMessage,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(result)
  }

  // 当是blob类型的响应时，返回完整的response，方便获取响应头等信息
  if (config.responseType && config.responseType === 'blob') {
    return Promise.resolve(response)
  }

  // 返回data内的数据（去掉axios和后端的封装外层数据，只保留data）
  return Promise.resolve(result.data)
}, error => {
  console.log('err', error) // error 就是后端接口封装的对象
  // 没有 doNotHandleErrorMessage 属性时，或 doNotHandleErrorMessage=false时 弹出提示信息
  if (error && error.dataMap && !error.dataMap[DO_NOT_HANDLE_ERROR_MESSAGE]) {
    Message({
      message: error.clientMessage,
      type: 'error',
      duration: 5 * 1000
    })
  }
  return Promise.reject(error)
})

/**
 * 刷新令牌
 * @param token 令牌对象
 * @param config axios的配置对象
 */
async function refreshingToken(token, config) {
  if (!isRefreshing) {
    isRefreshing = true
    return new Promise((resolve, reject) => {
      // 请求刷新令牌
      refresh(token.refreshToken).then(data => {
        // 生成token对象
        const newToken = new Token(data.accessToken, data.refreshToken, data.accessExpires, data.refreshExpires)
        // 设置token对象
        LocalStorageUtil.set(TOKEN_LOCAL_STORAGE, newToken)
        resolve(data)
      }).catch(data => {
        // 刷新令牌失败，直接跳转登录界面
        store.dispatch('user/resetToken')
        if (!data.dataMap[DO_NOT_HANDLE_ERROR_MESSAGE]) {
          Message({
            message: '登录已过期，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          data.dataMap[DO_NOT_HANDLE_ERROR_MESSAGE] = true
        }
        Router.push({ path: '/login' })
        // 取消队列中的请求
        cancelTokens.forEach(cancel => {
          cancel().catch()
        })
        reject(data)
      }).finally(() => {
        // 恢复变量值
        isRefreshing = false
      })
    })
  } else {
    // 阻塞当前请求
    return new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (!isRefreshing) {
          clearTimeout(id)
          resolve();
        }
      }, 1000);
    });
  }
}

const sleep = (time = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default service
