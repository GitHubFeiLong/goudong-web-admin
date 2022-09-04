export function exportExcel(response) {
  // 获取响应数据
  const blob = new Blob(
    [response.data], // 将获取到的二进制文件转成blob
    { type: 'charset=utf-8' } // 有时候打开文档会出现乱码，设置一下字符编码
  );
  // 获取文件名
  const disposition = response.headers["content-disposition"]
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);
  let filename = 'goudong-web-admin导出.xlsx'
  if (matches != null && matches[1]) {
    filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  }

  // 转成文件流之后，可以通过模拟点击实现下载效果
  const element = document.createElement('a'); // js创建一个a标签
  const href = window.URL.createObjectURL(blob); 					// 文档流转化成Base64
  element.href = href;
  element.download = filename; 								// 下载后文件名
  document.body.appendChild(element);
  element.click(); 												// 点击下载
  document.body.removeChild(element); 							// 下载完成移除元素
  window.URL.revokeObjectURL(href); 								// 释放掉blob对象
}
