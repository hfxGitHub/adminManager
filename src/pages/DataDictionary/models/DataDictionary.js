import {getDictionaryList,getDataDictionary,dataChangeInfo,addDataDic,delData} from '../../../services/dataDictionary';
import {message} from 'antd';
export default {
  namespace:'DataDictionary',
  state:{
    data:[],
    pagination:{},
    DiationaryDetail:{}
  },

  effects:{
    *fetch({payload},{call,put}){
      const response=yield call(getDictionaryList,payload);
      const { data : { rows, pageNumber, pageSize, total, totalPage } } = response;
      const list = rows;
      const pagination = {
        currentPage : pageNumber,
        pageSize : pageSize,
        total : total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type:'save',
        payload:{
          data:result,
          pagination:pagination
        }
      })
    },

    *changeInfo({payload},{call,put}){
      const response=yield call(dataChangeInfo,payload.data);
      if(response.code==0){
        message.success('数据更新成功')
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    },

    *getDataDetail({payload},{call,put}){
      const reponse=yield call(getDataDictionary,payload);
      yield put({
        type:'save',
        payload:{
          DiationaryDetail:reponse.data
        }
      })
    },

    *delData({payload},{call,put}){
      const response=yield call(delData,payload.data);
      if(response.code==0){
        message.success('数据删除成功');
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    },

    *addDataDic({payload},{call,put}){
      const response=yield call(addDataDic,payload.data);
      if(response.code==0){
        message.success('数据新增成功');
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    }
  },

  reducers:{
    save(state,{payload}){
      return(
        {
          ...state,
          ...payload,
        }
      )
    },
    cleanGetDetail(state,{payload}){
      return {
        ...state,
        DiationaryDetail:{}
      }
    }
  },
}
