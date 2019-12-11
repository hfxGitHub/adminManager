import React, { PureComponent, Fragment } from 'react';
import {
  List,
  Drawer,
  Row,
  Anchor,
  Alert,
  Col,
  Affix,
  Card,
  Checkbox,
  Button,
  Input,
  Form,
  Select,
  Icon,
} from 'antd';
import MultiFunctionCard from './MultifunctionalCard/index';
import style from './index.less';
import { deepCopy } from '../../utils/utils';
import ToolBarGroup from '@/components/ToolBarGroup';
import { SIGN_COLOR } from '../../utils/Enum';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class MultifunctionalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checks: {},
      allChecked: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { checks } = nextProps;
    if (Array.isArray(checks) && checks.length === 0) {
      this.setState({ checks });
    }
  }

  checkOnchange = (e, data) => {
    const { onSelectChange } = this.props;
    const { pagination: { pageSize } } = this.state;
    const checksArray = Object.keys(data).map(current => data[current].status ? data[current] : null).filter(
      current => current,
    );
    this.setState({
      checks: data,
      allChecked: checksArray.length === pageSize,
    });
    return onSelectChange(checksArray);
  };

  checkAll = (e) => {
    const { checks } = this.state;
    const { onSelectChange } = this.props;
    const allChecked = e.target.checked;
    const checkState = deepCopy(checks);
    Object.keys(checkState).forEach(current => {
        checkState[current].status = allChecked;
        checkState[current].drug = Number(current);
      },
    );
    this.setState({
      allChecked,
      checks: checkState,
    });
    const checksArray = Object.keys(checkState).map(current => checkState[current].status ? checkState[current] : undefined).filter(
      current => current,
    );
    return onSelectChange(checksArray);
  };

  getChecked = () => {
    const { checks } = this.state;
    const result = Object.keys(checks).map(current => checks[current].status ? checks[current] : undefined).filter(
      current => current,
    );
    return result;
  };

  initCk = (data) => {
    this.setState({
      checks: data,
    });
  };

  update = () => {
    const { form, updateFunction } = this.props;
    const data = form.getFieldsValue();
    return updateFunction(data);
  };

  cleanSelectedKeys = () => {
    const { checks } = this.state;
    const { onSelectChange } = this.props;
    const allChecked = false;
    const checkState = deepCopy(checks);
    Object.keys(checkState).forEach(current => {
        checkState[current].status = allChecked;
        checkState[current].drug = current;
      },
    );
    this.setState({
      allChecked,
      checks: checkState,
    });
    return onSelectChange([]);
  };

  turnPage = (page, pageSize) => {
    const { pagination: { turnPage } } = this.props;
    const params = {
      currentPage: page,
      pageSize,
    };
    this.setState({
      checks: {},
      allChecked: false,
      pagination: {
        ...params,
      },
    });
    turnPage(params);
  };

  render() {
    const {
      dataSource,
      loadingList,
      cardOption,
      updateFunction,
      ck,
      pagination,
      btnOptions,
    } = this.props;
    const { checks, allChecked } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.turnPage,
      onShowSizeChange: this.turnPage,
      ...pagination,
    };
    return (
      <Card>
        <ToolBarGroup btnOptions={btnOptions} selectedRows={this.getChecked()}/>
        {ck &&
        <Card
          className={style.titleBarDefault}
        >
          <Row className={style.titleBarDefaultRow}>
            <Col span={1}>
              <Checkbox
                // style={{ marginTop: '25%', marginLeft: '10%' }}
                onChange={this.checkAll}
                indeterminate={!!this.getChecked().length && this.getChecked().length < Object.keys(checks).length}
                checked={allChecked}
              />
            </Col>
            <Col span={ck ? 23 : 24}>
              <Alert
                message={
                  <Fragment>
                    已选择 <a style={{ fontWeight: '100%' }}>{this.getChecked().length}</a> 项&nbsp;&nbsp;
                    <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                      清空
                    </a>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </Col>
          </Row>
        </Card>
        }
        <List
          itemLayout="vertical"
          dataSource={dataSource}
          loading={loadingList}
          renderItem={(item, index) =>
            <MultiFunctionCard
              data={item}
              index={index}
              update={updateFunction}
              checkFunction={this.checkOnchange}
              checks={checks}
              ck={ck}
              initCk={this.initCk}
              {...cardOption}
            />
          }
          pagination={paginationProps}
        />
      </Card>
    );
  }
}

export default MultifunctionalList;
