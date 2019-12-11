import React, { PureComponent } from 'react';
import { Button, Menu, Dropdown, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const BUTTON_ARRAY = [{
  name: '新建',
  key: 'ADD',
  icon: 'file',
  param: {},
  function: '',
}, {
  name: '增加药品分组',
  key: 'NEW',
  icon: 'plus-circle',
  param: {},
  func: '',
}, {
  name: '修改',
  key: 'EDIT',
  icon: 'edit',
  param: {},
  func: '',
}, {
  name: '批量删除',
  key: 'PATCH_DELETE',
  icon: 'delete',
  param: {},
  func: '',
}, {
  name: '删除',
  key: 'DELETE',
  icon: 'delete',
  param: {},
  func: '',
}, {
  name: '刷新',
  key: 'REFRESH',
  icon: 'reload',
  param: {},
  func: '',
}, {
  name: '查看',
  key: 'EYE',
  icon: 'eye',
  param: {},
  func: '',
}, {
  name: '推荐',
  key: 'PROJECT_RECOMMEND',
  icon: 'like',
  param: {},
  func: '',
}];


class ToolBarGroup extends PureComponent {

  static propTypes = {
    selectedRows: PropTypes.array.isRequired,//父组件选中的数据
    primaryBtn: PropTypes.array.isRequired,
    patchBtn: PropTypes.array,
    menuBtn: PropTypes.array,
  };

  static defaultProps = {
    primaryBtn: [],
    patchBtn: [],
    menuBtn: [],
    selectedRows: [],
  };


  constructor(props) {
    super(props);
    this.state = {
      selectPrimaryBtn: [],
      selectPatchBtn: [],
      selectMenuBtn: [],
    };
  }

  componentDidMount() {
    const { btnOptions } = this.props;

    let select = [];
    if (btnOptions) {
      const { primaryBtn, patchBtn, menuBtn } = btnOptions;
      this.setState({
        selectPrimaryBtn: this.getBtnData(primaryBtn) || [],
        selectPatchBtn: this.getBtnData(patchBtn) || [],
        selectMenuBtn: this.getBtnData(menuBtn) || [],
      });
    }
  }

  getBtnData = (btnData) => {
    let resData = [];
    if (!btnData) {
      return;
    }
    btnData.forEach((v) => {
      let tmpBtn = BUTTON_ARRAY.find((o) => {
        return o.key == v.key;
      });
      if (tmpBtn) {
        const { func, param } = v;
        tmpBtn = {
          ...tmpBtn,
          func,
          param,
        };
        resData.push(tmpBtn);
      }
    });
    return resData;
  };

  renderPrimaryBtn = () => {
    let items = [];
    const { selectPrimaryBtn } = this.state;
    if (selectPrimaryBtn.length == 0) {
      return items;
    }
    selectPrimaryBtn.forEach((v) => {
      items.push(<Button icon={v.icon} type="dashed" key={v.key}
                         onClick={() => v.func({ ...v.param })}> {v.name}</Button>);
    });
    return items;
  };

  renderPatchBtn = () => {
    let items = [];
    const { selectPatchBtn } = this.state;
    if (selectPatchBtn.length == 0) {
      return items;
    }
    selectPatchBtn.forEach((v) => {
      items.push(<Button icon={v.icon} key={v.key} onClick={() => v.func({ ...v.param })}> {v.name}</Button>);
    });
    return items;
  };
  renderMenuBtn = () => {
    let items = [];
    const { selectMenuBtn } = this.state;
    if (selectMenuBtn.length == 0) {
      return items;
    }
    selectMenuBtn.forEach((v) => {
      items.push(<Menu.Item key={v.key} onClick={() => v.func({ ...v.param })}> {v.name}</Menu.Item>);
    });
    return (<Menu>{items}</Menu>);
  };
  showMenu = () => {
    const { selectMenuBtn } = this.state;
    const menu = this.renderMenuBtn();
    if (selectMenuBtn.length > 0) {
      return (
        <Dropdown overlay={menu}>
          <Button>
            更多操作 <Icon type="down"/>
          </Button>
        </Dropdown>
      );
    }
    else {
      return '';
    }
  };


  render() {
    //selectedRows表示上层选中的数据

    const { selectedRows } = this.props;
    return (
      <div className={styles.listOperator}>
        {this.renderPrimaryBtn()}
        {selectedRows.length > 0 && (
          <span>
            {this.renderPatchBtn()}
            {this.showMenu()}
            </span>
        )}
      </div>
    );
  }
}

export default ToolBarGroup;
