import * as userService from '@/services/user';
import { message } from 'antd';
import { EDIT_FLAG } from '../../../utils/Enum';


export default {
  namespace: 'userModal',
  state: {
    userData: [],
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
    selectItem: 0,
    currentRow: {
      file: '',
      id: '',
    },
  },
  effects: {
    * fetch({}, { call, put }) {
      const response = yield call(userService.getUserList);
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
        payload: { userData: result, pagination },
      });

    },

    * edit({ payload }, { call, put }) {
      const response = yield call(userService.editUser, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('修改失败');
    },
    * searchById({ payload }, { call, put }) {
      const response = yield call(userService.getUser, payload);
      const { data: { data, pageNumber, pageSize, total } } = response;
      const list = [data];
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
        payload: { userData: result, pagination },
      });
    },
    * deleteUser({ payload }, { call, put }) {
      const response = yield call(userService.deleteUser, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
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
    saveImg(state, { payload }) {
      return {
        ...state,
        ...payload,
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
