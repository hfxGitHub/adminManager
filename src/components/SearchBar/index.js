import React, { PureComponent } from 'react';
import { Row, Col, Button, Input, Form, Select } from 'antd';
import styles from './index.less';
import { meetingSelectOptions } from '../../utils/globalData';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class SearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  createSelection = (placeHolder, isSearchDisabledKey, src) => {
    return (
      <Select placeholder={placeHolder} disabled={isSearchDisabledKey}>
        {src.map((item) => <Option key={item.key} value={item.value}>{item.text}</Option>)}
      </Select>
    );
    // return (
    //   <Select defaultValue="lucy" style={{ width: 120 }}>
    //     <Option value="jack">Jack</Option>
    //     <Option value="lucy">Lucy</Option>
    //     <Option value="disabled" disabled>Disabled</Option>
    //     <Option value="Yiminghe">yiminghe</Option>
    //   </Select>
    // )
  };


  getSearchFromItem = (type, placeHolder, isSearchDisabledKey, src) => {
    let searchFromItem = '';
    console.log(type);
    switch (type) {
      case 'input':
        searchFromItem = <Input placeholder={placeHolder} disabled={Boolean(isSearchDisabledKey)} />;
        break;
      case 'select':
        searchFromItem = this.createSelection(placeHolder, isSearchDisabledKey, src);
        break;
      default:
        break;
    }
    return searchFromItem;
  };

  renderSearchForm = (meetingSearchKeyData) => {
    const { form: { getFieldDecorator }, meetingSelectOptions } = this.props;
    const count = meetingSearchKeyData.length;
    const rowCount = Math.ceil(count / 3); // 向上舍入
    const mod = count % 3;
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const cols = [];
      const colCount = i === rowCount - 1 && mod !== 0 ? mod: 3;
      for (let j = 0; j < colCount; j++) {
        const { fieldName, isSearchRequiredKey, isSearchDisabledKey, type } = meetingSearchKeyData[i * 3 + j];
        console.log(fieldName, isSearchRequiredKey, isSearchDisabledKey);
        const message = `Please input your ${fieldName}!`;
        const placeHolder = `please input ${fieldName}`;
        const src = meetingSelectOptions[fieldName] ? meetingSelectOptions[fieldName]: '';
        const formItem = this.getSearchFromItem(type, placeHolder, isSearchDisabledKey, src);
        cols.push(
          <Col md={8} sm={24}>
            <FormItem label={fieldName}>
              {getFieldDecorator(fieldName, {
                rules: [
                  {
                    required:  Boolean(isSearchRequiredKey),
                    message
                  },
                ],
              })(formItem
              )}
            </FormItem>
          </Col>
        )
      }
      const row = <Row gutter={{ md: 8, lg: 24, xl: 48 }}>{cols}</Row>;
      rows.push(row)
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {rows}
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
            查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    )
  };

  handleSearch = (e) => {
    const { handleSearchForm } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      handleSearchForm(values);
    });
  };

  handleReset = () => {
    const { handleSearchReset } = this.props;
    this.props.form.resetFields();
    handleSearchReset();
  };

  render() {
    const {
      meetingSearchKeyData
    } = this.props;
    return (
      <div className={styles.tableListForm}>
        {meetingSearchKeyData.length ? this.renderSearchForm(meetingSearchKeyData): ''}
      </div>
    );
  }
}



export default SearchBar;
