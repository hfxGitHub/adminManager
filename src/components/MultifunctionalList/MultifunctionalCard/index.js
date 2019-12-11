import React, { PureComponent } from 'react';
import { Card, Row, Col, Dropdown, Icon, Menu, Button, Checkbox } from 'antd';
import style from './index.less';
import { findValueByKey } from '../../../utils/utils';
import { deepCopy } from '../../../utils/utils';

class MultiFunctionCard extends PureComponent {
  constructor(props) {
    super(props);
    this.unEditNums = 5;
    this.editNums = 4;
    this.state = {
      data: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data, index, checks, ck, initCk } = nextProps;
    if (checks[index] === undefined) {
      checks[index] = {};
      checks[index].status = false;
      checks[index].data = data;
    }
    this.setState({
      data,
    });
    initCk(checks);
  }

  createUnEditableCol = () => {
    const { defaultClick, detail, sign } = this.props;
    const { data } = this.state;
    const unEditableDetail = detail.filter(current =>
      !current.editable,
    );
    const result = unEditableDetail.map((current, index) => {
      return (
        <Col span={current.span || this.unEditNums} key={index}>
          {current.icon}
          {current.title ? <span>{current.title}:</span> : ''}
          <a
            onClick={() => {
              const { data: now } = this.state;
              return defaultClick && defaultClick(now);
            }}
          >
            {current.src ? findValueByKey(data[current.field], current.src) : data[current.field]}
          </a>
        </Col>
      );
    });
    if (sign) {
      result.unshift(
        <Col span={sign.span || this.editNums} key='sign'>
          {sign.icon}
          {sign.title ? sign.title : ''}
          <Dropdown overlay={this.createMenu(sign.field, sign.src)}>
            <Button
              size='small'
              style={{
                border: 'none',
                background: findValueByKey(data[sign.field], sign.src, 'color', '#40a9ff'),
                color: 'white',
              }}>
              {sign.src ? findValueByKey(data[sign.field], sign.src) : data[sign.field]} <Icon type="down"/>
            </Button>
          </Dropdown>
        </Col>,
      );
    }
    return result;
  };

  createEditableCol = () => {
    const { data, detail } = this.props;
    const editableDetail = detail.filter(current =>
      current.editable,
    );
    return (
      editableDetail.map((current, index) => {
        return <Col span={current.span || this.editNums} key={index}>
          {current.icon}
          {current.title ? current.title : ''}
          <Dropdown overlay={this.createMenu(current.field, current.src)}>
            <a className="ant-dropdown-link">
              {current.src ? findValueByKey(data[current.field], current.src) : data[current.field]}
              <Icon type="down"/>
            </a>
          </Dropdown>
        </Col>;
      })
    );
  };

  createMenu = (key, menuData) => {
    const than = this;
    return (
      <Menu>
        {menuData.map((current, index) => {
          return (
            <Menu.Item
              key={`item${index}`}
            >
              <a
                onClick={() => {
                  than.updateData(key, current);
                }}
              >
                {current.value}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>);
  };

  updateData = (key, newData) => {
    const { update } = this.props;
    const { data: oldData } = this.state;
    oldData[key] = newData.key;
    this.setState({
      data: oldData,
    });
    return update(oldData);
  };

  checkOnChange = (e, data, index) => {
    const { checks, checkFunction } = this.props;
    const checkState = deepCopy(checks);
    checkState[index] = checkState[index] || {};
    checkState[index].status = e.target.checked;
    checkState[index].data = data;
    checkState[index].drug = index;

    return checkFunction(e, checkState);
  };

  addOtherEventListener = (otherEvent) => {
    const props = {};
    const { data } = this.state;
    for (const current in otherEvent) {
      if (otherEvent.hasOwnProperty(current)) {
        if (otherEvent[current] instanceof Function) {
          props[current] = function() {
            return otherEvent[current](data);
          };
        }
      }
    }
    return props;
  };

  render() {
    const { index, checks, ck, otherEvent, detail } = this.props;
    const { data } = this.state;
    const OtherEventListener = this.addOtherEventListener(otherEvent);
    const secondRow = detail.filter((current) => {
      return current.editable === true;
    });
    return (
      <Card
        className={index % 2 === 0 ? style.odd : style.even}
        {...OtherEventListener}
        key={`Card${index}`}
      >
        <Row className={style.defaultRow}>
          {ck && checks[index] &&
          (
            <Col span={1}>
              <Checkbox
                onChange={(e) => this.checkOnChange(e, data, index)}
                checked={checks[index].status}
              />
            </Col>
          )
          }
          <Col span={!ck ? 24 : 23}>
            <Row className={style.unEditableRow} justify='start'>
              {this.createUnEditableCol().splice(0, this.unEditNums)}
            </Row>
            {secondRow.length > 0 &&
            <Row className={style.editableRow} justify='start'>
              {this.createEditableCol().splice(0, this.editNums)}
            </Row>
            }
          </Col>
        </Row>
      </Card>
    );
  }
}

export default MultiFunctionCard;
