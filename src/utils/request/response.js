import handleCode from './checkCode';

export default function handleResponse(url, response) {
  const { statusText, status, data: resultData, data } = response;
  if (url.indexOf('getcaptcha') !== -1) {
    const base64Str = btoa(new Uint8Array(response.data).reduce((datas, byte) => datas + String.fromCharCode(byte), ''));
    return Promise.resolve({
      code: 0,
      data: `data:image/png;base64,${base64Str}`,
    });
  } else if (url.indexOf('getimg') !== -1) {
    const base64Str = btoa(new Uint8Array(response.data).reduce((datas, byte) => datas + String.fromCharCode(byte), ''));
    return Promise.resolve({
      code: 0,
      data: `data:image/png;base64,${base64Str}`,
    });
  } else if (url.indexOf('/files')!==-1) {//如果是下载文件的情况
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      resultData,
    });
  }
  return Promise.resolve({
    success: data.code,
    message: statusText,
    statusCode: status,
    ...resultData,
  });
}
