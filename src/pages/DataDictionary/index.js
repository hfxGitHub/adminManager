import React,{PureComponent} from 'react';
import {connect} from 'dva';
import DataDetail from './DataDetail';
import {Card,Form,Drawer,Modal,message} from 'antd';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DATA_DICTIONARY_DETAIL_STATUS } from '../../utils/Enum';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';

const {confirm}=Modal;
@Form.create()
@connect(({DataDictionary,loading})=>({
  DataDictionary,
  loading,
  DataFetch:loading.effects['DataDictionary/fetch'],
}))

class DataDictionarye extends PureComponent{
  constructor(props){
    super();
    this.state={
      DataId:'',
      drawerTitle:'新增数据',
      selectedRows:[],
      drawerVisible:false,
      dataDetail:DATA_DICTIONARY_DETAIL_STATUS.ADD
    }
  }

  componentDidMount(){
    this.listPage();
  };

  listPage=(param)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DataDictionary/fetch',
      payload:param||{
        currentPage : 1 ,
        pageSize : 10,
      }
    })
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
    };
    dispatch({
      type : 'DataDictionary/fetch',
      payload : params,
    });
  };

  handleAdd=()=>{
    this.setState({
      drawerVisible:true,
      drawerTitle:'新增数据',
      dataDetail:DATA_DICTIONARY_DETAIL_STATUS.ADD
    })
  };

  handleRefresh=()=>{
    const {pagination}=this.props.DataDictionary;
    const {dispatch}=this.props;
    dispatch({
      type:'DataDictionary/fetch',
      payload:pagination
    })
  };

  closeDrawer=()=>{
    this.props.form.resetFields();
    this.setState({
      drawerVisible:false
    })
  };

  editUser=()=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('选择多项数据时，只允许编辑第一位')
    }
    this.setState({
      dataDetail:DATA_DICTIONARY_DETAIL_STATUS.EDIT,
      drawerVisible:true,
      DataId:selectedRows[0].id,
      drawerTitle:'修改数据信息'
    })
  };

  delDict=()=>{
    const {pagination}=this.props.DataDictionary;
    const { dispatch } = this.props;
    const {selectedRows}=this.state;
    const {handleSelectRows}=this;
    if(selectedRows.length>1){
      message.warning('抱歉每次只允许删除一个数据值');
      return
    }
    confirm({
      title: '是否删除选中的数据',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        let delId=[];
        selectedRows.map(function(item) {
          delId.push(item.id)
        });
        dispatch({
          type:'DataDictionary/delData',
          payload:{
            data:{
              id:selectedRows[0].id,
            },
            pagination:pagination
          }
        })
        handleSelectRows([])
      }
    })
  };

  columns = [
    {
      title : '字典序号',
      dataIndex : 'id',
      key : 'id',
    },
    {
      title : '字典类型名',
      dataIndex : 'type',
      key : 'type',
    },
    {
      title : '字典键值',
      dataIndex : 'k',
      key : 'k',
    },
    {
      title : '字典value',
      dataIndex : 'val',
      key : 'val',
    },
  ];

  btnList = {
    primaryBtn : [{
      func : this.handleAdd,
      param : [],
      key : 'ADD',
    }, {
      func : this.handleRefresh,
      param : [],
      key : 'REFRESH',
    }],
    patchBtn : [
      {
        func: this.editUser,
        param: {},
        key: 'EDIT',
      }, {
        func : this.delDict,
        param : {},
        key : 'DELETE',
      },],
  };

  searchList = [
    {
      title : '字典类型名',
      field : 'type',
      type : 'input',
    },
    {
      title : '字典键值',
      field : 'k',
      type : 'input',
    },
    {
      title : '字典val',
      field : 'val',
      type : 'input',
    },
  ];

  render(){
    const {selectedRows,drawerVisible,dataDetail,DataId,drawerTitle}=this.state;
    const {DataDictionary:{data,pagination},DataFetch}=this.props;
    const contentOptions={
      selectedRows,
      dataDetail,
      DataId,
      pagination,
      onClose:this.closeDrawer,
    };

    return(
      <PageHeaderWrapper title={'字典管理'}>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.listPage}
          pagination={pagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows}/>
          <StandardTable
            selectedRows={selectedRows}
            loading={DataFetch}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.id}
          />
        </Card>
        <Drawer
          title={drawerTitle}
          placement="right"
          closable
          onClose={this.closeDrawer}
          visible={drawerVisible}
          width={800}
          destroyOnClose
        >
          <DataDetail {...contentOptions} />
        </Drawer>
      </PageHeaderWrapper>
    )
  }
}
export default DataDictionarye;
