import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { EDIT_FLAG } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import UserDetail from './userDetail';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import { Card, message, Modal } from 'antd';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ userModal, loading }) => ({
  userModal,
  loading,
  loadingList: loading.effects['userModal/fetch'],
  loadingUpdate: loading.effects['userModal/edit'],
  loadingGET: loading.effects['userModal/getOrderById'],
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
      type: 'userModal/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userModal/searchById',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
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
      type: 'userModal/fetch',
      payload: params,
    });
  };

  deleteUser = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时删除多个目标');
      return;
    }
    Modal.confirm({
      title: '删除用户',
      content: '确定删除该用户吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'userModal/deleteUser',
          payload: checks[0],
        });
      },
    });
  };

  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
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
      message.error('不能同时对多个订单进行修改!');
      return;
    }
    if (checks[0]) {
      dispatch({
        type: 'userModal/saveId',
        payload: {
          id: checks[0].id,
        },
      });
      dispatch({
        type: 'userModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'userModal/saveDetail',
        payload: {
          data: checks[0],
        },
      });

      this.onChangeDrawerVisible(true);
    }
  };

  onCloseDrawer = () => {
    this.onChangeDrawerVisible(false);
  };

  handleStateChange = (value) => {

  };

  doubleClickRow = (record) => {
    const { dispatch } = this.props;
    if (record) {
      dispatch({
        type: 'userModal/saveId',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'userModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'userModal/saveDetail',
        payload: {
          data: record,
        },
      });
      this.onChangeDrawerVisible(true);
    }
  };


  render() {
    const { userModal: { userData, editFlag, pagination }, loadingList, loadingUpdate } = this.props;
    const { checks, drawerVisible } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 20,
      },
      {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        width: 60,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 80,
      },
      {
        title: '性别',
        dataIndex: 'gener',
        key: 'gener',
        align: 'center',
        width: 40,
        render: function(v) {
          const gener = v == true ? '男' : '女';
          return gener;
        },
      },
      {
        title: '用户身份证号码',
        dataIndex: 'idCardNumber',
        key: 'idCardNumber',
        align: 'center',
        width: 140,
      },
      {
        title: '用户电话号码',
        dataIndex: 'tellNumber',
        key: 'tellNumber',
        align: 'center',
        width: 140,
      },
      {
        title: '用户身份',
        dataIndex: 'userType',
        key: 'userType',
        align: 'center',
        width: 140,
        render: function(v) {
          const type = v == false ? '普通用户' : '管理员';
          return type;
        },
      },
    ];
    const title = '修改';

    const contentOptions = {
      closeFunction: this.onCloseDrawer,
      checks,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: title,
      drawerContent: <UserDetail {...contentOptions} />,
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
          key: 'EDIT',
        }, {
          func: this.deleteUser,
          param: {},
          key: 'DELETE',
        }],
    };
    const searchList = [
      {
        title: '用户id',
        field: 'userId',
        type: 'input',
      },
    ];
    return (
      <PageHeaderWrapper title="用户管理">
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
              data={userData}
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
