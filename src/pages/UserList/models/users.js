import { message } from 'antd';
import {
  getUserList,
  getAllrole,
  updateUser,
  getDepartmentList,
  getUser,
  deleteUser,
  addUser,
} from '../../../services/user';

export default {
  state : {
    userData : [],
    roleData : [],
    departmentData : [],
    pagination : {
      total : 0,
      currentPage : 1,
      pageSize : 10,
    },
    detailData : {},
    editFlag : 0,
    selectItem : 0,//当前选中需要修改和删除的ID
  },
  effects : {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      yield put({
        type : 'save',
        payload : response,
      });
    },

    * allrole(_, { call, put }) {
      const response = yield call(getAllrole);
      yield put({
        type : 'saveData',
        payload : { ...response, _type : 'roleData' },
      });
    },

    * departmentList(_, { call, put }) {
      const response = yield call(getDepartmentList);
      yield put({
        type : 'saveData',
        payload : { ...response, _type : 'departmentData' },
      });
    },

    * UpdateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload);
      message.success('success');
      yield put({
        type : 'fetch',
      });
    },

    * getUser({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type : 'saveDetail',
        payload : {
          data : response.data,
        },
      });
    },

    * deleteUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      yield put({
        type : 'fetch',
      });
    },
    * addUser({ payload }, { call, put }) {
      const response = yield call(addUser, payload);
      if (response.code === 0) {
        message.success('新增成功');
        yield put({
          type : 'fetch',
        });
      }
    },
  },
  reducers : {
    save(state, { payload }) {
      const { data : { rows, pageSize, total, pageNumber } } = payload;
      return {
        ...state,
        userData : rows,
        pagination : {
          pageSize,
          total,
          currentPage : pageNumber,
        },
      };
    },
    saveEditFlag(state, { payload }) {
      return {
        ...state,
        editFlag : payload.editFlag,
      };
    },
    saveData(state, { payload }) {
      const { data } = payload;
      const temp = { ...state };
      temp[payload._type] = data;
      return temp;
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detailData : payload.data,
      };
    },
    saveEditItem(state, { payload }) {
      return {
        ...state,
        selectItem : payload.id,
      };
    },
  },
};
