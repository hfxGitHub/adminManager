import React, { PureComponent } from 'react';
import { Row, Col, Button, Input, Form, message, Card, Select, DatePicker, InputNumber } from 'antd';
import AdvancedSelect from '../AdvancedSelect/index';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol : {
    xs : { span : 24 },
    sm : { span : 5 },
    md : { span : 7 },
  },
  wrapperCol : {
    xs : { span : 24 },
    sm : { span : 19 },
    md : { span : 15 },
  },
};

@Form.create()
class AdvancedSearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.col = 4;
    this.state = {};
  }

  static propTypes = {
    searchList: PropTypes.array.isRequired,//父组件选中的数据
    pagination: PropTypes.object.isRequired,
    doSearch: PropTypes.func.isRequired,
  };

  constructSearchComponent = () => {

    const { searchList, col, form: { getFieldDecorator } } = this.props;
    const _col = col || this.col;
    const result = [];
    const _row = parseInt(searchList.length / _col);
    for (let i = 0; i <= _row; i++) {
      const rowContent = [];
      for (let j = 0; j < _col; j++) {
        let num = i * _col + j;
        if (searchList.length > num) {
          const current = searchList[num];
          const { title, field, value, reg, required, message, type } = current;
          const rules = {
            pattern: reg ? reg.reg : '',
            whitespace: true,
            message: (reg ? reg.msg : message) || '',
            required: required || false,
          };
          if (type === 'inputNumber') {
            delete rules.pattern;
            delete rules.whitespace;
          }
          rowContent.push(<Col span={24 / _col} key={field}>
            <FormItem
              {...formItemLayout}
              label={title || ''}
            >
              {getFieldDecorator(field, {
                initialValue: value || '',
                rules: [rules],
              })(
                this.createComponent(current),
              )}
            </FormItem>
          </Col>);
        }
      }
      if (rowContent.length > 0) {
        const RowData = <Row key={i}>{rowContent}</Row>;
        result.push(RowData);
      }
    }
    return (result);
  };

  createSelection = (src) => {
    return (
      <Select
        style={{ width: '100%' }}
      >
        {src.map((current) => {
          return <Option key={current.key}>{current.value}</Option>;
        })}
      </Select>
    );
  };

  createComponent = (props) => {
    const { title, type:componentType, renderComponent,src} = props;
    const typeMap = {
      input: () => (<Input style={{ width: '100%' }} {...props} />),
      select: () => (this.createSelection(src)),
      datePicker: () => (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={title || ''} {...props} />),
      inputNumber: () => (<InputNumber style={{ width: '100%' }} {...props} />),
      // advancedSelect: () => (<AdvancedSelect dataSource={src} type={selectType} onChange={onChange} />),
      other:() =>renderComponent(),
    };
    return typeMap[componentType]();
  };

  doSearch = () => {
    const { api, doSearch, form, pagination } = this.props;
    // const aimUrl = createTheURL(api,'list');
    const formData = form.getFieldsValue();
    let params = {};
    if (pagination) {
      const { currentPage=1, pageSize=20 } = pagination;
      params = { ...params, currentPage, pageSize };
    }
    Object.keys(formData).forEach((current) => {
      if (formData[current] !== '') {
        params[current] = formData[current];
      }
    });
    form.validateFields((err) => {
      if (!err) {
        doSearch(params);
      } else {
        message.error('搜索信息输入有误！');
      }
    });
  };

  doReset = () => {
    const { api, doSearch, form, pagination: { currentPage, pageSize } } = this.props;
    const params = { currentPage, pageSize };
    doSearch(params);
    form.resetFields();
  };

  render() {
    return (
      <Card style={{ marginBottom: 15 }} bordered={false}>
        <Form>
          {this.constructSearchComponent()}
        </Form>
        <Row>
          <Col offset={20}>
            <ButtonGroup style={{ width: '100%' }}>
              <Button type="primary" style={{ width: '50%' }} onClick={this.doSearch}>搜索</Button>
              {/*<Button style={{ width: '50%' }} onClick={this.doReset}>重置</Button>*/}
            </ButtonGroup>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default AdvancedSearchForm;
