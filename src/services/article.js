import request from '@/utils/request/request';
import GLOBAL_URL from '@/utils/ip';

export async function getArticleList(params) {
  return request(`${GLOBAL_URL}/api/article/list`, {
    method: 'GET',
    body: params
  });
}

export async function postArticleAdd(params) {
  return request(`${GLOBAL_URL}/api/article/add`, {
    method: 'POST',
    body: params
  });
}

export async function getArticleAll(params) {
  return request(`${GLOBAL_URL}/api/article/all`, {
    method: 'GET',
    body: params
  });
}

export async function getArticleDel(params) {
  return request(`${GLOBAL_URL}/api/article/del`, {
    method: 'GET',
    body: params
  });
}

export async function postArticleEdit(params) {
  return request(`${GLOBAL_URL}/api/article/list`, {
    method: 'POST',
    body: params
  });
}

export async function getArticleGet(params) {
  return request(`${GLOBAL_URL}/api/article/get`, {
    method: 'GET',
    body: params
  });
}
