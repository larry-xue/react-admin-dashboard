import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { AdminRouterItem, routes } from '../../router';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const getMenuItems = (routes: AdminRouterItem[]): any[] => {
  return routes.map(itm => {
    if (!itm.meta) return null
    let children = null
    if (itm.children) children = getMenuItems(itm.children)
    return children ? {
      ...itm.meta,
      children
    } : {
      ...itm.meta,
      path: itm.path,
    }
  }).filter(itm => !!itm)
}

/**
 * PageSidebar
 * @param props {autoCollapse?: boolean} automatic collapes menu when click another menu
 * @returns 
 */
const PageSidebar = (props: {
  autoCollapse?: boolean
}) => {
  const { autoCollapse = true } = props
  const menuItems = getMenuItems(routes)
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string[]>([])
  const location = useLocation()

  const onSwitchMenu = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    if (autoCollapse && keyPath.slice(1)) setLastOpenedMenu(keyPath.slice(1))
    navigate(key)
  }

  const onOpenChange = (openKeys: string[]) => {
    setLastOpenedMenu(openKeys)
  }

  useEffect(() => {
    setSelectedKeys([`${location.pathname}`])
    navigate(location.pathname)
  }, [location.pathname])

  return (
    <Sider theme='light'>
      <Menu openKeys={lastOpenedMenu} onOpenChange={onOpenChange} selectedKeys={selectedKeys} mode="inline" items={menuItems} onClick={onSwitchMenu} />
    </Sider>
  )
}

export default PageSidebar
