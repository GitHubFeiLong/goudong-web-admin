import request from "@/utils/request";

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

// ~ 导出
// =====================================================================================================================
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
  })
}
