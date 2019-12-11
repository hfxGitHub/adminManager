import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Form,Modal,message} from 'antd';
import UsersDetail from './UsersDetail';
import * as basicFunction from '../../utils/utils';
import AdvancedSelect from '../../components/AdvancedSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { ROLES_DETAIL_STATUS, SIGN_COLOR } from '../../utils/Enum';
import AdvancedDrawer from  '../../components/AdvancedDrawer/index';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import MultiFunctionalList from '../../components/MultifunctionalList/index';
const {confirm}=Modal;
@Form.create()
@connect(({ UserSetting, loading ,print,basicdata}) => ({
  print,
  UserSetting,
  basicdata,
  listLoading:loading.effects['UserSetting/getList'],
  changeInfoLoading:loading.effects['UserSetting/changeInfo'],
  delUserLoading:loading.effects['UserSetting/delUser']
}))

class RoleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      drawerVisible:false,
      drawerTitle:'新建角色',
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD,
      userId:'',
      searchWithNameOrStatus:false,//为了是否点击重置
      searchMoreParams:{}//为了区分分页的时候是搜索之后的分页还是原始分页
    };
  }

  componentDidMount() {
    const {dispatch}=this.props;
    dispatch({
      type:'basicdata/getEduDepartment',
      payload:{}
    });//获取所有部门
    dispatch({
      type:'basicdata/getSchool',
      payload:{}
    });//获取所有学校
    dispatch({
      type:'UserSetting/getAllRole',
    });//获取所有角色
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  }

  advancedSearch = (params) => {//搜索框搜索分页
    if(params.hasOwnProperty('status')||params.hasOwnProperty('username')){//如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchWithNameOrStatus:true,
        searchMoreParams:{
          ...params,
          currentPage: 1,
          pageSize: 10,
        }
      })
    }
    else{//点击重置
      this.setState({
        searchWithNameOrStatus:false
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type : 'UserSetting/getList',
      payload : {//搜索之后总是第一页
        ...params,
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };

  listPage = (params) => {
    const { dispatch } = this.props;
    const {searchWithNameOrStatus,searchMoreParams}=this.state;
    let newParams={};
    if(params.hasOwnProperty('refresh')){
      this.setState({
        searchWithNameOrStatus:false
      });
      newParams={
        currentPage : 1 ,
        pageSize : 10,
      };
    }
    else if(searchWithNameOrStatus){//是否是分页之后的刷新和分页
      newParams={
        ...searchMoreParams,
        ...params
      }
    }
    else newParams=params
    dispatch({
      type : 'UserSetting/getList',
      payload : newParams || {
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };

  closeDrawer=()=>{
    this.setState({
      drawerVisible:false
    })
  }

  handleAdd=()=>{
    this.onChangeDrawerVisible(true);
    this.setState({
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD
    })
  }

  editUser=()=>{
    const {selectedRows}=this.props.UserSetting;
    const {userId}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只能修改一个用户的信息')
      return
    }
    this.onChangeDrawerVisible(true);
    this.setState({
      rolesDetailStatus:ROLES_DETAIL_STATUS.EDIT,
      userId:selectedRows[0].data.id
    })
  };

  handleSelectRows = (data) => {
    const {dispatch}=this.props;
    let userIdstr='';
    if(data.length>0){
      userIdstr=data[0].data.id
    };
    dispatch({
      type:'UserSetting/save',
      payload:{
        selectedRows:data
      }
    })
    this.setState({
      userId:userIdstr,
    });
  };

  updateFunction = (data) => {
    const { dispatch } = this.props;
    const {UserSetting:{pagination,allRoles}}=this.props;
    let ids=[];//转为roleIds
    allRoles.map(item=>{
      if(item.name==data.roleName)
        ids.push(item.id);
    })
    data.roleIds=ids;
    dispatch({
      type : 'UserSetting/changeInfo',
      payload :{
        data:data,
        pagination: pagination
      },
    });
  };

  onChangeDrawerVisible = (value, data) => {
    this.setState({
      drawerVisible: value,
    });
  };

  tableStatusColorMatch=(userSettingUserStatus)=>{
    userSettingUserStatus.map((item)=>{
      item['key']=item.k;
      item['value']=item.val;
      switch (item.val) {
        case '正常':
          item['color']=SIGN_COLOR['3'];
          break;
        case '无效':
          item['color']=SIGN_COLOR['2'];
          break;
        case '锁定':
          item['color']=SIGN_COLOR['7'];
          break;
        case '申请中':
          item['color']=SIGN_COLOR['6'];
          break;
        case '申请失败':
          item['color']=SIGN_COLOR['4'];
          break;
        default:
          break;
      }
      return userSettingUserStatus
    })
  };

  touche=(data)=>{
    if(data){
      this.setState({
        rolesDetailStatus:ROLES_DETAIL_STATUS.EDIT,
        userId:data.id
      })
    }
    this.onChangeDrawerVisible(true)
  };

  setTreeData=(data)=>{
    data.map((item)=>{
      item['title']=item.depName;
      item['value']=item.departmentId.toString();
      item['key']=item.departmentId.toString();
    });
    let cloneData = JSON.parse(JSON.stringify(data))    // 对源数据深度克隆
    let tree = cloneData.filter((father)=>{              //循环所有项
      let branchArr = cloneData.filter((child)=>{
        return father.departmentId == child.parentId      //返回每一项的子级数组
      });
      if(branchArr.length>0){
        father.children = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
      }
      return father.parentId==0;      //返回第一层
    });
    return tree     //返回树形数据
  }

  reSetPassWord=()=>{
    const {selectedRows}=this.props.UserSetting;
    const {dispatch}=this.props;
    const {handleSelectRows}=this;
    if(selectedRows.length>1){
      message.warning('每次只能重置一个用户')
      return
    }
    confirm({
      title: '是否确认重置密码，密码重置后将为默认密码8个8',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'UserSetting/resetPassWord',
          payload:{
            id:selectedRows[0].data.id,
            pagination:{
              currentPage: 1,
              pageSize: 10,
            }
          }
        });
        handleSelectRows([]);
      }
    });
  };

  delUser=()=>{
    const { dispatch } = this.props;
    const {selectedRows}=this.props.UserSetting;
    const {handleSelectRows}=this;
    const {pagination}=this.props.UserSetting;
    confirm({
      title: `是否所选的${selectedRows.length}位用户删除`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        let delId=[];
        selectedRows.map(function(item) {
          delId.push(item.data.id)
        });
        dispatch({
          type:'UserSetting/delUser',
          payload:{
            ids:delId,
            pagination:pagination
          }
        })
        handleSelectRows([]);
      }
    })
  };

  convertData = (data, key, value, text) => {
    if (data) {
      return data.map((current) => {
        const temp = {};
        temp.key = current[value];
        temp.value = current[text];
        temp.text = current[text];
        return temp;
      });
    }
    return [];
  };

  changeArrayRoleNames=(data)=>{
    data.map(item=>{
      if(item['roleNames']) {
        item.roleName=item['roleNames'][0]
      }
    })
    return data;
  };

  searchList = [
    {
      title : '用户名',
      field : 'nickname',
      message : '必填',
      type : 'input',
    },
    {
      title : '用户状态',
      field : 'status',
      message : '角色状态选择有错',
      type : 'other',
      renderComponent : () => {
        const {gDictData}=this.props.basicdata;
        const userStatus=basicFunction.getDictByType(gDictData,'userStatus');
        return (<AdvancedSelect  dataSource={userStatus} searchType='FUZZYSEARCH'  placeholder="请选择用户状态"  fieldConfig={SelectFieldConfig.userDetail} onChange={(value) => {}}/>);
      },
    },
  ];

  render() {
    const {gDictData}=this.props.basicdata;
    let {eduDepartmentData}=this.props.basicdata;
    const {
      schoolData,
    }=this.props.basicdata;
    const {selectedRows}=this.props.UserSetting;
    const {drawerVisible,rolesDetailStatus,userId} = this.state;
    const {listLoading,changeInfoLoading,delRoleLoading}=this.props;
    const {UserSetting:{UsersData,pagination,allRoles}}=this.props;
    const userStatus=basicFunction.getDictByType(gDictData,'userStatus');
    this.tableStatusColorMatch(userStatus);
    let userDataWithRoleNameDeal=this.changeArrayRoleNames(UsersData);//roleNames处理转为为了防止多次render的时候修改数据
    eduDepartmentData=this.setTreeData(eduDepartmentData);
    const cardOption = {
      sign: {
        field: 'status',
        // src: departSrc,
        src:userStatus
      },
      detail: [
        {field: 'roleName', title: '角色:',src: this.convertData(allRoles, 'id', 'name','name'), editable: true },
        { field: 'username', title: '账号' },
        { field: 'nickname', title: '用户名' },
        { field: 'phone', title: '电话' },
        { field: 'email', title: '邮箱' },
      ],
      defaultClick: this.touche,
    };
    const contentOptions = {
      pagination,
      eduDepartmentData,
      rolesDetailStatus,
      onClose:this.closeDrawer,
      userId,
      schoolData,
    };
    const drawerOption = {
      drawerTitle : '用户信息',
      drawerContent : <UsersDetail  {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible : this.onChangeDrawerVisible,
    };
    const pageProps = {
      turnPage: this.listPage,
      ...pagination,
    };
    const btnList = {
      primaryBtn : [{
        func : this.handleAdd,
        param : [],
        key : 'ADD',
      }, {
        func : this.listPage,
        param : {refresh:true},
        key : 'REFRESH',
      }],
      patchBtn : [
        {
          func: this.editUser,
          param: {},
          key: 'EDIT',
        }, {
          func : this.delUser,
          param : {},
          key : 'DELETE',
        },],
      menuBtn : [{
        func : this.reSetPassWord,
        param : {},
        key : 'PASSWORD_RESET',
      }],
    };
    return (
      <PageHeaderWrapper title={'用户管理'}
      >
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
        />
        <MultiFunctionalList
          cardOption={cardOption}
          dataSource={userDataWithRoleNameDeal}
          loadingList={listLoading||changeInfoLoading||delRoleLoading}
          loadingUpdate={changeInfoLoading}
          updateFunction={this.updateFunction}
          pagination={pageProps}
          btnOptions={btnList}
          selectedRows={selectedRows}
          ck
          checks={selectedRows}
          onSelectChange={this.handleSelectRows}
        />
        <AdvancedDrawer {...drawerOption}/>
      </PageHeaderWrapper>
    );
  }
}
export default RoleList;
