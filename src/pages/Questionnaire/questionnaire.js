import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Popover, message, Modal} from 'antd';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { EDIT_FLAG, OPERATE_TYPE } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import QuestionDetail from './questionnaireDetail'
import { phoneRegular } from '../../utils/regular';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({questionnaireModal, loading}) => ({
  questionnaireModal,
  loading: loading.models.questionnaireModal,
  loadingList: loading.effects['questionnaireModal/fetch'],
  loadingDelete: loading.effects['questionnaireModal/del'],
  loadingSearch: loading.effects['questionnaireModal/searchById'],
  loadingGetQuestionData: loading.effects['questionnaireModal/getQuestionData'],
}))
class Questionnaire extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      formValues:{},
      drawerVisible: false,
    };
  }

  componentDidMount() {
    this.listPage();
  }

  listPage = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'questionnaireModal/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });

  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'questionnaireModal/searchById',
      payload : params || {
        currentPage : 1,
        pageSize : 10,
      },
    });
    const { currentPage, pageSize, ...otherParams } = params;
    this.setState({
      formValues : { ...otherParams },
    });
  };

  checkDetail=()=>{
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时对多条问卷查看!');
      return;
    }
    if (checks[0]) {
      //获取问题数据
      this.getQuestionData(checks[0].questionnaireId);
    }
  };
  deleteItem = questionnaire => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionnaireModal/del',
      payload: questionnaire,
    });
    this.setState({
      checks: [],
    });
  };
  deleteDetail = () => {
    const { checks } = this.state;
    if (checks.length != 1) {
      message.error('不能同时删除多条问卷信息!');
      return;
    }
    Modal.confirm({
      title: '删除该问卷',
      content: '确定删除该问卷吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(checks[0]),
    });
  };

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };
  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionnaireModal/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.ADD,
      },
    });
    this.onChangeDrawerVisible(true);
  };

  doubleClickRow = (record) => {
    const { dispatch } = this.props;
    if (record) {
      dispatch({
        type: 'questionnaireModal/saveId',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'questionnaireModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'questionnaireModal/saveDetail',
        payload: {
          data: record,
        },
      });
      this.onChangeDrawerVisible(true);
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'questionnaireModal/fetch',
      payload: params,
    });
  };

  handleStateChange = (value) => {

  };

  onCloseDrawer = () => {
    const {dispatch} = this.props;
    dispatch({
      type:'questionnaireModal/removeQuestionData',
      payload:''
    });
    this.onChangeDrawerVisible(false);
  };
  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };
  getQuestionData = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionnaireModal/getQuestionData',
      payload: id,
    });
    dispatch({
      type: 'questionnaireModal/saveEditFlag',
      payload: {
        editFlag: 3,
      },
    });
    this.onChangeDrawerVisible(true);
  };
  edit = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时修改多个目标!');
      return;
    }
    if (checks[0]) {
      dispatch({
        type: 'questionnaireModal/saveId',
        payload: {
          id: checks[0].id,
        },
      });
      dispatch({
        type: 'questionnaireModal/saveDetail',
        payload: {
          data: checks[0],
        },
      });
      dispatch({
        type: 'questionnaireModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });

      this.onChangeDrawerVisible(true);
    }
  };

  render() {
    const {questionnaireModal: {questionnaireData, editFlag, pagination}, loadingList, loadingUpdate} = this.props;
    const {checks,drawerVisible} = this.state;
    const columns = [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'left',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        title: '问卷ID',
        dataIndex: 'questionnaireId',
        key: 'questionnaireId',
        align: 'center',
        width: 50,
      },
      {
        title: '问卷内容',
        dataIndex: 'questionnaireTitle',
        key: 'questionnaireTitle',
        align: 'center',
        width: 50,
      },
    ];
    let title='新增';
    if(editFlag==0){
      title='新增';
    }else if(editFlag==1){
      title='修改';
    }else{
      title='问题详情';
    }
    const contentOptions = {
      updateFunction: this.updateGuide,
      closeFunction: this.onCloseDrawer,
      checks,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: title,
      drawerContent: <QuestionDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onChangeDrawerVisible,
    };
    const btnList = {
      primaryBtn: [{
        func: this.add,
        param: [true, '其他'],
        key: 'ADD',
      },{
        func: this.listPage,
        param: {},
        key: 'REFRESH',
      }],
      patchBtn: [
        {
          func: this.checkDetail,
          param:{},
          key: 'EYE',
        },{
          func: this.edit,
          param: {},
          key: 'EDIT',
        }, {
          func: this.deleteDetail,
          param: {},
          key: 'DELETE',
        }]
    };
    const searchList = [
      {
        title: '问卷ID',
        field: 'questionnaireId',
        type: 'input',
      },
    ];
    return (
      <PageHeaderWrapper title="问卷管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={checks}/>
            <StandardTable
              selectedRows={checks}
              loading={loadingList}
              loadingUpdate={loadingUpdate}
              data={questionnaireData}
              rowKey={record => record.id}
              onSelectRow={this.onSelectChange}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.doubleClickRow(record)
                }
              })}
              // rowSelection={null}
            />
          </div>
        </Card>
        <AdvancedDrawer {...drawerOption}/>
      </PageHeaderWrapper>
    );
  }
}

export default Questionnaire;
