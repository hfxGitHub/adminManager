import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';

export async function getList(params) {
  return request(createTheURL(Config.API.RESULTPUBLICITY, 'list'), {
    method: 'GET',
    body: params
  });
}

export async function getDetail(params) {
  return request(createTheURL(Config.API.SERVICESTAR, 'get'), {
    method: 'GET',
    body: params
  });
}
