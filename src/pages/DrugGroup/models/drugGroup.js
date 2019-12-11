import * as drugGroupServive from '@/services/drugGroup';
import { message } from 'antd';

export default {
  namespace: 'drugGroupModal',
  state: {
    drugData: [],
    groupData: [],
    editFlag: 0,
    id: '',
    visible: false,
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
  },
  effects: {
    * fetch({}, { call, put }) {
      const response = yield call(drugGroupServive.allGroup);
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
        payload: { drugData: result, pagination },
      });

    },
    * edit({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.edit, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
    },
    * del({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.del, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
    },
    * allGroup({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.allGroup, payload);
      yield put({
        type: 'saveGroup',
        payload: {groupData:response.data.data},
      });
    },
    * add({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.add, payload);
      if (response.success === true) {
        message.success('添加成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },

    * deleteDetail({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.del, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },
    * newGroup({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.newGroup, payload);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },
    * searchById({ payload }, { call, put }) {
      const response = yield call(drugGroupServive.getDrugById, payload);
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
        payload: { drugData: result, pagination },
      });
    },

    * getDetail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: {
          data: payload,
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
        detailData: payload,
      };
    },
    showModal(state) {
      return {
        ...state,
        visible: true,
      };
    },
    saveGroup(state,{payload}) {
      return {
        ...state,
        ...payload,
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
    hiddenModal(state) {
      return {
        ...state,
        visible: false,
      };
    },
  },
};
