import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function register(params) {
  return request(createTheURL(Config.API.REGISTER,'apl'), {
    method: 'POST',
    body:params,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getEduDepartment(params) {
  return request(createTheURL(Config.API.EDEPARTMENT,'all'), {
    method: 'GET',
    body:params,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getSchoolTypeData(params) {
  return request(createTheURL(Config.API.DATADICT,'all'), {
    method: 'GET',
    body:params,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getSchoolData(params) {
  return request(createTheURL(Config.API.SCHOOL,'all'), {
    method: 'GET',
    body:params,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}
