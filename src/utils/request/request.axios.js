import axios from 'axios';
import { message } from 'antd';
import { handleStatusError } from './checkStatus';
import checkCode from './checkCode';
import { REQUEST_HEADER_LIST, getHeaderObject } from './requestHeader';

export default function axiosRequest(url, options, headerConfig = REQUEST_HEADER_LIST.DEFAULT) {
  let config = {};
  config = getHeaderObject(headerConfig);
  const newOptions = { ...config, ...options};

  newOptions.url = url;
  if ('method' in newOptions) {
    newOptions.method = newOptions.method.toUpperCase();
  } else {
    newOptions.method = 'GET';
  }

  if (newOptions.method !== 'GET') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.data = newOptions.body;
    } else {
      newOptions.data = newOptions.body;
    }
  } else {
    newOptions.params = newOptions.body;
  }

  axios.defaults.withCredentials = false; // `withCredentials` 表示跨域请求时是否需要使用凭证
  return axios(newOptions).then(response =>
    checkCode(url, response),
  ).catch(handleStatusError);
}
