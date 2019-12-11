import request from '@/utils/request/request';
import GLOBAL_URL from '@/utils/ip';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getRoleList(params) {
  return request(createTheURL(Config.API.ROLE, 'list'), {
    method: 'GET',
    body:params
  });
}
export async function changeState(params) {
  return request(createTheURL(Config.API.ROLE, 'allactivation'), {
    method: 'POST',
    body: params,
  });
}
export async function editRole(params) {
  return request(createTheURL(Config.API.ROLE, 'edit'), {
    method: 'PUT',
    body: params,
  });
}
export async function addRole(params) {
  return request(createTheURL(Config.API.ROLE, 'add'), {
    method: 'POST',
    body: params,
  });
}
export async function delRole(params) {
  return request(createTheURL(Config.API.ROLE, 'del'), {
    method: 'DELETE',
    body: params,
  });
}
export async function getRole(params) {
  return request(createTheURL(Config.API.ROLE, 'get'), {
    method: 'GET',
    body: params,
  });
}

export async function getAllRoles(params) {
  return request(createTheURL(Config.API.ROLE,'all'),{
    method:'GET',
    body:params
  })
}


