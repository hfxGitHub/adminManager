import React, { PureComponent } from 'react';
import { Form, Card, Button, Col, Row, Input, Upload, Icon, message, Modal } from 'antd';
import styles from '../../utils/styles/TableStyle.less';
import { formItemLayout } from '../../utils/globalUIConfig';


const FormItem = Form.Item;
@Form.create()


class DrugDetailTable extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      drugIdData:[],//用于生成select
      btnType:0,
      drugId:0,
      drugName:'',
      count:0,
    };
  }

  render(){
    const {form: { getFieldDecorator },loadingUpdate,loadingGet,detailData}=this.props;
    this.setState({
      drugIdData:detailData.drugData
    });
    return(
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="订单ID">
                {getFieldDecorator('orderId', {
                  initialValue: detailData.order.orderId || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='订单ID' readOnly="readOnly" />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="订单时间">
                {getFieldDecorator('orderTime', {
                  initialValue: detailData.order.orderTime || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Input placeholder='订单ID' readOnly="readOnly"/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="订单备注">
                {getFieldDecorator('orderNote', {
                  initialValue: detailData.order.orderNote || '',
                  rules: [
                    {
                      // required: true,
                      // min: 1,
                    },
                  ],
                })(<Input placeholder='订单备注' readOnly="readOnly"/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="订单地址">
                {getFieldDecorator('orderAddress', {
                  initialValue: detailData.order.orderAddress || '',
                  rules: [
                    {
                      // required: true,
                      // min: 1,
                    },
                  ],
                })(<Input placeholder='订单地址' readOnly="readOnly"/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Form style={{ marginTop: 8 }}>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={14}>药品名称</Col>
            <Col className={styles.Colodd} span={10}>药品数量</Col>
          </Row>
          {

            detailData.orderDetail.map((item,index)=>{
                return(
                  <Row className={styles.Row} key={index}>
                    <Col className={styles.Colodd} span={14}>
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator('drugName'+index, {
                          initialValue: item.durgName || '',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input placeholder='药品名称' readOnly="readOnly" />)}
                      </FormItem>
                    </Col>
                    <Col className={styles.Colodd} span={10}>
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator('count'+index, {
                          initialValue: item.count || '',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input placeholder='药品数量' readOnly="readOnly" />)}
                      </FormItem>
                    </Col>
                  </Row>
                )
            })
          }
        </Form>
      </Card>
    );
  }
}

export default DrugDetailTable;
