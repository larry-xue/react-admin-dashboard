import { Layout, Switch, Dropdown, Avatar, Button, Tooltip } from 'antd';
import { GithubOutlined, LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BgColorsOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useConfigStore from '../../store/config';
import useUserStore from '../../store/user';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ThemeConfigDialog from './ThemeConfigDialog';
const { Header } = Layout;

// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024)
    }
    
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return { isMobile, isTablet }
}

interface HeaderbarProps {
  colorBgContainer: string
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const Headerbar = (props: HeaderbarProps) => {
  const { colorBgContainer, collapsed, onCollapse } = props
  const themeConfig = useConfigStore(state => state.themeConfig)
  const setAlgorithm = useConfigStore(state => state.setAlgorithm)
  const setCompactAlgorithm = useConfigStore(state => state.setCompactAlgorithm)
  const user = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)

  // Responsive breakpoints
  const { isMobile, isTablet } = useResponsive()

  // Get current theme mode (default or dark)
  const isDarkMode = themeConfig._algorithm.includes('dark')
  const isCompactMode = themeConfig._algorithm.includes('compact')

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header 
      title='React Admin Dashboard' 
      style={{ 
        padding: 0, 
        background: colorBgContainer,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        height: '100%', 
        padding: isMobile ? "0 12px" : "0 20px", 
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {onCollapse && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{ fontSize: 16 }}
            />
          )}
          <h2 style={{ 
            margin: 0, 
            fontSize: isMobile ? '16px' : '20px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {isMobile ? 'Dashboard' : 'React Admin Dashboard'}
          </h2>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 6 : 10,
          flexShrink: 0,
        }}>
          {!isMobile && (
            <>
              <Switch 
                checkedChildren="Light" 
                unCheckedChildren="Dark" 
                checked={!isDarkMode}
                onChange={(checked) => setAlgorithm(checked ? 'default' : 'dark')} 
                size={isTablet ? 'small' : 'default'}
              />
              <Switch 
                checkedChildren="Compact" 
                unCheckedChildren="Loose" 
                checked={isCompactMode}
                onChange={(checked) => setCompactAlgorithm(checked ? 'compact' : '')} 
                size={isTablet ? 'small' : 'default'}
              />
              <Tooltip title="Theme Configuration">
                <Button
                  type="text"
                  icon={<BgColorsOutlined />}
                  onClick={() => setThemeDialogOpen(true)}
                  size={isTablet ? 'small' : 'middle'}
                />
              </Tooltip>
            </>
          )}
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer', 
                padding: '0 8px',
                minWidth: 0,
              }}>
                <Avatar 
                  src={user.avatar} 
                  icon={!user.avatar && <UserOutlined />}
                  size="small"
                />
                {!isMobile && <span style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{user.username}</span>}
              </div>
            </Dropdown>
          )}
          <GithubOutlined 
            style={{ 
              fontSize: isMobile ? 20 : 24, 
              cursor: 'pointer',
              flexShrink: 0,
            }} 
            onClick={() => window.open('https://github.com/larry-xue/react-admin-dashboard')} 
          />
        </div>
      </div>
      <ThemeConfigDialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />
    </Header>
  )
}

export default Headerbar
