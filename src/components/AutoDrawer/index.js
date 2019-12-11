import React, { PureComponent } from 'react';
import { Row, Col, Button, Input, Form, Select, Icon, Drawer, DatePicker } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class AutoDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { handleFormAdd, handleFormEdit, type, onClose } = this.props;
    const handleFormOperation = type === 'add' ? handleFormAdd: handleFormEdit;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleFormOperation(values);
        onClose();
      }
    });
  };

  renderForm = (keyArr) => {
    const { form: { getFieldDecorator }, meetingEditData = {}, type } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const formItems = keyArr.map(item => {
      const { fieldName, isRequiredKey, isDisabledKey } = item;
      const initialValue = type === 'edit' ? meetingEditData[fieldName]: '';
      const placeHolder = `please input ${fieldName}`;
      const message = `Please input your ${fieldName}!`;
      return (
        <FormItem {...formItemLayout} label={fieldName}>
          {getFieldDecorator(fieldName, {
            initialValue,
            rules: [
              {
                required:  Boolean(isRequiredKey),
                message
              },
            ],
          })(<Input placeholder={placeHolder} disabled={Boolean(isDisabledKey)} />)}
        </FormItem>
      )
    });
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        {formItems}
      </Form>
    )
  };

  render() {
    const {
      showDrawer,
      onClose,
      visible,
      width,
      formArr,
      type
    }
     = this.props;
    const addKey = formArr.map(item => ({
      fieldName: item.fieldName,
      isRequiredKey: item.isAddRequiredKey,
      isDisabledKey: item.isAddDisabledKey
    }));
    const editKey = formArr.map(item => ({
      fieldName: item.fieldName,
      isRequiredKey: item.isEditRequiredKey,
      isDisabledKey: item.isEditDisabledKey
    }));
    const keyArr = type === 'add' ? addKey: editKey;
    const form = this.renderForm(keyArr);
    return (
      <div>
        <Button type="primary" onClick={() => showDrawer('add')}>
          <Icon type="plus" /> New account
        </Button>
        <Drawer
          title="Create a new account"
          width={width || 720}
          onClose={onClose}
          visible={visible}
          style={{
            overflow: 'auto',
            height: 'calc(100% - 108px)',
            paddingBottom: '108px',
          }}
          destroyOnClose
        >
          {form}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default AutoDrawer;
