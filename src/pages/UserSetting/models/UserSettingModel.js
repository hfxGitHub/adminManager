import { message } from 'antd';
import { getUserList,changeInfo,addUser,delUser,getUser,resetPassWord,getAllRole} from '../../../services/UserSetting';

export default {
  namespace:'UserSetting',
  state: {
    UsersData: [],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
    selectedRows:[],//用来处理新建之后的表格选中问题
  },
  effects: {
    * getList({ payload }, { call, put }) {//分页获取用户的信息
      payload = payload ? payload : { currentpage : 1 };
      const response = yield call(getUserList, payload);
      const { data : { rows, pageNumber, pageSize, total, totalPage } } = response;
      const list = rows;
      const pagination = {
        currentPage : pageNumber,
        pageSize : pageSize,
        total : total,
      };
      yield put({
        type : 'save',
        payload : {
          UsersData:list,
          pagination:pagination
        },
      });
    },

    *changeInfo({payload},{call,put}){
      const response = yield call(changeInfo, payload.data);
      if(response.code===0){
        message.success('信息修改成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('信息修改失败')
      }
    },

    *addUser({payload},{call,put}){
      const response = yield call(addUser, payload.data);
      if(response.code===0){
        message.success('新建用户成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('新建用户失败')
      }
    },

    *delUser({payload},{call,put}){
      const response = yield call(delUser, payload.ids);
      if(response.code===0){
        message.success('删除成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('删除失败')
      }
    },

    *getUser({payload},{call,put}){
      const response=yield call(getUser,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            detailData:response.data
          }
        })
      }
    },

    *resetPassWord({payload},{call,put}){
      const response=yield call(resetPassWord,payload);
      if(response.code===0){
        message.success('密码重置成功')
        yield put({
          type:'getList',
          payload:payload.pagination,
        })
      }
    },

    *getAllRole({payload},{call,put}){
      const respone=yield call(getAllRole);
      yield put({
        type:'save',
        payload:{
          allRoles:respone.data//role 用all之后的数据
        },
      })
    },
    
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
        // UsersData : payload.list,
        // pagination: payload.pagination
      };
    },

    cleanGetDetail(state,{payload}){
      return{
        ...state,
        detailData:{}
      }
    }
  },
};
