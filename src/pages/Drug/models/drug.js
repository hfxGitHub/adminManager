import * as drugServive from '@/services/drug';
import { message } from 'antd';

export default {
  namespace: 'drugModal',
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
      const response = yield call(drugServive.getList);
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
      const response = yield call(drugServive.edit, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
    },
    * deleteDrug({ payload }, { call, put }) {
      const response = yield call(drugServive.delDrug, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success('修改失败');
    },
    * allGroup({ payload }, { call, put }) {
      const response = yield call(drugServive.allGroup, payload);
      yield put({
        type: 'saveGroup',
        payload: {groupData:response.data.data},
      });
    },
    * add({ payload }, { call, put }) {
      const response = yield call(drugServive.add, payload);
      if (response.success === true) {
        message.success('添加成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },

    * deleteDetail({ payload }, { call, put }) {
      const response = yield call(drugServive.del, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },
    * newGroup({ payload }, { call, put }) {
      const response = yield call(drugServive.newGroup, payload);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.success(response.msg);
    },
    * searchById({ payload }, { call, put }) {
      const response = yield call(drugServive.getDrugById, payload);
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
        detailData: payload.data,
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
