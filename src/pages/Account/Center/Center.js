import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Row, Col, Button, Form, Input,DatePicker} from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import AvatarPng from './Avatar.png';
import EditPassword from './EditPassword';
import {lineItem} from "../../../utils/globalUIConfig";
import {phoneRegular,fixedTelephoneRegular,emailRegular} from "../../../utils/regular";

const FormItem = Form.Item;
const dataFormat='YYYY-MM-DD'
@Form.create()
@connect(({centerModel, basicdata, loading}) => ({
  centerModel,
  basicdata,
  editLoading: loading.effects['centerModel/editUser'],
  getCurrentUserLoading: loading.effects['centerModel/getCurrentUser'],
}))
class Center extends PureComponent {
  state = {};

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getCurrentUser',
    });
  }

  modifyPersonInfo = () => {
    const {dispatch, form, centerModel: {currentUserdata}} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const sendData = {
          ...values,
          id: currentUserdata.id,
        }
        dispatch({
          type: `centerModel/editUser`,
          payload: sendData,
        })
      }
    })
  }

  modifyPassword = () => {
    const {dispatch} = this.props;
        dispatch({
          type: `centerModel/showModal`,
        })
  }

  handleCancel = () => {
    const {dispatch,form} = this.props;
    form.resetFields();
    dispatch({
      type: 'centerModel/hiddenModal',
    });
  };

  render() {
    const { editLoading, getCurrentUserLoading} = this.props;
    const {centerModel: {currentUserdata, visiblePersonInfo}, form: {getFieldDecorator}} = this.props;

    const title = '修改密码';

    const editPswProps = {
      visiblePersonInfo,
      title,
      handleCancel: this.handleCancel,
      handleEdit: this.handleEdit,
    };

    return (
      <GridContent className={styles.userCenter} loading={getCurrentUserLoading}>
            <Card bordered={false} style={{marginBottom: 24}}>
              <div className={styles.avatarHolder}>
                <img alt="" src={AvatarPng}/>
              </div>
                <Form style={{marginTop: 8}}>
                  <Row type="flex" justify="center">
                    <Col span={12}>
                      <FormItem {...lineItem} label="登录名">
                        {getFieldDecorator('username', {
                          initialValue: currentUserdata.username || '',
                          rules: [
                            {
                              required: true,
                              whiteSpace: true,
                              message: '登录名为必填项',
                            }
                          ],
                        })(<Input/>)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...lineItem} label="用户名">
                        {getFieldDecorator('nickname', {
                          initialValue: currentUserdata.nickname || '',
                          rules: [
                            {
                              required: true,
                              whiteSpace: true,
                              message: '昵称为必填项',
                            },
                          ]
                        })(<Input placeholder="请输入用户名"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={12}>
                      <FormItem {...lineItem} label="电话号码">
                        {getFieldDecorator('phone', {
                          initialValue: currentUserdata.phone || '',
                          rules: [
                            {
                              required: true,
                              pattern: phoneRegular.reg,
                              message: phoneRegular.msg,
                            },
                          ],
                        })(<Input placeholder="请输入电话号码"/>)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...lineItem} label="固定电话">
                        {getFieldDecorator('telephone', {
                          initialValue: currentUserdata.telephone || '',
                          rules: [
                            {
                              required: true,
                              pattern: fixedTelephoneRegular.reg,
                              message: fixedTelephoneRegular.msg,
                            },
                          ],
                        })(<Input laceholder="请输入固定号码"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={12}>
                      <FormItem {...lineItem} label="电子邮箱">
                        {getFieldDecorator('email', {
                          initialValue: currentUserdata.email || '',
                          rules: [
                            {
                              pattern: emailRegular.reg,
                              message: emailRegular.msg,
                            },
                          ],
                        })(<Input placeholder="请输入电话号码"/>)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...lineItem} label="生日">
                        {getFieldDecorator('birthday', {
                          initialValue: moment(currentUserdata.birthday || new Date(), dataFormat)
                        })(<DatePicker format={dataFormat} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>

            </Card>
        <Row type="flex" justify="center">
          <Col>
            <Button type={'primary'} onClick={this.modifyPassword}>修改密码</Button>
          </Col>
          <Col span={1}/>
          <Col>
            <Button onClick={this.modifyPersonInfo} loading={editLoading}>保存</Button>
          </Col>
        </Row>
        <EditPassword {...editPswProps}/>
      </GridContent>
    );
  }
}

export default Center;
