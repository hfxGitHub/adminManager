import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';
import remoteLinkAddress from '../utils/ip';

export async function queryList() {
  return request(createTheURL(Config.API.ORDER, 'all'), {
    method: 'GET',
  });
}

export async function getOrderById(params) {
  return request(remoteLinkAddress()+'/orderByUserId/'+params.id, {
    method: 'GET',
    // body: params,
  });
}

//得到订单详情
export async function getOrderDetailById(params) {
  return request(createTheURL(Config.API.ORDER, 'detail')+'/'+params, {
    method: 'GET',
    // body: params,
  });
}
//新增订单
export async function add(params) {
  return request(createTheURL(Config.API.ORDER, ''), {
    method: 'POST',
    body: params,
  });
}
//修改订单
export async function edit(params) {
  return request(createTheURL(Config.API.ORDER, ''), {
    method: 'PUT',
    body: params,
  });
}
//删除订单
export async function del(params) {
  return request(createTheURL(Config.API.ORDER, ''), {
    method: 'DELETE',
    body: params,
  });
}
//修改订单药品信息
export async function editDrug(params) {
  return request(createTheURL(Config.API.ORDER, 'detail'), {
    method: 'PUT',
    body: params,
  });
}
//删除订单药品信息
export async function delDrug(params) {
  return request(createTheURL(Config.API.ORDER, 'detail'), {
    method: 'DELETE',
    body: params,
  });
}
//增加订单药品信息
export async function addDrug(params) {
  return request(createTheURL(Config.API.ORDER, 'detail'), {
    method: 'POST',
    body: params,
  });
}

// export async function getDetail(params) {
//   return request(createTheURL(Config.API.ORDER, params), {
//     method: 'GET',
//     // body: params,
//   });
// }
