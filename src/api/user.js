import request from '@/utils/request'

export function login(data) {
  return request({
    url: `/api/oauth2/authentication/login?username=${data.username}&password=${data.password}`,
    // url: `/vue-element-admin/user/login`,
    method: 'post'
  })
}

export function refresh(refreshToken) {
  return request({
    url: `/api/oauth2/authentication/refresh-token?refreshToken=${refreshToken}`,
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/api/oauth2/authentication/current-user-info',
    // url: '/vue-element-admin/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/oauth2/authentication/logout',
    // url: '/vue-element-admin/user/logout',
    method: 'put'
  })
}

/**
 * 根据字段进行分页查询用户
 * @param page
 * @returns {*}
 */
export function pageUserByField(page) {
  return request({
    url: '/api/user/base-user/page-field',
    method: 'get',
    params: page
  })
}

/**
 * 列表的分页查询
 * @param page : { page, size, username, validTime, createTime }
 * @returns {*}
 */
export function pageUser(page) {
  return request({
    url: '/api/user/base-user/page',
    method: 'get',
    params: page
  })
}
