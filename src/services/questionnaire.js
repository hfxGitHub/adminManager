import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import remoteLinkAddress from '../utils/ip';

export async function queryList(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE, 'all'), {
    method: 'GET',
    body: params
  });
}
export async function editQuestionnaire(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE, ''), {
    method: 'PUT',
    body: params
  });
}
export async function addQuestionnaire(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE,''), {
    method: 'POST',
    body: params
  });
}

export async function delQuestionnaire(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE,'')+'/'+params.questionnaireId, {
    method: 'DELETE',
    body: params
  });
}
export async function getQuestionnaireById(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE,'')+'/'+params.questionnaireId, {
    method: 'GET',
    body: params
  });
}
//获取问题详情
export async function getQuestionData(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE,'question')+'/'+params, {
    method: 'GET',
    // body: params
  });
}
//新增问题
export async function addQuestion(params) {
  return request(remoteLinkAddress()+'/question', {
    method: 'POST',
    body: params
  });
}
//删除问题
export async function delQuestion(params) {
  return request(remoteLinkAddress()+'/question'+'/'+params, {
    method: 'DELETE',
  });
}
//修改问题
export async function editQuestion(params) {
  return request(remoteLinkAddress()+'/question', {
    method: 'PUT',
  });
}
//获取用户回复
export async function getResponse(params) {
  return request(createTheURL(Config.API.QUESTIONNAIRE,'detail'), {
    method: 'GET',
  });
}
