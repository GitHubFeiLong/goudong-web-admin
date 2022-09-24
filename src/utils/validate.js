/**
 * Created by PanJiaChen on 16/11/18.
 */
import { checkUsername, checkPhone, checkEmail } from '@/api/user';
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @deprecated
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 判断是否需要请求头带token的
 * @param url
 */
export function validateUrlAuthentication(url) {
  return !validateUrlNotAuthentication(url)
}

/**
 * 判断url不是认证相关地址（登录，刷新令牌）
 * @param url
 * @return true url不是认证地址，需要携token； false：url是认证地址，不需要带token
 */
export function validateUrlNotAuthentication(url) {
  // url类型是undefined直接返回
  if (url === undefined) {
    return false
  }
  // 不是登录请求，也不是刷新token 的请求
  return !url?.startsWith('/api/oauth2/authentication/login') && !url?.startsWith('/api/oauth2/authentication/refresh-token')
}

/**
 * 判断字符串是否是json格式
 * @param str
 */
export function isJSON(str) {
  return new Promise(() => {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str)
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.error('error：' + str + '!!!' + e)
        return false
      }
    }
  })
}

/**
 * 验证是否是日期
 * @param date
 * @returns {boolean}
 */
export function validateDate(date) {
  // 2022-09-10 23:19:09
  if (!isNaN(Date.parse(date))) {
    return true;
  }
  return false;
}

// ~ 自定义element-ui 的校验规则
// =====================================================================================================================
/**
 * 用户名校验
 * @param rule
 * @param value
 * @param callback
 */
export function username(rule, value, callback) {
  if (value === undefined || value === null || value === '') {
    return callback(new Error('请输入用户名'))
  }

  checkUsername(value).then(data => {
    if (data.length !== 0) {
      return callback(new Error('用户名已存在, 可以选择使用：' + data.join()))
    }
    return callback();
  })
}

/**
 * 密码规则
 * @param rule
 * @param value
 * @param callback
 */
export function password(rule, value, callback) {
  // 适中 包含(数字+字母)(数字+字符)(字母+字符) 比严格的要宽，所以先执行严格的正则
  const general = /^(?=[a-zA-Z]*\d)(?=\d*[a-zA-Z])|(?=[+-\\*/,.<>?;:'"+=-_\\(\\)\\|!@#$%^&]*\d)(?=\d*[+-\\*/,.<>?;:'"+=-_\\(\\)\\|!@#$%^&])|(?=[a-zA-Z]*[+-\\*/,.<>?;:'"+=-_\\(\\)\\|!@#$%^&])(?=[+-\\*/,.<>?;:'"+=-_\\(\\)\\|!@#$%^&]*[a-zA-Z])/;

  // 强密码（三种都包含）
  const strong = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])/;

  // 基本条件
  if (value === '' || value === undefined || value === null || value.length < 8 || value.length > 20) {
    return callback(new Error("请输入8-20位字母，数字，符号的组合"))
  }
  // 弱密码匹配（弱也可以注册）
  if (/^\d{8,20}$/.test(value) || /^[a-zA-Z]{8,20}$/.test(value) || /^[+-\\*/,.<>?;:'"+=-_\\(\\)\\|!@#$%^&]{8,20}$/.test(value)) {
    console.log(value, "是弱密码")
    return callback()
  }

  // 强
  if (strong.test(value)) {
    console.log(value, "是强密码")
    return callback()
  }

  // 一般
  if (general.test(value)) {
    console.log(value, "是一般强度的密码")
    return callback()
  }

  callback(new Error("请输入8-20位字母，数字，符号的组合"))
}

/**
 * 手机号校验
 * @param rule
 * @param value
 * @param callback
 */
export function phone(rule, value, callback) {
  const phone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
  if (!phone.test(value)) {
    return callback(new Error('请输入格式正确的手机号'))
  }

  checkPhone(value).then(data => {
    if (!data) {
      return callback(new Error('手机号已被使用'))
    }
    return callback();
  })
}

/**
 * 邮箱校验
 * @param rule
 * @param value
 * @param callback
 */
export function email(rule, value, callback) {
  const email = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+.[a-z]+$/

  if (!email.test(value)) {
    return callback(new Error('请输入格式正确的邮箱地址'))
  }

  checkEmail(value).then(data => {
    if (!data) {
      return callback(new Error('邮箱地址已被使用'))
    }
    return callback();
  })
}
