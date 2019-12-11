import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { EDIT_FLAG, SUGGEST_PUBLIC, PERSONNEL_TYPE } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import CommonDetail from './commonDetail';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import { Card, message, Row, Col, Icon, Modal } from 'antd';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ commonModal, loading }) => ({
  commonModal,
  loading,
  loadingList: loading.effects['commonModal/fetch'],
  loadingUpdate: loading.effects['commonModal/edit'],
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      drawerVisible: false,
    };
  }

  componentDidMount() {
    this.listPage();
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModal/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });

  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    console.log(params);
    params.pageSize=params.pageSize==0?10:params.pageSize;
    dispatch({
      type: 'commonModal/searchById',
      payload:params ,
    });
    const { currentPage, pageSize, ...otherParams } = params;
    this.setState({
      formValues: { ...otherParams },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
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
      type: 'commonModal/fetch',
      payload: params,
    });
  };

  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };

  handleStateChange = (value) => {

  };

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };

  edit = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时对多个意见查看!');
      return;
    }
    if (checks[0]) {
      dispatch({
        type: 'commonModal/saveId',
        payload: {
          id: checks[0].id,
        },
      });
      dispatch({
        type: 'commonModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'commonModal/saveDetail',
        payload: {
          data: checks[0],
        },
      });
      this.onChangeDrawerVisible(true);
    }
  };

  deleteCommon = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时删除多个目标');
      return;
    }
    Modal.confirm({
      title: '删除留言',
      content: '确定删除该留言吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'commonModal/delCommon',
          payload: checks[0].commonId,
        });
      },
    });
    this.setState({
      checks: [],
    });
  };

  onCloseDrawer = () => {
    this.onChangeDrawerVisible(false);
  };

  doubleClickRow = (record) => {
    const { dispatch } = this.props;
    if (record) {
      dispatch({
        type: 'commonModal/saveId',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'commonModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'commonModal/saveDetail',
        payload: {
          data: record,
        },
      });
      this.onChangeDrawerVisible(true);
    }
  };


  render() {
    const { commonModal: { commonData, editFlag, pagination }, loadingList, loadingUpdate } = this.props;
    const { checks, drawerVisible } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 30,
      },
      {
        title: '留言内容',
        dataIndex: 'commonDetail',
        key: 'commonDetail',
        align: 'center',
        width: 200,
      },
      {
        title: '留言时间',
        dataIndex: 'commonTime',
        key: 'commonTime',
        align: 'center',
        width: 80,
      },
      {
        title: '留言者(用户)ID',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        width: 80,
      },
    ];
    const title = '详情';

    const contentOptions = {
      closeFunction: this.onCloseDrawer,
      checks,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: title,
      drawerContent: <CommonDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onChangeDrawerVisible,
    };
    const btnList = {
      primaryBtn: [
        {
          func: this.listPage,
          param: [true, '其他'],
          key: 'REFRESH',
        }],
      patchBtn: [
        {
          func: this.edit,
          param: {},
          key: 'EYE',
        }, {
          func: this.deleteCommon,
          param: {},
          key: 'DELETE',
        }],
    };
    const searchList = [
      {
        title: '用户ID',
        field: 'id',
        type: 'input',
      },
    ];
    return (
      <PageHeaderWrapper title="留言管理">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.handleSearch}
          pagination={pagination}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={checks}/>
            <StandardTable
              selectedRows={checks}
              loading={loadingList}
              loadingUpdate={loadingUpdate}
              data={commonData}
              rowKey={record => record.id}
              onSelectRow={this.onSelectChange}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.doubleClickRow(record);
                },
              })}
            />
          </div>
        </Card>
        <AdvancedDrawer {...drawerOption}/>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
