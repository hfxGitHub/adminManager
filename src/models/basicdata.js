import * as basicDataAPI from '@/services/basicdata';
import * as basicData from '@/services/dataDictionary';

export default {
  namespace: 'basicdata',

  state: {
    providerData: [],
    roleData: [],
    departmentData: [],
    goodsTypeData:[],
    eduDepartmentData:[],
    userSettingSex:[],
    userSettingUserStatus:[],
    schoolData:[],
    schoolType:[],
    gDictData:[],//全局的Dict数据
  },

  effects: {
    * getProviderData(_, { call, put }) {
      const response = yield call(basicDataAPI.getProvider);
      yield put({
        type: 'saveProvider',
        payload: response.data,
      });
    },
    * getDepartmentData({ payload }, { call, put }) {
      const response = yield call(basicDataAPI.getDpartment, payload);
      yield put({
        type: 'saveDepartment',
        payload: response.data,
      });
    },
    * getGoodsType({ payload }, { call, put }) {
      const response = yield call(basicDataAPI.getGoodsType, payload);
      yield put({
        type: 'saveGoodsType',
        payload: response.data,
      });
    },
    * getRoleData({ payload }, { call, put }) {
      const response = yield call(basicDataAPI.getRole, payload);
      yield put({
        type: 'saveRole',
        payload: response.data,
      });
    },
    *getEduDepartment({payload},{call,put}){
      const response = yield call(basicDataAPI.getEduDepartment, payload);
      yield put({
        type: 'saveEduDepartment',
        payload: response.data,
      });
    },

    // *getUserUsedWord({payload},{call,put}){
    //   const responseSex=yield call(basicDataAPI.getUserUsedWord,payload.sex);
    //   const responseUserStatus=yield call(basicDataAPI.getUserUsedWord,payload.userStatus);
    //   const responseSchoolType=yield call(basicDataAPI.getUserUsedWord,payload.schoolType);
    //   const {rows:sex}=responseSex.data;
    //   const {rows:userStatus}=responseUserStatus.data;
    //   const {rows:schoolType}=responseSchoolType.data;
    //   yield put({
    //     type:'saveUserSettingUsedWord',
    //     payload:{
    //       sex,
    //       userStatus,
    //       schoolType,
    //     }
    //   })
    // },

    *getSchool({payload},{call,put}){
      const response=yield call(basicDataAPI.getSchoolData);
      yield put({
        type:'saveSchoolData',
        payload:response.data
      })
    },

    * getDict({payload}, {call, put}) {
      const response = yield call(basicData.getDictionaryAll, payload);
      yield put({
        type: 'saveDict',
        payload: response.data,
      });
    },
    ///获取所有的用户信息
    * getUserList({payload}, {call, put}) {
      const response = yield call(basicDataAPI.getAllUser, payload);
      yield put({
        type: 'save',
        payload: response.data,
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
    saveProvider(state, action) {
      return {
        ...state,
        providerData: action.payload,
      };
    },
    saveRole(state, action) {
      return {
        ...state,
        roleData: action.payload,
      };
    },
    saveDepartment(state, action) {
      return {
        ...state,
        departmentData: action.payload,
      };
    },
    saveGoodsType(state, action) {
      return {
        ...state,
        goodsTypeData: action.payload,
      };
    },
    saveEduDepartment(state,action){
      return{
        ...state,
        eduDepartmentData:action.payload,
      }
    },
    saveUserSettingUsedWord(state,{payload}){
      return{
        ...state,
        userSettingSex:payload.sex,
        userSettingUserStatus: payload.userStatus,
        schoolType:payload.schoolType
      }
    },
    saveSchoolData(state,{payload}){
      return {
        ...state,
        schoolData:payload
      }
    },
    saveDict(state, {payload}) {
      return {
        ...state,
        gDictData:payload,
      };
    },

  },
};
