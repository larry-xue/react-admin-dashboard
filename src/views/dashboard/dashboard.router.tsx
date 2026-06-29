import { lazy } from 'react'
import { DashboardOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import LazyRoute from '../../components/common/LazyRoute'

const DashboardPage = lazy(() => import('.'))

const dashboardRoutes: AdminRouterItem[] = [
  {
    path: 'dashboard',
    element: (
      <LazyRoute>
        <DashboardPage />
      </LazyRoute>
    ),
    meta: {
      label: 'Dashboard',
      title: 'Dashboard',
      key: '/dashboard',
      icon: <DashboardOutlined />,
      order: 1,
    },
  },
]

export default dashboardRoutes
