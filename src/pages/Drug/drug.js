import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, message, Modal, Row, Col, Icon, Popover } from 'antd';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import Drug from './drugDetail';
import styles from './style.less';
import remoteLinkAddress from '../../utils/ip';
import * as utils from '../../utils/utils';
import { EDIT_FLAG } from '../../utils/Enum';
import AdvancedSelect from '../../components/AdvancedSelect/index';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;

@connect(({ drugModal, basicdata, loading }) => ({
  loading,
  drugModal,
  basicdata,
  loadingList: loading.effects['drugModal/fetch'],
  loadingDeleteDrug: loading.effects['drugModal/deleteDrug'],
  loadingSearch: loading.effects['drugModal/searchById'],
}))
class drug extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      drawerVisible: false,
      formValues: '',
      searchId:0,
    };
  }

  componentDidMount() {
    this.listPage();
    this.getGroup();
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });
    if (params) {
      const { currentPage, pageSize, ...others } = params;
      this.setState({
        formValues: others,
      });
    }
    this.getGroup();
  };

  onSelectChange = (data) => {
    this.setState({
      selectedRows: data,
    });

  };

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };

  onCanel = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  edit = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length > 1) {
      message.error('不能同时修改多个目标!');
      return;
    }
    if (selectedRows[0]) {
      dispatch({
        type: 'drugModal/saveId',
        payload: {
          id: selectedRows[0].id,
        },
      });
      dispatch({
        type: 'drugModal/saveDetail',
        payload: {
          data: selectedRows[0],
        },
      });
      dispatch({
        type: 'drugModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });

      this.onChangeDrawerVisible(true);
    }
  };

  doubleClickRow = (record) => {
    const { dispatch } = this.props;
    if (record) {
      dispatch({
        type: 'drugModal/saveId',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'drugModal/saveEditFlag',
        payload: {
          editFlag: EDIT_FLAG.EDIT,
        },
      });
      dispatch({
        type: 'drugModal/saveDetail',
        payload: {
          data: record,
        },
      });
      this.onChangeDrawerVisible(true);
    }
  };

  SeeMore = (DetailId) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const data = selectedRows[selectedRows.length - 1];
    if (Number.isInteger(DetailId.drugId)) {
      dispatch({
        type: 'drugModal/saveId',
        payload: { id: DetailId.drugId },
      });
      const logoUrl = remoteLinkAddress() + '/drug/logo/get/' + DetailId.drugId;
      window.open(logoUrl, '_blank');
    } else {
      if (!data) {
        message.warning('请选择一条数据');
        return;
      }
      dispatch({
        type: 'drugModal/saveEditFlag',
        payload: { editFlag: EDIT_FLAG.EDIT },
      });
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.ADD,
      },
    });
    this.onChangeDrawerVisible(true);
  };

  deleteDetail = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length != 1) {
      message.error('不能同时删除多条数据!');
      return;
    }
    Modal.confirm({
      title: '删除该药品',
      content: '确定删除该药品吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.deleteItem(selectedRows[0]),
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/searchById',
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

  getGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/allGroup',
      payload: '',
    });
  };

  deleteItem = drug => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/deleteDrug',
      payload: drug,
    });
    this.setState({
      selectedRows: [],
    });
  };

  handleStateChange = () => {
  };

  // handleChangeGroup = (params) => {
  //   let newGroup = [];
  //   let nowGroup = {};
  //   newGroup.length=params.length;
  //   params.forEach(function(item, index) {
  //     nowGroup.text = item.groupName;
  //     nowGroup.value = item.groupId;
  //     newGroup.push(nowGroup);
  //     nowGroup={};
  //   });
  //   return newGroup;
  // };

  newGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `drugModal/showModal`,
    });
    dispatch({
      type: `drugModal/saveEditFlag`,
      payload: {
        editFlag: EDIT_FLAG.EDIT_PWD,
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drugModal/hiddenModal',
    });
  };

  onCloseDrawer = () => {
    this.onChangeDrawerVisible(false);
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
      type: 'drugModal/fetch',
      payload: params,
    });
  };

  handleProviderChange=value=>{
    this.setState({
      searchId:value,
    });
  };

  getDrugGroup=data=>{
    let drupGroupData=[];
    data.forEach((item)=>{
      drupGroupData.push({
        'k':item.groupId.toString(),
        'val':item.groupName
      });
    });
    return drupGroupData;
  };

  render() {
    const { drugModal: { drugData, groupData, editFlag, pagination, visible }, loadingList, loadingUpdate } = this.props;
    const { selectedRows, drawerVisible } = this.state;
    const drupGroupData=this.getDrugGroup(groupData);
    // const filters = this.handleChangeGroup(groupData);
    const searchList = [
      {
        title: '药品分组',
        field: 'groupId',
        type: 'other',
        renderComponent:()=>{
          return(<AdvancedSelect dataSource={drupGroupData} type="DATADICT" onChange={this.handleProviderChange}/>)
        }
      },
    ];
    const btnList = {
      primaryBtn: [{
        func: this.add,
        param: [true, '其他'],
        key: 'ADD',
      }, {
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
          func: this.deleteDetail,
          param: {},
          key: 'DELETE',
        }],
    };
    const columns = [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        title: '药品ID',
        dataIndex: 'drugId',
        key: 'drugId',
        align: 'center',
        width: 40,
      },
      {
        title: '药品名称',
        dataIndex: 'drugName',
        key: 'drugName',
        align: 'center',
        width: 100,
      },
      {
        title: '药品说明',
        dataIndex: 'drugInformation',
        key: 'drugInformation',
        align: 'center',
        width: 140,
        render: (record = '') => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 25) {
            data = data.substring(0, 20);
            data = data + '......';
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
            >
              <a>{data}</a>
            </Popover>
          );
        },
      },
      {
        title: '药品价格',
        dataIndex: 'drugPrice',
        key: 'drugPrice',
        align: 'center',
        width: 100,
      },
      {
        title: '药品分组',
        dataIndex: 'groupName',
        key: 'groupName',
        align: 'center',
        width: 60,
      },
      {
        title: '查看药品logo',
        align: 'center',
        width: 40,
        render: (text, reward) => (
          <Row>
            <Col span={10}/>
            <Col span={4}><a onClick={() => this.SeeMore(reward)}><Icon type="eye"/></a></Col>
            <Col span={10}/>
          </Row>
        ),
      },
    ];

    let title;
    switch (editFlag) {
      case EDIT_FLAG.ADD:
        title = '新建';
        break;
      case EDIT_FLAG.EDIT:
        title = '修改';
        break;
      case EDIT_FLAG.EDIT_PWD:
        title = '新增分组信息';
        break;
    }


    const contentOptions = {
      onCanel: this.onCanel,
      closeFunction: this.onCloseDrawer,
      selectedRows,
      loadingUpdate,
    };

    const drugGroup = {
      selectedRows: selectedRows,
      visible,
      title,
      handleCancel: this.handleCancel,
      handleEdit: this.editImg,
    };

    const drawerOption = {
      drawerTitle: title,
      drawerContent: <Drug {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onChangeDrawerVisible,
    };
    return (
      <PageHeaderWrapper title="药品管理">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.handleSearch}
          pagination={pagination}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows}/>
            <StandardTable
              selectedRows={selectedRows}
              loading={loadingList}
              loadingUpdate={loadingUpdate}
              data={drugData}
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
        <AdvancedDrawer {...drawerOption} />
        {/*<DrugGroup {...drugGroup} />*/}
      </PageHeaderWrapper>
    );
  }
}

export default drug;
