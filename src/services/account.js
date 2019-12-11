import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';

export async function queryList(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'list'), {
    method: 'GET',
    body: params
  });
}
export async function editDetail(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'edit'), {
    method: 'PUT',
    body: params
  });
}
export async function editPwd(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'editpwd'), {
    method: 'PUT',
    body: params
  });
}
export async function getDetail(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'get'), {
    method: 'GET',
    body: params
  });
}

export async function addDetail(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'add'), {
    method: 'POST',
    body: params
  });
}
export async function delDetial(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'del'), {
    method: 'DELETE',
    body: params
  });
}
export async function unusable(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'prohibit'), {
    method: 'PUT',
    body: params
  });
}
export async function usablre(params) {
  return request(createTheURL(Config.API.CABINETACCOUNT, 'activation'), {
    method: 'PUT',
    body: params
  });
}
