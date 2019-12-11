import { getArticleList, postArticleAdd, getArticleAll, getArticleDel, getArticleGet, postArticleEdit } from '@/services/article';

export default {
  namespace: 'article',

  state: {
    articleData: [],
    pagination : {
      pageSize : 10, // 一页多少条
      pageNum: 1,
      current :0,  // 当前页
      total:0,  // 总条数
      pages:0,  // 一共多少页
      page: 1,
    },
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getArticleList, payload);
      yield put({
        type: 'save',
        payload: response.data
      });
    }
  },

  reducers: {
    save(state, action) {
      const { rows, pageNumber, totalPage, pageSize, total } = action.payload;
      return {
        ...state,
        articleData: rows,
        pagination: {
          pages: totalPage,
          pageSize,
          total,
          current: pageNumber
        },
      };
    }
  },
};
