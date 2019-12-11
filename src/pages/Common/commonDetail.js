import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input } from 'antd';
import 'braft-editor/dist/index.css';
import styles from '../../utils/styles/TableStyle.less';
import FooterToolbar from '@/components/FooterToolbar';
import { formItemLayout } from '../../utils/globalUIConfig';
import { EDIT_FLAG } from '../../utils/Enum';

const FormItem = Form.Item;

@Form.create()
@connect(({ commonModal, basicdata, loading }) => ({
  commonModal,
  basicdata,
  loadingUpdate: loading.effects['commonModal/edit'],
  loadingGet: loading.effects['commonModal/getDetail'],
}))
class CommonDetail extends PureComponent {

  submitForm = () => {
    const { form, commonModal: { editFlag, detailData } } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            sendData = {
              ...sendData,
              commonId: detailData.commonId,
            };
            this.update(sendData);
            break;
          case EDIT_FLAG.ADD:
            sendData = {
              ...sendData,
            };
            this.add(sendData);
            break;
          default:
            break;
        }
      }
    });
  };

  update = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'commonModal/replyCommon',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };

  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
    } = this.props;
    const { commonModal: { detailData } } = this.props;
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={4}>留言内容</Col>
            <Col className={styles.Coleven} span={20}>{detailData.commonDetail}</Col>
          </Row>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={4}>留言时间</Col>
            <Col className={styles.Coleven} span={8}>{detailData.commonTime}</Col>
            <Col className={styles.Colodd} span={4}>留言人ID</Col>
            <Col className={styles.Coleven} span={8}>{detailData.userId}</Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="回复留言">
                {getFieldDecorator('replyDetail', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='回复留言'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={16}>全部回复</Col>
            <Col className={styles.Colodd} span={8}>回复时间</Col>
          </Row>
          {
            detailData.replies.map((item,index)=>{
              return(
                <Row className={styles.Row}>
                  <Col className={styles.Coleven} span={16}>{item.replyDetail}</Col>
                  <Col className={styles.Coleven} span={8}>{item.replyTime}</Col>
                </Row>
              )
            })
          }
        </Form>
        <FooterToolbar style={{ width: '100%' }}>
          <Button type="primary" onClick={this.submitForm} loading={loadingUpdate}>
            回复
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={closeFunction}>
            关闭
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default CommonDetail;
