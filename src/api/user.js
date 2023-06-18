import request from '@/utils/request'

export function login(data) {
  const username = data.username;
  const password = data.password;
  return request({
    url: `/api/oauth2/authentication/login?username=${username}&password=${password}`,
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
    url: `/api/user/base-user/page`,
    method: 'get',
    params: page,
  })
}

/**
 * 检查用户名是否可用
 * @param username
 * @returns {*}
 */
export function checkUsername(username) {
  return request({
    url: `/api/user/base-user/check-registry/username/${username}`,
    method: 'get'
  })
}

/**
 * 检查手机号是否可用
 * @param phone
 * @returns {*}
 */
export function checkPhone(phone) {
  return request({
    url: `/api/user/base-user/check-registry/phone/${phone}`,
    method: 'get'
  })
}

/**
 * 检查邮箱号是否可用
 * @param email
 * @returns {*}
 */
export function checkEmail(email) {
  return request({
    url: `/api/user/base-user/check-registry/email/${email}`,
    method: 'get'
  })
}

/**
 * 创建用户
 * @param username
 * @returns {*}
 */
export function simpleCreateUser(user) {
  return request({
    url: `/api/user/base-user/simple-create-user`,
    method: 'post',
    data: user
  })
}

/**
 * 根据用户id查询用户基本信息
 * @param id
 * @returns {*}
 */
export function getUserById(id) {
  return request({
    url: `/api/user/base-user/${id}`,
    method: 'get',
  })
}

/**
 * admin 平台修改用户信息
 * @param user 修改后的用户信息
 * @returns {*}
 */
export function adminEditUser(user) {
  return request({
    url: `/api/user/base-user/admin/user`,
    method: 'put',
    data: user
  })
}

/**
 * 根据id删除用户
 * @param userId 用户id
 * @returns {*}
 */
export function deleteUserById(userId) {
  return request({
    url: `/api/user/base-user/${userId}`,
    method: 'delete'
  })
}

/**
 * 根据id批量删除用户
 * @param ids 用户id集合
 * @returns {*}
 */
export function deleteUserByIdsApi(data) {
  return request({
    url: `/api/user/base-user/ids`,
    params: data,
    method: 'delete'
  })
}

/**
 * 根据id重置用户密码
 * @param userId 用户id
 * @returns {*}
 */
export function resetPasswordApi(userId) {
  return request({
    url: `/api/user/base-user/reset-password/${userId}`,
    method: 'put'
  })
}

/**
 * 根据id切换用户激活状态
 * @param userId 用户id
 * @returns {*}
 */
export function changeEnabledApi(userId) {
  return request({
    url: `/api/user/base-user/change-enabled/${userId}`,
    method: 'put'
  })
}

/**
 * 根据id切换用户锁定状态
 * @param userId 用户id
 * @returns {*}
 */
export function changeLockedApi(userId) {
  return request({
    url: `/api/user/base-user/change-locked/${userId}`,
    method: 'put'
  })
}
