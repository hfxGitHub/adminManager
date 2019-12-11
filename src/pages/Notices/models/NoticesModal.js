import * as NoticeServer from '@/services/Notices';
import { message } from 'antd';
import { EDIT_FLAG } from '../../../utils/Enum';


export default {
  namespace: 'noticesModal',
  state: {
    noticesDataData: [],
    checks: [],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
    editFlag: 0,
    searchInfo:{},
    id:'',
    selectItem: 0,
    currentRow: {
      file: '',
      id:"",
    },
    imgList:[],
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(NoticeServer.queryList);
      let { data: { data, pageNumber, pageSize, total } } = response;
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
        payload: { noticesDataData: result, pagination },
      });

    },
    * getNoticeById({ payload }, { call, put }) {
      const response = yield call(NoticeServer.getNoticeById,payload);
      let { data: { data, pageNumber, pageSize, total } } = response;
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
        payload: { noticesDataData: result, pagination },
      });

    },


    * delNotice({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(NoticeServer.del, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('删除失败');
    },

    * edit({ payload }, { call, put }) {
      const response = yield call(NoticeServer.edit, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('修改失败');
    },

    * add({ payload }, { call, put }) {
      const response = yield call(NoticeServer.addNotice, payload);
      console.log(response);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('新增失败');
    },
    * editImg({payload}, {call, put}) {
      const response = yield call(NoticeServer.queryList, payload);
      yield put({
        type: 'saveImg',
        payload: {
          imgList: response.data.itemTypeImg,
        },
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
    saveEditFlag(state, { payload }) {
      return {
        ...state,
        editFlag: payload.editFlag,
      };
    },
    saveImg(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    saveId(state, {payload}) {
      return {
        ...state,
        id: payload.id,
      };
    },
  },
};
