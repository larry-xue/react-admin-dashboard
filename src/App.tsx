import React from 'react';
import PageLayout from './components/layout';
import { ConfigProvider } from 'antd';
import useConfigStore from './store/config';

const App: React.FC = () => {
  const theme = useConfigStore(state => state.themeConfig)

  return (
    <ConfigProvider theme={{
      algorithm: theme.algorithm,
      token: {
        colorPrimary: theme.primaryColor
      }
    }}>
      <PageLayout />
    </ConfigProvider>
  )
};

export default App;
