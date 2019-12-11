import * as orderService from '@/services/order';
import * as drugService from '@/services/drug';
import { message } from 'antd';
import { EDIT_FLAG } from '../../../utils/Enum';


export default {
  namespace: 'orderModal',
  state: {
    orderData: [],
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
    * fetch({  }, { call, put }) {
      const response = yield call(orderService.queryList);
      const { data:{data,pageNumber,pageSize,total} } = response;
      const list=data;
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
        payload: { orderData: result, pagination },
      });

    },
    * getOrderById({ payload }, { call, put }) {
      payload={
        'id':payload.userId
      }
      const response = yield call(orderService.getOrderById, payload);
      const { data:{data,pageNumber,pageSize,total} } = response;
      const list=data;
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
        payload: { orderData: result, pagination },
      });
    },

    * add({ payload }, { call, put }) {
      const response = yield call(orderService.add, payload);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('新增失败');
    },
    * delOrder({ payload }, { call, put }) {
      const response = yield call(orderService.del, payload);
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
      const response = yield call(orderService.edit, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      }
      else
        message.error('修改失败');
    },
    * editImg({payload}, {call, put}) {
      const response = yield call(orderService.queryList, payload);
      yield put({
        type: 'saveImg',
        payload: {
          imgList: response.data.itemTypeImg,
        },
      });
    },

    * getOrderDetailData({ payload }, { call, put }) {
      const response = yield call(orderService.getOrderDetailById, payload.orderId);
      const response2=yield call(drugService.getList);//获取所有药品信息
      let drugData=[];
      response2.data.data.forEach((item)=>{
        drugData.push({
          'k':item.drugId,
          'val':item.drugName
        })
      });
      yield put({
        type: 'saveDetail',
        payload: {
          data: {
            orderDetail:response.data.data,
            order:payload.order,
            drugData:drugData
          },
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
