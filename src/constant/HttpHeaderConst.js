/* 请求头/响应头相关常量，且自定义的请求头和响应头使用`X-`前缀，方便与规范区分*/

/**
 * 认证请求头
 */
export const AUTHORIZATION = 'Authorization'
/**
 * 认证请求头开头
 */
export const BEARER = 'Bearer '

/**
 * X-Aes-Key请求头
 */
export const X_AES_KEY = 'X-Aes-Key'

/**
 * X-App-Id 请求头
 */
export const X_APP_ID = 'X-App-Id'

export const CONTENT_DISPOSITION = 'content-disposition'
export const CONTENT_LENGTH = 'content-length'
export const CONTENT_RANGE = 'content-range'

/**
 * 请求媒体类型
 */
export const CONTENT_TYPE_0 = 'application/x-www-form-urlencoded'
export const CONTENT_TYPE_1 = 'application/json;charset=UTF-8'
export const CONTENT_TYPE_2 = 'multipart/form-data'
