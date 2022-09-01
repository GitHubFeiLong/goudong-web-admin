import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import Token from '@/pojo/Token'
import {validateUrlAuthentication} from '@/utils/validate'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import {TOKEN_LOCAL_STORAGE} from '@/constant/LocalStorageConst'
import {refresh} from '@/api/user'
import {AUTHORIZATION, BEARER} from '@/constant/HttpHeaderConst'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.GATEWAY_URL, // url = base url + request url
  timeout: 5000, // request timeout
  // 是否跨站点访问控制请求
  withCredentials: true,
  // 请求头配置
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    post: {
      'Content-Type': 'application/json;',
    },
    put: {
      'Content-Type': 'application/json;',
    },
    patch: {
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

// 重试队列，每一项将是一个待执行的函数形式
let requests = []
// 是否正在刷新的标记
let isRefreshing = false

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (LocalStorageUtil.getAccessToken()) {
      config.headers[AUTHORIZATION] = BEARER + LocalStorageUtil.getAccessToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log('响应拦截:', response)
    // let responseOther = responseOtherHandler(response);
    // 响应码
    const { status } = response
    const config = response.config
    const result = response.data

    // 响应码401，需要重新登录（或使用无感刷新token）
    if (status === 401) {
      // 登录或刷新令牌 请求返回401，返回reject
      if (validateUrlAuthentication(config.url)) {
        Message({
          message: result.clientMessage || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        this.$store.dispatch('user/resetToken')
        window.location.href = '/login'
        return Promise.reject()
      }

      // 其它请求，获取token
      const token = LocalStorageUtil.get(TOKEN_LOCAL_STORAGE)
      if (token) {
        // 这里进行判断，只有一个请求进入判断
        return refreshingToken(token, config, result)
      } else {
        // 跳转到登录页
        store.dispatch('user/resetToken')
        window.location.href = '/login'
        return Promise.reject()
      }
    }

    if (status < 200 || status >= 400) {
      // 弹出客户端提示
      Message({
        message: result.clientMessage || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 打印服务端提示
      console.error(result.serverMessage)
      // 设置响应为错误，
      return Promise.reject(response)
    }

    return Promise.resolve(response)
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 刷新令牌
 * @param token 令牌对象
 * @param config axios的配置对象
 * @param result 响应结果。
 */
function refreshingToken(token, config, result) {
  if (!isRefreshing) {
    isRefreshing = true
    return new Promise((resolve, reject) => {
      // 请求刷新令牌
      refresh(token.refreshToken).then(response => {
        // 这个是才后端反的data一层数据
        const result = response.data.data
        // 生成token对象
        const newToken = new Token(result.accessToken, result.refreshToken, result.accessExpires, result.refreshExpires)
        // 设置token对象
        LocalStorageUtil.set(TOKEN_LOCAL_STORAGE, newToken)

        // 防止刷新令牌处理完成后，其它请求又401，所以延时补发请求。
        setTimeout(() => {
          // 其它失败的请求进行补发
          requests.forEach((cb) => cb())
          // 刷新token获取后，补偿本次失败的请求【成功】
          requests = []
        }, 3000)
        resolve()
      }).catch(error => {
        // 刷新令牌失败，直接跳转登录界面
        console.error('刷新令牌时，refresh_token无效，跳转到登录页')
        store.dispatch('user/resetToken')
        // 跳转到登录页
        window.location.href = '/login'
        requests = []
        reject(error)
      }).finally(() => {
        isRefreshing = false
      })
    })
  } else {
    // 正在刷新token，返回一个未执行resolve的promise
    return new Promise(resolve => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        service(config)
      })
    })
  }
}

export default service
