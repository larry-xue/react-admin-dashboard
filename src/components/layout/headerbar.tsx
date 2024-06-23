
import { Layout } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
const { Header } = Layout;

const Headerbar = (props: { colorBgContainer: string }) => {
  return (
    <Header title='React Admin Dashboard' style={{ padding: 0, background: props.colorBgContainer }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: "0 20px", justifyContent: 'space-between' }}>
        <h2>React Admin Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ marginRight: 10 }}>Larry Xue</p>
          <img src="https://avatars.githubusercontent.com/u/48818060?s=48&v=4" alt="avatar" style={{ width: 40, height: 40 }} />
          <GithubOutlined style={{ fontSize: 30 }} onClick={() => window.open('https://github.com/larry-xue/react-admin-dashboard')} />
        </div>
      </div>
    </Header>
  )
}

export default Headerbar
