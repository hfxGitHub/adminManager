import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Modal, Input, Row, Col, TreeSelect} from 'antd';
import {formItemLayout} from '../../../utils/globalUIConfig';
import {formatMessage, FormattedMessage} from 'umi/locale';

const FormItem = Form.Item;

@connect(({centerModel, basicdata, loading}) => ({
  basicdata,
  centerModel,
  loading: loading.models.centerModel,
}))
@Form.create()

export default class EditPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  onHandleSave = () => {
    const {dispatch, form,handleCancel} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: `centerModel/editPassword`,
          payload: values,
        })
        handleCancel();
      }
      else{
        return;
      }

    })
  }

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    const newPsw = form.getFieldValue('newPassword');
    if (newPsw != value) {
      callback('新密码不一致!');
    }
    else {
      callback();
    }
  }

  render() {
    const {centerModel: {currentUserdata}} = this.props;
    const {handleCancel, visiblePersonInfo, title, form: {getFieldDecorator}} = this.props;
    return (
      <Modal
        width='30%'
        visible={visiblePersonInfo}
        title={title}
        okText="确定"
        onCancel={handleCancel}
        onOk={this.onHandleSave}
      >
        <Form style={{marginTop: 8}}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label={'旧密码'}>
                {getFieldDecorator('oldPassword', {
                  initialValue: currentUserdata.oldPassword || '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      max: 11,
                      message: formatMessage({id: 'validation.userName.required'}),
                    },
                  ],
                })(<Input placeholder={"请输入旧密码"}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label={'新密码'}>
                {getFieldDecorator('newPassword', {
                  initialValue: currentUserdata.newPassword || '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      max: 11,
                      message: formatMessage({id: 'validation.userName.required'}),
                    }
                  ],
                })(<Input placeholder={"请输入新密码"}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label={'确认新密码'}>
                {getFieldDecorator('newPsw', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      max: 11,
                      message: formatMessage({id: 'validation.userName.required'}),
                    },
                    {validator: this.checkConfirm}
                  ],
                })(<Input placeholder={"请确认新密码"}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
