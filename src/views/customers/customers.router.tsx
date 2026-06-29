import { lazy } from 'react'
import { TeamOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import LazyRoute from '../../components/common/LazyRoute'

const CustomersPage = lazy(() => import('.'))

const customersRoutes: AdminRouterItem[] = [
  {
    path: 'customers',
    element: (
      <LazyRoute>
        <CustomersPage />
      </LazyRoute>
    ),
    meta: {
      label: 'Customers',
      title: 'Customers',
      key: '/customers',
      icon: <TeamOutlined />,
      order: 2,
    },
  },
]

export default customersRoutes
