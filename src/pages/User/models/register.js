import { register, getEduDepartment, getSchoolData, getSchoolTypeData } from '../../../services/register';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';


export default {
  namespace: 'register',

  state: {
    status: undefined,
    eduDepartmentData: [],
    schoolData: [],
    schoolTypeData: [],
  },

  effects: {
    * submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response.code !== 0) {
        message.error(response.msg);
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    * getEduDepartment({ payload }, { call, put }) {
      const response = yield call(getEduDepartment, payload);
      yield put({
        type: 'saveEduDepartment',
        payload: response.data,
      });
    },
    * getSchoolTypeData({ payload }, { call, put }) {
      const response = yield call(getSchoolTypeData, payload);
      yield put({
        type: 'saveSchoolTypeData',
        payload: response.data,
      });
    },
    * getSchoolData({ payload }, { call, put }) {
      const response = yield call(getSchoolData, payload);
      yield put({
        type: 'saveSchoolData',
        payload: response.data,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.code,
      };
    },
    saveEduDepartment(state, action) {
      return {
        ...state,
        eduDepartmentData: action.payload,
      };
    },
    saveSchoolTypeData(state, action) {
      return {
        ...state,
        schoolTypeData: action.payload,
      };
    },
    saveSchoolData(state, action) {
      return {
        ...state,
        schoolData: action.payload,
      };
    },
  },
};
