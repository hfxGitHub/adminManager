import * as questionnaireService from '@/services/Questionnaire';
import { message } from 'antd';

export default {
  namespace: 'questionnaireModal',
  state: {
    questionnaireData: [],
    questionData:[],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
    editFlag: 0,
    selectItem: 0,//当前选中需要修改和删除的ID
  },
  effects: {
    * fetch({  }, { call, put }) {
      const response = yield call(questionnaireService.queryList );
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
        payload: { questionnaireData: result, pagination },
      });

    },
    * edit({ payload }, { call, put }) {
      const response = yield call(questionnaireService.editQuestionnaire, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.error('修改失败');
    },
    * add({ payload }, { call, put }) {
      const response = yield call(questionnaireService.addQuestionnaire, payload);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.error('新增失败');
    },
    * del({ payload }, { call, put }) {
      const response = yield call(questionnaireService.delQuestionnaire, payload);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else
        message.error('删除失败');
    },
    * addQuestion({ payload }, { call, put }) {
      const response = yield call(questionnaireService.addQuestion, payload);
      if (response.success === true) {
        message.success('新增成功');
        yield put({
          type: 'getQuestionData',
          payload:payload.questionnaireId
        });
      } else
        message.error('新增失败');
    },
    * deleteQuestion({ payload }, { call, put }) {
      const response = yield call(questionnaireService.delQuestion, payload.questionId);
      if (response.success === true) {
        message.success('删除成功');
        yield put({
          type: 'getQuestionData',
          payload:payload.questionnaireId
        });
      } else
        message.error('删除失败');
    },
    * getResponse({ payload }, { call, put }) {
      const response = yield call(questionnaireService.getResponse);
      if (response.success === true) {
        // yield put({
        //   type: 'getQuestionData',
        //   payload:payload.questionnaireId
        // });
      } else
        message.error('获取回复数据失败');
    },
    * editQuestion({ payload }, { call, put }) {
      const response = yield call(questionnaireService.addQuestion, payload);
      if (response.success === true) {
        message.success('修改成功');
        yield put({
          type: 'getQuestionData',
          payload:payload.questionnaireId
        });
      } else
        message.error('修改失败');
    },
    //获取所有问题数据
    * getQuestionData ({ payload }, { call, put }) {
      const response = yield call(questionnaireService.getQuestionData, payload);
      const response2 = yield call(questionnaireService.getResponse);
      if (response.success === true) {
        const { data: { data, pageNumber, pageSize, total } } = response;
        let list = data;
        if(list.length==0){
          list[0]={
            questionId:-1
          }
        }
        list[0].responseData=[];
        const questionId=list[0].questionId;
        if(response2.success === true){
          const _responseData=response2.data.data.list;
          let listData=[];
          _responseData.forEach((item)=>{
            if(item.questionId==questionId){
              listData.push(item);
            }
          });
          list[0].responseData=listData;
        }
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
          payload:{ questionData: result, pagination }
        });
      } else
        message.error('查看失败');
    },
    * searchById({ payload }, { call, put }) {
      const response = yield call(questionnaireService.getQuestionnaireById, payload);
      const { data: { data, pageNumber, pageSize, total } } = response;
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
        type: 'saveQuestion',
        payload: result,
      });
    },

    * getLog({payload}, {call, put}) {
      const response = yield call(questionnaireService.getDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: {
          data: response.data,
        },
      });
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },

    saveDetail(state, {payload}) {
      return {
        ...state,
        detailData: payload.data,
      };
    },

    saveQuestion(state,{paylaod}) {
      return{
        ...state,
        questionData:paylaod,
      }
    },
removeQuestionData(state,{payload}) {
  return{
    ...state,
    questionData:[],
  }
},
    saveEditItem(state, {payload}) {
      return {
        ...state,
        selectItem: payload.id,
      };
    },
    saveEditFlag(state, {payload}) {
      return {
        ...state,
        editFlag: payload.editFlag,
      };
    },
  },
};
