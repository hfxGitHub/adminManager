import { query as queryUsers } from '@/services/user';
import { queryCurrent } from '@/services/api';
import { routerRedux } from 'dva/router';
import * as basicDataAPI from '@/services/basicdata';

export default {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {},
    currentData: {},
    userData: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      const { success } = response;
      if (success) {
        const { data } = response;
        const { nickname } = data;
        const _currentUser = {
          name: nickname,
          unreadCount: 8,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        };
        yield put({
          type: 'saveCurrentUser',
          payload: _currentUser,
        });
        yield put({
          type: 'saveUserData',
          payload: data,
        });
        yield put(routerRedux.push('/dashboard'));
      } else {
        yield put(routerRedux.push('/user/login'));
      }
    },
    * getUserData(_, { call, put }) {
      const response = yield call(queryCurrent);
      const { code } = response;
      if (code == 0) {
        yield put({
          type: 'saveUserData',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveUserData(state, action) {
      return {
        ...state,
        userData: action.payload,
      };
    },
  },
};
