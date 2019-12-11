import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import { REQUEST_HEADER_LIST } from '../utils/request/requestHeader';

export async function getProvider() {
  return request(createTheURL(Config.API.PROVIDER, 'all'), {
    method: 'GET',
  });
}

export async function getRole(params) {
  return request(createTheURL(Config.API.ROLE, 'allrole'), {
    method: 'GET',
    body: params,
  });
}

export async function getDpartment() {
  return request(createTheURL(Config.API.DEPARTMENT, 'all'), {
    method: 'GET',
  });
}

export async function getGoodsType() {
  return request(createTheURL(Config.API.GOODSTYPE, 'all'), {
    method: 'GET',
  });
}

export async function getEduDepartment(param){
  return request(createTheURL(Config.API.EDEPARTMENT,'all'),{
    method: 'GET',
    body:param,
  })
}

export async function getUserUsedWord(param){
  return request(createTheURL(Config.API.DICT,'list'),{
    method: 'GET',
    body:param,
  })
}

export async function getSchoolData(param){
  return request(createTheURL(Config.API.SCHOOL,'all'),{
    method: 'GET',
    body:param,
  })
}

export async function getBasic(param){
  return request(createTheURL(Config.API.DICTS,'list'),{
    method: 'GET',
    body:param,
  })
}

export async function getAllUser(param){
  return request(createTheURL(Config.API.USER,'all'),{
    method: 'GET',
    body:param,
  })
}
