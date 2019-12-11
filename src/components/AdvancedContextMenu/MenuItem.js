import React, { PureComponent } from 'react';
import style from './index.less';

class ContextMenuItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  defaultFunction = () => {
    const { func, closeMenu, disable } = this.props;
    if (!disable) {
      func({...this.props});
      return closeMenu();
    }
  };

  render() {
    const { label, disable } = this.props;
    return <div
      className={style.itemStyle}
      onClick={this.defaultFunction}
    >
      {label}
    </div>;
  }
}

export default ContextMenuItem;
