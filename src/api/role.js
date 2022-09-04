import request from '@/utils/request'

/**
 * 根据字段进行分页查询用户
 * @param page
 * @returns {*}
 */
export function pageRole(page) {
  return request({
    url: '/api/user/base-role/page',
    method: 'get',
    params: page
  })
}

/**
 * 新增角色
 * @param data
 * @returns {*}
 */
export function addRole(data) {
  return request({
    url: '/api/user/base-role',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {*}
 */
export function editRole(data) {
  return request({
    url: '/api/user/base-role',
    method: 'put',
    data
  })
}
/**
 * 修改角色
 * @param id
 * @returns {*}
 */
export function removeRole(id) {
  return request({
    url: `/api/user/base-role/${id}`,
    method: 'delete',
  })
}

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
