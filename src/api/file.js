import request from "@/utils/request";
import { exportExcel } from "@/utils/export";

/**
 * 上传单文件
 * @param file
 * @returns {*}
 */
export function simpleUpload(file) {
  return request({
    url: `/api/file/upload-group/upload`,
    method: 'post',
    data: file
  })
}

// ~ 用户管理
// =====================================================================================================================
/**
 * 导出用户模板
 * @param data
 * @returns {AxiosPromise}
 */
export function exportUserTemplateApi() {
  return request({
    url: `/api/file/user/template/user`,
    method: 'get',
    responseType: 'blob',
  }).then(response => {
    exportExcel(response)
  })
}

/**
 * 导出用户
 * @param data
 * @returns {AxiosPromise}
 */
export function exportUserApi(data) {
  return request({
    url: `/api/file/user/export/user`,
    method: 'get',
    params: data,
    responseType: 'blob',
  }).then(response => {
    exportExcel(response)
  })
}
