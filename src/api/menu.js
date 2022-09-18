import request from '@/utils/request'

/**
 * 初始化菜单
 * @param data
 * @returns {*}
 */
export function initMenuApi(data) {
  return request({
    url: `/api/user/base-menu/init`,
    method: 'post',
    data
  })
}
