import * as userService from '@/services/user';
import * as registerService from '@/services/register';
import {message} from 'antd';
import router from 'umi/router';

export default {
  namespace: 'centerModel',

  state: {
    currentUserdata: {},
    visiblePersonInfo: false,
    eduDepartmentData: [],
    schoolData: [],
  },

  effects: {
    * getCurrentUser({payload}, {call, put}) {
      const response = yield call(userService.getCurrentUser, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    * editUser({payload}, {call, put}) {
      const response = yield call(userService.editUser, payload);
      if (response.code == 0) {
        message.success('数据修改成功，请重新登录!');
        router.push(`/user/login`);
      }
      else {
        message.error('数据修改失败!');
      }
    },
    * editPassword({payload}, {call, put}) {
      const response = yield call(userService.editPassword, payload);
      if (response.code == 0) {
        message.success('修改密码成功，请重新登录!');
        router.push(`/user/login`);
      }
      else {
        message.error('修改密码失败!');
      }

    },


  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUserdata: action.payload,
      };
    },
    hiddenModal(state) {
      return {
        ...state,
        visiblePersonInfo: false,
      };
    },
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    showModal(state) {
      return {
        ...state,
        visiblePersonInfo: true,
      };
    },
  },
};
