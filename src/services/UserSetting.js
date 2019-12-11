import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getUserList(params) {
  return request(createTheURL(Config.API.USER, 'list'), {
    method: 'GET',
    body:params
  });
}
export async function changeInfo(params) {
  return request(createTheURL(Config.API.USER, 'edit'), {
    method: 'PUT',
    body: params,
  });
}
export async function addUser(params) {
  return request(createTheURL(Config.API.USER, 'add'), {
    method: 'POST',
    body: params,
  });
}
export async function delUser(params) {
  return request(createTheURL(Config.API.USER, 'delall'), {
    method: 'DELETE',
    body: params,
  });
}
export async function getUser(params) {
  return request(createTheURL(Config.API.USER, 'get'), {
    method: 'GET',
    body: params,
  });
}

export async function resetPassWord(params) {
  return request(createTheURL(Config.API.USER,'reset'), {
    method: 'PUT',
    body: params,
  });
}
export async function getAllRole(params) {
  return request(createTheURL(Config.API.ROLE,'all'), {
    method: 'GET',
    body: params,
  });
}
