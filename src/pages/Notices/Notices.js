import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { ITEMTYPE, EDIT_FLAG } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import NoticesDetail from './NoticesDetail';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import { Card, message, Modal } from 'antd';
import * as utils from '../../utils/utils';
import { IMG_URL } from '../../utils/Enum';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ noticesModal, loading }) => ({
  noticesModal,
  loading,
  loadingList: loading.effects['noticesModal/fetch'],
  loadingUpdate: loading.effects['noticesModal/edit'],
  loadingDelete: loading.effects['noticesModal/delNotice'],
  loadingGetById: loading.effects['noticesModal/getNoticeById'],
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
      type: 'noticesModal/fetch',
    });
  };

  // handleSearch = (params) => {
  //   const { dispatch } = this.props;
  //   console.log(params);
  //   dispatch({
  //     type: 'noticesModal/getNoticeById',
  //     payload : params || {
  //       currentPage : 1,
  //       pageSize : 10,
  //     },
  //   });
  //   const { currentPage, pageSize, ...otherParams } = params;
  //   this.setState({
  //     formValues: { ...otherParams },
  //   });
  // };

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
      type: 'noticesModal/fetch',
      payload: params,
    });
  };

  deleteNotice = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时删除多个目标');
      return;
    }
    console.log(checks[0]);
    Modal.confirm({
      title: '删除公告',
      content: '确定删除该公告吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'noticesModal/delNotice',
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
  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticesModal/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.ADD,
      },
    });
    this.onChangeDrawerVisible(true);
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
      message.error('不能同时对多个公告进行修改!');
      return;
    }
    if (checks[0]) {
      dispatch({
        type: 'noticesModal/saveId',
        payload: {
          id: checks[0].id,
        },
      });
      dispatch({
        type: 'noticesModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'noticesModal/saveDetail',
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
        type: 'noticesModal/saveId',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'noticesModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'noticesModal/saveDetail',
        payload: {
          data: record,
        },
      });
      this.onChangeDrawerVisible(true);
    }
  };


  render() {
    const { noticesModal: { noticesDataData, editFlag, pagination }, loadingList, loadingUpdate } = this.props;
    const { checks, drawerVisible } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'noticeId',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 20,
      },
      {
        title: '公告详情',
        dataIndex: 'noticeDetail',
        key: 'noticeDetail',
        align: 'center',
        width: 60,
      },
      {
        title: '发布时间',
        dataIndex: 'noticeTime',
        key: 'noticeTime',
        align: 'center',
        width: 20,
        render:(val)=>val.substr(0,19)
      },

      {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        width: 140,
      },
    ];
    const title = editFlag?'修改':'新增';

    const contentOptions = {
      closeFunction: this.onCloseDrawer,
      checks,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: title,
      drawerContent: <NoticesDetail {...contentOptions} />,
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
        param: [true, '其他'],
        key: 'REFRESH',
      }],
      patchBtn: [
        {
          func: this.edit,
          param: {},
          key: 'EDIT',
        }, {
          func: this.deleteNotice,
          param: {},
          key: 'DELETE',
        }],
    };
    const searchList = [
      {
        title: '公告id',
        field: 'noticeId',
        type: 'input',
      }
    ];
    return (
      <PageHeaderWrapper title="公告管理">
        {/*<AdvancedSearchForm*/}
          {/*searchList={searchList}*/}
          {/*doSearch={this.handleSearch}*/}
          {/*pagination={pagination}*/}
        {/*/>*/}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={checks}/>
            <StandardTable
              selectedRows={checks}
              loading={loadingList}
              loadingUpdate={loadingUpdate}
              data={noticesDataData}
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
