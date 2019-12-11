import * as commonService from '@/services/common';
import { message } from 'antd';

export default {
  namespace: 'commonModal',
  state: {
    commonData: [],
    checks: [],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
    editFlag: 0,
    searchInfo: {},
    id: '',
  },
  effects: {
    * fetch({}, { call, put }) {
      const response = yield call(commonService.queryList);
      const { data: { data, pageNumber, pageSize, total } } = response;
      const list = data;
      const pagination = {
        currentPage: pageNumber || 1,
        pageSize: pageSize,
        total: total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: { commonData: result, pagination },
      });

    },
    * edit({ payload }, { call, put }) {
      const response = yield call(commonService.edit, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
    },
    * searchById({ payload }, { call, put }) {
      const response = yield call(commonService.getById, payload);
      const { data: { data, pageNumber, pageSize, total } } = response;
      const list = data;
      const pagination = {
        currentPage: pageNumber || 1,
        pageSize: pageSize,
        total: total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: { commonData: result, pagination },
      });
    },
    * delCommon({ payload }, { call, put }) {
      const response = yield call(commonService.del, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('删除失败');
    },
    * replyCommon({ payload }, { call, put }) {
      const response = yield call(commonService.replyCommon, payload);
      if (response.success == true) {
        message.success('回复成功！');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error(response.errMsg);
      }
    },
    * getDetail({ payload }, { call, put }) {
      const response = yield call(commonService.getDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: {
          data: response.data,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detailData: payload.data,
      };
    },
    saveEditFlag(state, { payload }) {
      return {
        ...state,
        editFlag: payload.editFlag,
      };
    },
    saveId(state, { payload }) {
      return {
        ...state,
        id: payload.id,
      };
    },
  },
};
