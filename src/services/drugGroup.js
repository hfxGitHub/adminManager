import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';

// export async function getList(params) {
//   return request(createTheURL(Config.API.GROUP), {
//     method: 'GET',
//     // body: params,
//   });
// }
//
// export async function add(params) {
//   return request(createTheURL(Config.API.DRUG), {
//     method: 'POST',
//     body: params,
//   });
// }
//
// export async function delDrug(params) {
//   return request(createTheURL(Config.API.DRUG, ''), {
//     method: 'DELETE',
//     body: params,
//   });
// }
//
// export async function getDrugById(params) {
//   return request(createTheURL(Config.API.DRUG,'group')+'/'+ params.groupId, {
//     method: 'GET',
//   });
// }
//
export async function del(params) {
  return request(createTheURL(Config.API.GROUP), {
    method: 'DELETE',
    body: params,
  });
}
export async function allGroup() {
  return request(createTheURL(Config.API.GROUP),{
    method:'GET'
  })
}
export async function newGroup(params) {
  return request(createTheURL(Config.API.GROUP), {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(createTheURL(Config.API.DRUG, ''), {
    method: 'PUT',
    body: params,
  });
}

