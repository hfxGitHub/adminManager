import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';
import Config from '../../config/api';

//获取公告list
export async function queryList() {
  return request(createTheURL(Config.API.NOTICE, 'all'), {
    method: 'GET',
    // body: params,
  });
}

//更改公告
export async function edit(params) {
  return request(createTheURL(Config.API.NOTICE), {
    method: 'PUT',
    body: params,
  });
}

//删除公告
export async function del(params) {
  console.log(params);
  return request(createTheURL(Config.API.NOTICE), {
    method: 'DELETE',
    body: params,
  });
}

//查询最新公告
export async function getDetail(params) {
  return request(createTheURL(Config.API.NOTICE, 'new'), {
    method: 'GET',
    body: params,
  });
}
//增加公告
export async function addNotice(params) {
  return request(createTheURL(Config.API.NOTICE), {
    method: 'POST',
    body: params,
  });
}

//根据id查询公告
export async function getNoticeById(params) {
  return request(createTheURL(Config.API.NOTICE,params.noticeId), {
    method: 'GET',
    // body: params,
  });
}


