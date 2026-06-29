import { lazy } from 'react'
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import LazyRoute from '../../components/common/LazyRoute'

const LoginPage = lazy(() => import('./login'))
const RegisterPage = lazy(() => import('./register'))

const authRoutes: AdminRouterItem[] = [
  {
    path: 'auth/login',
    element: (
      <LazyRoute>
        <LoginPage />
      </LazyRoute>
    ),
    meta: {
      label: 'Login',
      title: 'Login',
      key: '/auth/login',
      icon: <LoginOutlined />,
      hideInMenu: true, // Hide in menu
    },
  },
  {
    path: 'auth/register',
    element: (
      <LazyRoute>
        <RegisterPage />
      </LazyRoute>
    ),
    meta: {
      label: 'Register',
      title: 'Register',
      key: '/auth/register',
      icon: <UserAddOutlined />,
      hideInMenu: true, // Hide in menu
    },
  },
]

export default authRoutes
