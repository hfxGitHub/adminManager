import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import { formItemLayout } from '../../utils/globalUIConfig';
import { EDIT_FLAG, GENDER, USERTYPE } from '../../utils/Enum';
import AdvancedSelect from '../../components/AdvancedSelect';

const FormItem = Form.Item;

@Form.create()
@connect(({ userModal, basicdata, loading }) => ({
  userModal,
  basicdata,
  loadingUpdate: loading.effects['userModal/edit'],
  loadingGet: loading.effects['userModal/getDetail'],
}))
class UserDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleStateChange = (value) => {

  };

  handleProviderChange = (value) => {
  };

  submitForm = () => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    const { form, userModal: {detailData} } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        sendData = {
          ...sendData,
          userId: detailData.userId,
        };
        console.log(sendData)
        dispatch({
          type: 'userModal/edit',
          payload: sendData,
        });
        onChangeDrawerVisible(false);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
    } = this.props;
    let { userModal: { detailData } } = this.props;
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          {/*<Row type="flex" justify="center">*/}
          {/*<Col span={24}>*/}
          {/*<FormItem {...formItemLayout} label="用户ID">*/}
          {/*{getFieldDecorator('userId', {*/}
          {/*initialValue: detailData.userId || '',*/}
          {/*rules: [*/}
          {/*{*/}
          {/*required: true,*/}
          {/*readOnly: true,*/}
          {/*},*/}
          {/*],*/}
          {/*})(<Input placeholder='用户ID' readOnly="readOnly"/>)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          {/*</Row>*/}
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('userName', {
                  initialValue: detailData.userName || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Input placeholder='用户名'/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('gener', {
                  initialValue: (detailData.gener),
                  rules: [
                    {
                      // required: true,
                      // min: 1,
                    },
                  ],
                })(<AdvancedSelect dataSource={GENDER} type="DATADICT" onChange={this.handleProviderChange}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="身份证号码">
                {getFieldDecorator('idCardNumber', {
                  initialValue: detailData.idCardNumber || '',
                  rules: [
                    {
                      // required: true,
                      // min: 1,
                    },
                  ],
                })(<Input placeholder='身份证号码'/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="电话号码">
                {getFieldDecorator('tellNumber', {
                  initialValue: detailData.tellNumber || '',
                  rules: [
                    {
                      // required: true,
                      // min: 1,
                    },
                  ],
                })(<Input placeholder='电话号码'/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <FooterToolbar style={{ width: '100%' }}>
          <Button type="primary" onClick={this.submitForm} loading={loadingUpdate}>
            保存
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={closeFunction}>
            取消
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default UserDetail;
