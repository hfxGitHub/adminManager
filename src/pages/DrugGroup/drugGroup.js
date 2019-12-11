import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Row, Col, Input, Button, Icon } from 'antd';
import { lineItem } from '../../utils/globalUIConfig';
import remoteLinkAddress from '../../utils/ip';
import { EDIT_FLAG } from '../../utils/Enum';

const FormItem = Form.Item;

@connect(({ drugGroupModal, basicdata, loading }) => ({
  loading,
  drugGroupModal,
  basicdata,
}))
@Form.create()

class DrugGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submitForm = () => {
    const { form, dispatch, selectedRows } = this.props;
    form.validateFields((err) => {
      if (!err) {
        const sendData = form.getFieldsValue();
        if (this.props.title == '新增分组信息') {
          dispatch({
            type: 'drugGroupModal/newGroup',
            payload: sendData,
          });
        } else {
          dispatch({
            type: 'drugGroupModal/newGroup',
            payload: {
              ...sendData,
              groupId: selectedRows[0].groupId,
            }
            ,
          });
        }

        this.onHandleCancel();
      }
    });
  };

  onHandleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const { form: { getFieldDecorator }, title, visible, drugGroupModal: { detailData } } = this.props;
    let groupData = {
      groupName: '',
    };
    if (this.props.title == '修改') {
      groupData = detailData;
    }
    console.log(groupData)
    return (
      <Modal
        width='50%'
        visible={visible}
        title={title}
        onCancel={this.onHandleCancel}
        onOk={this.submitForm}
        footer={[
          <Button key="submit" type="primary" onClick={this.submitForm}>
            确定
          </Button>,
        ]}
      >
        <Form>
          {/*<Row type="flex" justify="center">*/}
          {/*<Col span={24}>*/}
          {/*<FormItem {...lineItem} label="药品分组Id">*/}
          {/*{getFieldDecorator('groupId', {*/}
          {/*initialValue: '',*/}
          {/*rules: [*/}
          {/*{*/}
          {/*required: true,*/}
          {/*},*/}
          {/*],*/}
          {/*})(<Input placeholder='请输入药品分组Id'/>)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          {/*</Row>*/}
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...lineItem} label="药品分组名称">
                {getFieldDecorator('groupName', {
                  initialValue: groupData.groupName || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入药品分组名称'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default DrugGroup;
