import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Card,
  message,
  Select,
  TreeSelect
} from 'antd';
import { ROLES_DETAIL_STATUS } from '../../utils/Enum';
import { entireLine, lineItem } from '../../utils/globalUIConfig';
import { phoneRegular, emailRegular,delectBeforeAndBehindBlackRegular} from '../../utils/regular';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import * as basicFunction from '../../utils/utils';

const FormItem=Form.Item;
@connect(({UserSetting,loading,basicdata})=>({
  UserSetting,
  basicdata,
  addUserLoading:loading.effects['UserSetting/addUser'],
  editUserLoading:loading.effects['UserSetting/changeInfo'],
  AllLoading:loading.models.UserSetting,
}))
@Form.create()
class UsersDetail extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      correctData:'',
      schoolDepartment:'',
      schoolTypeVisible:false,
      schoolIdVisible:false,
    };
  }

  componentDidMount(){
    const {dispatch} =this.props;
    const {rolesDetailStatus,userId}=this.props;
    switch (rolesDetailStatus) {
      case ROLES_DETAIL_STATUS.EDIT:
        dispatch({
          type:'UserSetting/getUser',
          payload:{
            id:userId
          }
        });
        this.setState({
          schoolTypeVisible:true,
          schoolIdVisible:true,
        });
        break;
      case ROLES_DETAIL_STATUS.ADD:
        dispatch({
          type:'UserSetting/cleanGetDetail',
        });
      default:
        break
    }
  }

  addOrUpdateUser=()=>{
    const { form: { validateFields }} = this.props;
    const {
      dispatch ,rolesDetailStatus,onClose,pagination,
      userId,
    }=this.props;
    validateFields((error,values)=>{
      let roleIds=[];
      if(!error){
        if(values['roleId']){
          roleIds.push(values['roleId'])
          values.roleIds=roleIds
        }
        values['username']=values['username'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        values['nickname']=values['nickname'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        if(rolesDetailStatus===ROLES_DETAIL_STATUS.EDIT){
          dispatch({
            type:'UserSetting/changeInfo',
            payload:{
              data:{...values,id:userId},
              pagination:pagination,
            }
          })
        }
        else{
          dispatch({
            type:'UserSetting/addUser',
            payload:{
              data:values,
              pagination:{
                currentPage : 1 ,
                pageSize : 10,
              }
            }
          })
          dispatch({
            type:'UserSetting/save',
            payload:{
              selectedRows:[],
            }
          })
        }
        onClose()
      }
    });
  };

  disabledDate=(current)=>{
    return current && current > moment().endOf('day');
  };

  getCorrectData=(data,dateString)=>{
    this.setState({
      correctData:dateString
    })
  };

  depChange=(data)=>{
    const {dispatch}=this.props;
    const {detailData}=this.props.UserSetting;
    const {form:{setFieldsValue}} =this.props;
    setFieldsValue({
      schoolType:undefined,
      schoolId:undefined
    });//清空类型和学校的数据
    this.setState({
      schoolTypeVisible:true,
    });//如果是新建的时候，让类型选择显示出来
    dispatch({
      type:'UserSetting/save',
      payload:{
        detailData:{
          ...detailData,
          departmentId:data,
        }
      }
    })
  };//部门选择

  schoolTypeChange=(data)=>{
    const {dispatch}=this.props;
    const {detailData}=this.props.UserSetting;
    const {form:{setFieldsValue}} =this.props;
    setFieldsValue({
      schoolId:undefined
    });
    this.setState({
      schoolIdVisible:true,
    })
    dispatch({
      type:'UserSetting/save',
      payload:{
        detailData:{
          ...detailData,
          schoolType:data,
        }
      }
    })
  };//学校类型选择

  schoolSelectedableArray=(schoolData,schoolDepartment,schoolType)=>{
    let able=[];
    if(schoolType!=-1){
      schoolData.map((item)=>{
        if(item.departmentId==schoolDepartment&&item.schoolType==schoolType){
          // item['schoolId']=item['schoolId'].toString()
          able.push(item)
        }
      })
      return able;
    }
    else{
      able=schoolData.filter(item=>{
        if(item.departmentId==schoolDepartment) return item
      })
      return able;
    }
  };

  handleProviderChange = (value) => {
    console.log(value);
  };

  render(){
    const {gDictData}=this.props.basicdata;
    const {
      schoolData,//所有的学校数据
      loading,
      rolesDetailStatus,
      onClose,
      eduDepartmentData,
    }=this.props;
    const {
      schoolTypeVisible,
      schoolIdVisible,
    }=this.state;
    let allRoleWIthIdTostring=[];//为了解决验证错误
    let schoolSelectedData=[];//从model中获取之后重新筛选数据
    const {form:{getFieldDecorator},addUserLoading,editUserLoading}=this.props;
    let {detailData,allRoles}=this.props.UserSetting;
    let passwordExitSpan;
    let passwordExitStyle={};
    const editDisable = true&&rolesDetailStatus === ROLES_DETAIL_STATUS.EDIT;
    editDisable?passwordExitSpan=24:passwordExitSpan=12;
    editDisable?passwordExitStyle=entireLine:passwordExitStyle=lineItem;
    allRoleWIthIdTostring=allRoles.map(item=>{
      item.id=item.id.toString();
      return item
    });
    if(rolesDetailStatus){
      if(detailData['schoolType']!=undefined){
        detailData['schoolType']=detailData.schoolType.toString();//树形选择中数字转字符串
      }
      // if(detailData['schoolId']!=undefined){
      //   detailData['schoolId']=detailData['schoolId'].toString();//树形选择中数字转字符串
      //   console.log(detailData)
      // }
      if(detailData['status']!=undefined) {
        detailData['status']=detailData.status.toString();
      }
      if(detailData['sex']!=undefined){
        detailData['sex']=detailData.sex.toString();
      }
      if(detailData['roleNames']!=undefined){
        let roleId;
        allRoles.map(item=>{
          if(item.name==detailData['roleNames'][0]){
            roleId=item.id;
          }
        })
        detailData.roleId=roleId
      }
      if(detailData['schoolId']!=undefined){
        detailData['schoolId']=Number(detailData.schoolId);
      }
    }

    if(detailData['departmentId']){
      detailData['departmentId']=detailData.departmentId.toString();//树形选择中数字转字符串
      schoolSelectedData=this.schoolSelectedableArray(schoolData,detailData['departmentId'],-1)
    }//只有部门
    if(detailData['departmentId']&&detailData['schoolType']!=undefined){
      schoolSelectedData=this.schoolSelectedableArray(schoolData,detailData['departmentId'],detailData['schoolType'])
    }//部门和学校类型都有

    const sex=basicFunction.getDictByType(gDictData,'sex');
    const userStatus=basicFunction.getDictByType(gDictData,'userStatus');
    const schoolType=basicFunction.getDictByType(gDictData,'schoolType');

    return(
      <Card bordered={false}>
        <Form  style={{ marginTop : 8 }}>
          <Row>
            <Col span={passwordExitSpan}>
              <FormItem {...passwordExitStyle} label="登录名">
                {getFieldDecorator('username', {
                  initialValue : detailData.username|| '',
                  rules : [
                    {
                      required : true,
                      whitespace:true,
                      max:11,
                      message : '请正确输入登录名',
                    },
                  ],
                })(<Input placeholder="不能只为空格，长度小于11个字"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              {!editDisable?<FormItem {...lineItem} label="密码" >
                {getFieldDecorator('password', {
                  initialValue :detailData.password|| '',
                  rules : [
                    {
                      required : true,
                      message : '请输入密码',
                    },
                  ],
                })(<Input placeholder="请输入密码"/>)}
              </FormItem>:''}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="用户名">
                {getFieldDecorator('nickname', {
                  initialValue : detailData.nickname|| '',
                  rules : [
                    {
                      required : true,
                      whitespace:true,
                      max:11,
                      message : '请正确输入昵称',
                    },
                  ],
                })(<Input placeholder="不能只为空格，长度小于11个字"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="手机号">
                {getFieldDecorator('phone', {
                  initialValue : detailData.phone|| '',
                  rules : [
                    {
                      required : true,
                      pattern:phoneRegular.reg,
                      message : '请输入正确的手机号',
                    },
                  ],
                })(<Input placeholder="请输入手机号"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="状态">
                {getFieldDecorator('status', {
                  initialValue : detailData.status||undefined,
                  rules : [
                    {
                      required : true,
                      message : '请选择用户状态',
                    },
                  ],
                })(<AdvancedSelect placeholder={'请选择用户状态'} dataSource={userStatus} type="DATADICT"  onChange={this.handleProviderChange}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="性别">
                {getFieldDecorator('sex', {
                  initialValue :detailData.sex||undefined,
                  rules : [
                    {
                      required : true,
                      message : "请选择性别",
                    },
                  ],
                })(<AdvancedSelect placeholder={'请选择用户性别'} dataSource={sex} type="DATADICT" onChange={this.handleProviderChange}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="邮箱">
                {getFieldDecorator('email', {
                  initialValue : detailData.email|| '',
                  rules : [
                    {
                      // required : true,
                      pattern:emailRegular.reg,
                      message : '请正确输入邮箱',
                    },
                  ],
                })(<Input placeholder="请输入邮箱号"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="教育主管部门">
                {getFieldDecorator('parentDepId', {
                  initialValue: detailData.parentDepId==0?undefined:detailData.parentDepId,
                })(<TreeSelect placeholder={'可选择部门'} allowClear={true} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} treeData={eduDepartmentData} onChange={this.depChange}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {schoolTypeVisible?<Col span={12}>
              <FormItem {...lineItem} label="学校类型">
                {getFieldDecorator('schoolType', {
                  initialValue: detailData.schoolType,
                })(<AdvancedSelect dataSource={schoolType} allowClear={true} placeholder={'可选择学校所属类型'} fieldConfig={SelectFieldConfig.userDetail} onChange={this.schoolTypeChange}/>)}
              </FormItem>
            </Col>:''}
            {schoolIdVisible?<Col span={12}>
              <FormItem {...lineItem} label="学校名称">
                {getFieldDecorator('schoolId', {
                  initialValue: detailData.schoolId,
                })(<AdvancedSelect dataSource={schoolSelectedData} allowClear={true} placeholder={'可选择具体学校'} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} fieldConfig={SelectFieldConfig.userDetailSchool} onChange={(value) => {}}/>)}
              </FormItem>
            </Col>:''}
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="用户角色">
                {getFieldDecorator('roleId', {
                  initialValue : detailData.roleId||undefined,
                  rules : [
                    {
                      message : '请选择用户角色',
                    },
                  ],
                })(<AdvancedSelect placeholder={'请选择用户角色'} dataSource={allRoleWIthIdTostring} fieldConfig={SelectFieldConfig.userConfigRoles} onChange={(value) => {}}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row type="flex" justify="center">
          <Col>
            <Button type={'primary'} onClick={this.addOrUpdateUser} loading={addUserLoading||editUserLoading}>确定</Button>
          </Col>
          <Col span={1}/>
          <Col>
            <Button onClick={onClose}>取消</Button>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default UsersDetail
