import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getDictionaryList(params) {
  return request(createTheURL(Config.API.DICT, 'list'), {
    method: 'GET',
    body:params
  });
};

export async function getDictionaryAll(params) {
  return request(createTheURL(Config.API.DICT, 'all'), {
    method: 'GET',
    body:params
  });
};

export async function getDataDictionary(params) {
  return request(createTheURL(Config.API.DICT, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function dataChangeInfo(params) {
  return request(createTheURL(Config.API.DICT, 'edit'), {
    method: 'PUT',
    body:params
  });
};


export async function addDataDic(params) {
  return request(createTheURL(Config.API.DICT, 'add'), {
    method: 'POST',
    body:params
  });
};

export async function delData(params) {
  return request(createTheURL(Config.API.DICT, 'del'), {
    method: 'DELETE',
    body:params
  });
};
