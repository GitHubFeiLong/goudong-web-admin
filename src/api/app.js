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

