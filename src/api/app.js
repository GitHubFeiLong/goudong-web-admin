import request from '@/utils/request'

/**
 * 列表的分页查询
 */
export function pageAppApi(page) {
  return request({
    url: `/api/oauth2/base-app`,
    method: 'get',
    params: page,
  })
}

/**
 * 申请应用
 */
export function applyAppApi(data) {
  return request({
    url: `/api/oauth2/base-app`,
    method: 'post',
    data
  })
}

/**
 * 审核应用
 */
export function auditAppApi(data) {
  return request({
    url: `/api/oauth2/base-app/audit`,
    method: 'put',
    data
  })
}

/**
 * 删除应用
 */
export function deleteAppApi(id) {
  return request({
    url: `/api/oauth2/base-app/${id}`,
    method: 'delete',
  })
}
