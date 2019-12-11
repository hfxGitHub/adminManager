import React, { PureComponent } from 'react';
import { Button } from 'antd';
import style from './index.less';

class ToolBar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { BtnList } = this.props;
    return (
      <div className={style.toolbar}>
        {
          BtnList.map((item, index) => {
            return (
              <Button
                style={{ display: item.ishow || 'inline' }}
                icon={item.icon}
                type={item.type || 'default'}
                onClick={item.click}
                key={`toolbar${index}`}
                disabled={item.disabled}
              >
                {item.name}
              </Button>
            );
          })
        }
      </div>
    );
  }
}

export default ToolBar;
