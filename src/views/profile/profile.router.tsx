import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { AdminRouterItem } from '../../router'
import LazyRoute from '../../components/common/LazyRoute'

const ProfilePage = lazy(() => import('.'))

const profileRoutes: AdminRouterItem[] = [
  {
    path: 'profile',
    element: (
      <LazyRoute>
        <ProfilePage />
      </LazyRoute>
    ),
    meta: {
      label: 'Profile',
      title: 'Profile',
      key: '/profile',
      icon: <UserOutlined />,
      hideInMenu: true,
      order: 9,
    },
  },
]

export default profileRoutes
