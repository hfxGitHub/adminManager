import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { EDIT_FLAG } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import OrderDetail from './orderDetail';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import { Card, message, Modal } from 'antd';
import * as utils from '../../utils/utils';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ orderModal, loading }) => ({
  orderModal,
  loading,
  loadingList: loading.effects['orderModal/fetch'],
  loadingDelete: loading.effects['orderModal/delOrder'],
  loadingGET: loading.effects['orderModal/getOrderById'],
  loadingGetDetail: loading.effects['orderModal/getOrderDetailData'],
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
      type: 'orderModal/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderModal/getOrderById',
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
      type: 'orderModal/fetch',
      payload: params,
    });
  };

  deleteOrder = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时删除多个目标');
      return;
    }
    Modal.confirm({
      title: '删除订单',
      content: '确定删除该订单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'orderModal/delOrder',
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

  checkDetail=()=>{
    const { dispatch } = this.props;
    const { checks } = this.state;
    if (checks.length > 1) {
      message.error('不能同时对多条订单进行查看!');
      return;
    }
    if (checks[0]) {
      //获取问题数据
      this.getOrderDetailData(checks[0]);
    }
  };
  getOrderDetailData = order => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderModal/getOrderDetailData',
      payload: {
        order:order,
        orderId:order.orderId,
      },
    });
    dispatch({
      type: 'orderModal/saveEditFlag',
      payload: {
        editFlag: 3,
      },
    });
    this.onChangeDrawerVisible(true);
  };


  handleStateChange = (value) => {

  };



  render() {
    const { orderModal: { orderData, editFlag, pagination }, loadingList, loadingUpdate } = this.props;
    const { checks, drawerVisible } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'orderId',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 20,
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        align: 'center',
        width: 60,
      },
      {
        title: '订单备注',
        dataIndex: 'orderNote',
        key: 'orderNote',
        align: 'center',
        width: 20,
      },
      {
        title: '订单地址',
        dataIndex: 'orderAddress',
        key: 'orderAddress',
        align: 'center',
        width: 140,
      },
      {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        width: 140,
      },
    ];
    const title='订单详情';

    const contentOptions = {
      closeFunction: this.onCloseDrawer,
      checks,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: title,
      drawerContent: <OrderDetail {...contentOptions} />,
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
          func: this.checkDetail,
          param:{},
          key: 'EYE',
        }, {
          func: this.deleteOrder,
          param: {},
          key: 'DELETE',
        }],
    };
    const searchList = [
      {
        title: '用户ID',
        field: 'userId',
        type: 'input',
      },
    ];
    return (
      <PageHeaderWrapper title="订单管理">
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
              data={orderData}
              rowKey={record => record.id}
              onSelectRow={this.onSelectChange}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onRow={(record) => ({
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
