// 上传相关的公用方法
/**
 * 上传excel之前
 * @param file
 * @returns {boolean}
 */
export function beforeUploadExcel(file) {
  console.log(file)
  const typeSuccess = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (!typeSuccess) {
    this.$message.error('导入数据只能是xls、xlsx格式!');
    return false;
  }
  if (file.size / 1024 / 1024 > 100) {
    this.$message.error('excel不能大于100MB');
    return false;
  }
  return true;
}
