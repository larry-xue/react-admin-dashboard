import { useEffect, useState, useRef } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuItemType } from 'antd/es/menu/interface';
import { AdminRouterItem, routes } from '../../router';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

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

const getMenuItems = (routes: AdminRouterItem[]): MenuItemType[] => {
  const sortedRoutes = [...routes].sort((a, b) => {
    const orderA = a.meta?.order ?? 0
    const orderB = b.meta?.order ?? 0
    return orderA - orderB
  })

  return sortedRoutes.map(itm => {
    if (!itm.meta) return null
    // Filter out routes that should be hidden in menu
    if (itm.meta.hideInMenu) return null
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
type PageSidebarProps = {
  autoCollapse?: boolean
  height?: string | number
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const PageSidebar = (props: PageSidebarProps) => {
  const { autoCollapse = true, height = '100%', collapsed: externalCollapsed, onCollapse } = props
  const menuItems = getMenuItems(routes)
  const navigate = useNavigate()
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string[]>([])
  const location = useLocation()
  
  // Responsive breakpoints
  const { isMobile } = useResponsive()
  
  // Auto collapse on mobile
  const [internalCollapsed, setInternalCollapsed] = useState(isMobile)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const prevIsMobileRef = useRef<boolean | null>(null)
  
  // Only auto collapse when switching from desktop to mobile, not when user manually opens sidebar
  useEffect(() => {
    const prevIsMobile = prevIsMobileRef.current
    // Only check transition if we have a previous value (skip first render)
    if (prevIsMobile !== null && !prevIsMobile && isMobile && !collapsed) {
      // Switching from desktop to mobile, auto collapse
      onCollapse?.(true)
      setInternalCollapsed(true)
    }
    // Update ref after checking, so next render has the previous value
    prevIsMobileRef.current = isMobile
  }, [isMobile, collapsed, onCollapse])
  
  const handleCollapse = (collapsed: boolean) => {
    if (onCollapse) {
      onCollapse(collapsed)
    } else {
      setInternalCollapsed(collapsed)
    }
  }

  const onSwitchMenu = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    if (autoCollapse && keyPath.slice(1)) setLastOpenedMenu(keyPath.slice(1))
    navigate(key)
    // Auto collapse sidebar on mobile after navigation
    if (isMobile && !collapsed) {
      handleCollapse(true)
    }
  }

  const onOpenChange = (openKeys: string[]) => {
    setLastOpenedMenu(openKeys)
  }

  return (
    <Sider 
      theme='light' 
      style={{ 
        height, 
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        zIndex: 100,
        ...(isMobile && collapsed ? { display: 'none' } : {}),
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      width={200}
      trigger={null}
    >
      <Menu 
        openKeys={collapsed ? undefined : lastOpenedMenu} 
        onOpenChange={collapsed ? undefined : onOpenChange} 
        selectedKeys={[location.pathname]}
        mode="inline" 
        items={menuItems} 
        onClick={onSwitchMenu}
        inlineCollapsed={collapsed}
        triggerSubMenuAction={collapsed ? 'hover' : 'click'}
      />
    </Sider>
  )
}

export default PageSidebar
