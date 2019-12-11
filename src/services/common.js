import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';
import remoteLinkAddress from '../utils/ip';

export async function queryList(params) {
  return request(createTheURL(Config.API.COMMON, 'all'), {
    method: 'GET',
    body: params,
  });
}

export async function getById(params) {
  return request(remoteLinkAddress()+'/commonByUserId/'+params.id, {
    method: 'GET',
    body: params,
  });
}

export async function edit(params) {
  return request(createTheURL(Config.API.COMMON, 'edit'), {
    method: 'PUT',
    body: params,
  });
}

export async function getDetail(params) {
  return request(createTheURL(Config.API.COMMON, params.commonId), {
    method: 'GET',
    body: params,
  });
}

export async function replyCommon(params) {
  return request(createTheURL(Config.API.REPLY),{
    method:'POST',
    body:params,
  })
}

export async function del(params) {
  return request(createTheURL(Config.API.COMMON, params), {
    method: 'DELETE',
  });
}


