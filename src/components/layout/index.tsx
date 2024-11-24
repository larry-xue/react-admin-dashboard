import React from 'react';

import { Layout, theme } from 'antd';
import PageSidebar from './sidebar';
import PageContent from './contentbar';
import PageBreadcrumb from './breadcrumb';
import Headerbar from './headerbar';

const { Footer } = Layout;

const PageLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <PageSidebar />
      <Layout>
        <Headerbar colorBgContainer={colorBgContainer} />
        <PageBreadcrumb />
        <PageContent></PageContent>
        <Footer style={{ textAlign: 'center' }}>
          React Admin Dashboard ©{new Date().getFullYear()} Created by Yujian Xue
        </Footer>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
