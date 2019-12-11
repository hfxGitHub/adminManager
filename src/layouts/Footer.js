import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '医药管理平台',
          title: '医药管理平台',
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
