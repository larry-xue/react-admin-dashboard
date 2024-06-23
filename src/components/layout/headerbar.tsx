
import { Layout } from 'antd';
const { Header } = Layout;

const Headerbar = (props: { colorBgContainer: string }) => {
  return (
    <Header title='React Admin Dashboard' style={{ padding: 0, background: props.colorBgContainer }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: "0 20px", justifyContent: 'space-between' }}>
        <h2>React Admin Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ marginRight: 10 }}>Larry Xue</p>
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" alt="avatar" style={{ width: 40, height: 40 }} />
        </div>
      </div>
    </Header>
  )
}

export default Headerbar
