import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function queryList(params) {
  return request(createTheURL(Config.API.CABINETSTORAGELOG, 'list'), {
    method: 'GET',
    body: params
  });
}
export async function getDetail(param) {
  return request(createTheURL(Config.API.CABINETSTORAGELOG, 'get'), {
    method: 'GET',
    body:param,
  });
}
