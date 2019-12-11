import request from '@/utils/request/request';
// import { GLOBAL_URL } from '@/utils/ip';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getUserList(params) {
  return request(createTheURL(Config.API.USER, 'all'), {
    method: 'GET',
    body: params,
  });
}

export async function getUser(params) {
  return request(createTheURL(Config.API.USER, params.userId), {
    method: 'GET',
    // body: params,
  });
}

export async function deleteUser(params) {
  return request(createTheURL(Config.API.USER,params.userId), {
    method: 'DELETE',
    // body: params,
  });
}


export async function addUser(params) {
  return request(createTheURL(Config.API.USER, 'add'), {
    method: 'POST',
    body: params,
  });
}

// export async function getCurrentUser(params) {
//   return request(createTheURL(Config.API.USER, 'current'), {
//     method: 'GET',
//     body: params,
//   });
// }


export async function editUser(params){
  return request(createTheURL(Config.API.USER), {
    method: 'PUT',
    body: params,
  });
}

export async function editPassword(params){
  return request(createTheURL(Config.API.USER, 'updatepsw'), {
    method: 'PUT',
    body: params,
  });
}

