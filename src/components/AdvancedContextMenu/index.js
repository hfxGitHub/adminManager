import React, { PureComponent } from 'react';

import { Popover, Button } from 'antd';
import MenuItem from './MenuItem';

class AdvancedContextMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  closeMenu = () => {
    this.setState({
      visible: false,
    });
  };

  onMenuVisibleChange = (value) => {
    this.setState({
      visible: value,
    });
  };

  constructMenu = () => {
    const { content = [], ...other } = this.props;
    return content.map((current) => {
      const props = { ...current, ...other };
      return <MenuItem
        key={current.label}
        closeMenu={this.closeMenu}
        {...props}/>;
    });
  };

  render() {
    const { visible } = this.state;
    const { children, exContent } = this.props;
    return (
      <Popover
        content={exContent || this.constructMenu()}
        trigger="contextMenu"
        placement="bottomLeft"
        visible={visible}
        onVisibleChange={this.onMenuVisibleChange}
      >
        {children}
      </Popover>
    );
  };
}


export default AdvancedContextMenu;
