import { query as queryUsers } from '@/services/user';
import { routerRedux } from 'dva/router';

export default {
  namespace : 'print',

  state : {
    formPrintData:[],
  },

  effects : {
    * saveData({ payload }, { call, put }) {
      yield put({
        type:'update',
        payload,
      })
      yield put(routerRedux.push('/print/print/view'));
      // dispatch(routerRedux.push({
      //   pathname:'/print/print/view',
      //   state: { selectedRows }
      // }));
    }
  },

  reducers : {
    update(state, action) {
      return {
        ...state,
        ...action,
      };
    },
  },
};
