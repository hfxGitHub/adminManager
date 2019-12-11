import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Modal, Input, Row, Col,TreeSelect} from 'antd';
import {lineItem, entireLine, formItemLayout} from '../../../utils/globalUIConfig';
import {phoneRegular} from "../../../utils/regular";
import { formatMessage, FormattedMessage } from 'umi/locale';
import * as SelectFieldConfig from "../../../utils/globalSelectDataConfig";
import AdvancedSelect from '../../../components/AdvancedSelect';
import * as basicFunction from "../../../utils/utils";


const FormItem = Form.Item;

@connect(({centerModel,basicdata,loading}) => ({
  basicdata,
  centerModel,
  loading: loading.models.centerModel,
}))
@Form.create()

class PersonInfo extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      showSchoolType: true,
      showSchool:false,
      departmentId: '',
      schoolTypeId: '',
    };
  }


  componentDidMount() {
    this.getUserData();
    this.getDepartData();
    this.getSchoolData();
  }

  getDepartData=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getEduDepartment',
    });
  }

  getUserData=()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getCurrentUser',
    });
  }

  getSchoolData=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getSchoolData',
    });
  }


  //生成部门树函数
  setTreeData = (data) => {
    data.map((item) => {
      item['title'] = item.depName;
      item['value'] = item.departmentId.toString();
      item['key'] = item.departmentId.toString();
    });
    let cloneData = JSON.parse(JSON.stringify(data));    // 对源数据深度克隆
    let tree = cloneData.filter((father) => {              //循环所有项
      let branchArr = cloneData.filter((child) => {
        return father.departmentId == child.parentId;      //返回每一项的子级数组
      });
      if (branchArr.length > 0) {
        father.children = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
      }
      return father.parentId == 0;      //返回第一层
    });
    return tree;     //返回树形数据
  };


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


  schoolTypeChange =()=>{
  };

  onHandleSave = ()=>{
    const {dispatch,form,centerModel: {currentUserdata}} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err)
      {
        const sendData ={
          ...values,
          id:currentUserdata.id,
        }
        dispatch({
          type:`centerModel/editUser`,
          payload:sendData,
        })
      }
    })
  }

  render() {
    let schoolSelectedData=[];   //  从model中获取之后重新筛选数据
    const {gDictData}=this.props.basicdata;
    const schoolType=basicFunction.getDictByType(gDictData,'schoolType');
    const {title, form: {getFieldDecorator},visiblePersonInfo,handleCancel} = this.props;
    const {centerModel: {currentUserdata,eduDepartmentData,schoolData}} = this.props;
    currentUserdata['schoolType'] = String(currentUserdata['schoolType']);
    const depData = this.setTreeData(eduDepartmentData);

    if(currentUserdata['departmentId']!=undefined){
      currentUserdata['departmentId']=currentUserdata.departmentId.toString();//树形选择中数字转字符串
      schoolSelectedData=this.schoolSelectedableArray(schoolData,currentUserdata['departmentId'],-1)
    }//只有部门
    if(currentUserdata['departmentId']!=undefined&&currentUserdata['schoolType']!=undefined){
      schoolSelectedData=this.schoolSelectedableArray(schoolData,currentUserdata['departmentId'],currentUserdata['schoolType'])
    }//部门和学校类型都有

    return (
      <Modal
        width='50%'
        visible={visiblePersonInfo}
        title={title}
        okText="确定"
        onCancel={handleCancel}
        onOk={this.onHandleSave}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'账号'}>
                {getFieldDecorator('username', {
                  initialValue:currentUserdata.username||'',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      max: 11,
                      message: formatMessage({ id: 'validation.userName.required' }),
                    },
                  ],
                })(<Input size="large" placeholder={"账号应该为英文和数字，长度不超过10位"}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'用户名'}>
                {getFieldDecorator('nickname', {
                  initialValue:currentUserdata.nickname||'',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.nickname.required' }),
                    },
                  ],
                })(<Input size="large" placeholder={"用户名为中文"}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'电话号码'}>
                {getFieldDecorator('phone', {
                  initialValue:currentUserdata.phone||'',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input size="large" placeholder={formatMessage({ id: 'form.register.placeholder.phone' })}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'手机号码'}>
                {getFieldDecorator('telephone', {
                  initialValue:currentUserdata.telephone||'',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.telephone-number.required' }),
                    }, {
                      pattern: phoneRegular.reg,
                      message: phoneRegular.msg,
                    },
                  ],
                })(<Input size="large" placeholder={formatMessage({ id: 'form.register.placeholder.telephone' })}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'部门'}>
                {getFieldDecorator('departmentId', {
                  initialValue:currentUserdata.departmentId||'',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.departmentId.required' }),
                    },
                  ],
                })
                (<TreeSelect size="large"
                             placeholder={formatMessage({ id: 'form.register.placeholder.department' })}
                             treeData={depData}
                             onSelect={this.depTreeChange}
                             dropdownStyle={{ maxHeight: 220, overflow: 'auto' }}
                />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'学校类型'}>
                {getFieldDecorator('schoolType', {
                  initialValue:currentUserdata.schoolType,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.schoolType.required' }),
                    },
                  ],
                })(
                  <AdvancedSelect dataSource={schoolType}
                                  allowClear={true}
                                  placeholder={'可选择学校所属类型'}
                                  fieldConfig={SelectFieldConfig.userDetail}
                                  onChange={this.schoolTypeChange}/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'学校'}>
                {getFieldDecorator('schoolName', {
                  initialValue:currentUserdata.schoolName||'',
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.school.required' }),
                    },
                  ],
                })
                (<AdvancedSelect dataSource={schoolSelectedData}
                                 allowClear={true}
                                 placeholder={'可选择具体学校'}
                                 dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                 fieldConfig={SelectFieldConfig.userDetailSchool}
                                 onChange={this.schoolTypeChange}/>)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default PersonInfo;
