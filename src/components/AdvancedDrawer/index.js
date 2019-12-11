import React, { PureComponent } from 'react';
import { Drawer, Row, Col, Button, Icon } from 'antd';
import style from './index.less';


export default class AdvancedDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      drawerWidth: '60%',
      drawerWidthFlag: 'left',
    };
  }

  constructTitleBar = () => {
    const { drawerTitle } = this.props;
    const { drawerWidthFlag } = this.state;
    return (
      <div style={{ display: 'flex', }}>
        <span
          onClick={this.changeDrawerWidth}
          className={style.drawerTitleBarDefault}
        >
          <Icon type={`${drawerWidthFlag}`}/>
        </span>
        <span style={{ fontSize: 25 }}>&nbsp;&nbsp;{drawerTitle}</span>
      </div>
    );
  };

  changeDrawerWidth = () => {
    const { drawerWidthFlag: flag, drawerWidth: width } = this.state;
    this.setState({
      drawerWidthFlag: flag === 'right' ? 'left' : 'right',
      drawerWidth: width === '100%' ? '60%' : '100%',
    });
  };

  constructMyDrawer = (content, options) => {
    return React.cloneElement(content, { ...options });
  };

  onCloseDrawer = () => {
    const { onChangeDrawerVisible } = this.props;
    this.setState({
      drawerWidthFlag: 'left',
      drawerWidth: '60%',
    });
    return onChangeDrawerVisible(false);
  };

  render() {
    const { drawerVisible, drawerContent, ...otherProps } = this.props;
    const { drawerWidth } = this.state;
    return <Drawer
      title={this.constructTitleBar()}
      placement="right"
      closable
      onClose={this.onCloseDrawer}
      visible={drawerVisible}
      width={drawerWidth}
      destroyOnClose
      {...otherProps}
    >
      {
        this.constructMyDrawer(drawerContent, otherProps)
      }
    </Drawer>;
  }
}
