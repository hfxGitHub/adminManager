import React, {Component} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import {Form, Input, Button, Select, Row, Col, TreeSelect, Popover, Progress} from 'antd';
import styles from './Register.less';
import {formItemLayout} from '../../utils/globalUIConfig';
import {phoneRegular, fixedTelephoneRegular} from '../../utils/regular';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;
const {TextArea} = Input;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong"/>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium"/>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short"/>
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({register, loading}) => ({
  register,
  submitting: loading.effects['register/submit'],
  schDataLoading: loading.effects['register/getSchoolData'],
}))
@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      confirmDirty: false,
      //密码校验的弹出框
      visible: false,
      help: '',
      selectFlag: true,
      passWordMessage: '请至少输入6位密码，至多输入13位密码！',
      departmentId: '',
      schoolTypeId: '',
      showschoolType: true,
      showschool: true,
      showNickName:true,
    };
  }

  componentDidMount() {
    this.getDepartData();
  }

  componentDidUpdate() {
    const {form, register, dispatch} = this.props;
    const {depId} = this.state;
    //注册成功后，跳到结果窗口
    if (register.status === 0) {
      router.push({
        pathname: '/user/register-result',
      });
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //获取学校类型
  getSchoolTypeData() {
    const {dispatch} = this.props;
    dispatch({
      type: 'register/getSchoolTypeData',
    });
  }

  //获取部门数据
  getDepartData() {
    const {dispatch} = this.props;
    dispatch({
      type: 'register/getEduDepartment',
      payload: '',
    });
  }

  getPasswordStatus = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/submit',
          payload: values,
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const {value} = e.target;
    const {confirmDirty} = this.state;
    this.setState({confirmDirty: confirmDirty || !!value});
  };

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({id: 'validation.password.twice'}));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const {visible, confirmDirty} = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({id: 'validation.password.required'}),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6 || value.length > 13) {
        callback('error');
      } else {
        const {form} = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], {force: true});
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  //当密码栏失去聚焦后消除检验框
  onPassWordInputBlur = () => {
    const {visible} = this.state;
    if (visible) {
      this.setState({
        visible: !visible,
      });
    }
  };
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
  //生成学校类型树函数
  setSchTypeTreeData = (data) => {
    data.map((item) => {
      item['title'] = item.val;
      item['value'] = item.k.toString();
      item['key'] = item.k.toString();
    });
  };
  // 生成学校树函数;
  setSchTreeData = (data) => {
    data.map((item) => {
      item['title'] = item.schoolName;
      item['value'] = item.schoolId.toString();
      item['key'] = item.schoolId.toString();
    });
  };

  //选中部门树的节点函数
  depTreeChange = (id) => {
    const {dispatch, form} = this.props;
    const {departmentId} = this.state;
    if (departmentId) {
      form.resetFields(['schoolType', 'schoolId']);
      this.setState({
        showschoolType: true,
        showschool: true,
      });
    }
    this.setState({
      departmentId: id,
      showschoolType: false,
    });
    dispatch({
      type: 'register/getSchoolTypeData',
      payload: {
        type: 'schoolType',
      },
    });
  };

  //选中学校类型树的节点函数
  schTypeTreeChange = (id) => {
    const {dispatch} = this.props;
    const {departmentId} = this.state;
    this.setState({
      showschool: false,
    });
    dispatch({
      type: 'register/getSchoolData',
      payload: {
        departmentId: departmentId,
        schoolType: id,
      },
    });
  };

  setNickName =(id)=>{
    const {form,register: {schoolData=[]}} = this.props;
    const nickName = schoolData.filter(function (value, index) {
      if (value.schoolId == id) {
        return value.schoolName;
      }
    })
    form.setFieldsValue({ nickname:nickName[0].schoolName});
  }

  checkLength =(rule,value,callback)=>{
      if(value.length>10)
      {
        callback('登录名长度不能超过10位!');
      }
      else{
        callback();
      }
  }


  render() {
    const {form, submitting, schDataLoading, register: {eduDepartmentData, schoolData, schoolTypeData}} = this.props;
    const {getFieldDecorator} = form;
    const {count, prefix, help, passWordMessage, showNickName, visible, showschoolType, showschool} = this.state;
    //修改部门的原始数据
    const depData = this.setTreeData(eduDepartmentData);
    if (schoolTypeData.length !== 0) {
      this.setSchTypeTreeData(schoolTypeData);
    }

    //修改学校的原始数据
    if (schoolData.length !== 0) {
      this.setSchTreeData(schoolData);
    }
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register"/>
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'登录名'}>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message:'请输入登录名',
                    },
                    {validator: this.checkLength}
                  ],
                })(<Input size="large" placeholder={"长度不超过10位"}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'教育主管部门'}>
                {getFieldDecorator('parentDepId', {
                  rules: [
                    {
                      required: true,
                      message:'请选择教育主管部门',
                    },
                  ],
                })
                (<TreeSelect size="large"
                             placeholder={formatMessage({id: 'form.register.placeholder.department'})}
                             treeData={depData}
                             onSelect={this.depTreeChange}
                             dropdownStyle={{maxHeight: 220, overflow: 'auto'}}
                />)
                  // (<Input size="large" placeholder={formatMessage({id: 'form.register.placeholder.telephone'})}/>)
                }
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'学校类型'}>
                {getFieldDecorator('schoolType', {
                  rules: [
                    {
                      message: '请选择学校类型',
                    },
                  ],
                })(
                  <TreeSelect
                    size="large"
                    disabled={showschoolType}
                    placeholder={formatMessage({id: 'validation.schoolbefore.required'})}
                    treeData={schoolTypeData}
                    onSelect={this.schTypeTreeChange}
                    dropdownStyle={{maxHeight: 220, overflow: 'auto'}}
                  />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'学校'} loading={schDataLoading}>
                {getFieldDecorator('schoolId', {
                  rules: [
                    {
                      // required: true,
                      message: '请选择学校',
                    },
                  ],
                })
                (<TreeSelect size="large"
                             placeholder={formatMessage({id: 'validation.school.required'})}
                             disabled={showschool}
                             treeData={schoolData}
                             dropdownStyle={{maxHeight: 220, overflow: 'auto'}}
                             onChange={this.setNickName}
                />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'用户名'}>
                {getFieldDecorator('nickname', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ],
                })
                (<Input size="large"  disable={showNickName} />)

                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'性别'}>
                {getFieldDecorator('sex', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请选择性别',
                    },
                  ],
                })(<Select defaultValue="1" size="large">
                  <Option value="1">男</Option>
                  <Option value="0">女</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'电话号码'}>
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入电话号码',
                    },
                    {
                      pattern: phoneRegular.reg,
                      message: phoneRegular.msg,
                    }
                  ],
                })(<Input size="large" placeholder="请输入电话号码"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'固定电话'}>
                {getFieldDecorator('telephone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入固定电话',
                    }, {
                      pattern: fixedTelephoneRegular.reg,
                      message: fixedTelephoneRegular.msg,
                    },
                  ],
                })(<Input size="large" placeholder="形如0816-123456"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'密码'}>
                <Popover
                  getPopupContainer={node => node.parentNode}
                  content={
                    <div style={{padding: '4px 0'}}>
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div style={{marginTop: 10}}>
                        <FormattedMessage id="validation.password.strength.msg"/>
                      </div>
                    </div>
                  }
                  overlayStyle={{width: 240}}
                  placement="left"
                  visible={visible}
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        max: 13,
                        validator: this.checkPassword,
                        message: passWordMessage,
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      onBlur={this.onPassWordInputBlur}
                      placeholder={formatMessage({id: 'form.password.placeholder'})}
                    />,
                  )}
                </Popover>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={'确认密码'}>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '请确认密码',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder={formatMessage({id: 'form.confirm-password.placeholder'})}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem>
                <div className={styles.btnCenter}>
                  <Button
                    size="large"
                    loading={submitting}
                    className={styles.submit}
                    type="primary"
                    htmlType="submit"
                  >
                    <FormattedMessage id="app.register.register"/>
                  </Button>
                </div>
              </FormItem>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                className={styles.nowUserLogin}
              >
                <Link className={styles.btnCenter} to="/User/Login">
                  <FormattedMessage id="app.register.sign-in"/>
                </Link>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Register;
