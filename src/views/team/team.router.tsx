import { lazy } from 'react'
import { TeamOutlined, SafetyOutlined, SettingOutlined } from '@ant-design/icons'
import type { AdminRouterItem } from '../../router'
import LazyRoute from '../../components/common/LazyRoute'

const TeamLayout = lazy(() => import('./teamLayout'))
const RolesPage = lazy(() => import('./roles'))
const RoleDetailPage = lazy(() => import('./roles/detail'))
const RolePermissionsPage = lazy(() => import('./roles/permissions'))

const teamRoutes: AdminRouterItem[] = [
  {
    path: 'team',
    element: (
      <LazyRoute>
        <TeamLayout />
      </LazyRoute>
    ),
    meta: {
      label: 'Team',
      title: 'Team',
      key: '/team',
      icon: <TeamOutlined />,
      order: 3,
    },
    children: [
      {
        path: 'roles',
        element: (
          <LazyRoute>
            <RolesPage />
          </LazyRoute>
        ),
        meta: {
          label: 'Roles',
          title: 'Roles',
          key: '/team/roles',
          icon: <SafetyOutlined />,
        },
      },
      {
        path: 'role/:roleId',
        element: (
          <LazyRoute>
            <RoleDetailPage />
          </LazyRoute>
        ),
        meta: {
          label: 'Role Detail',
          title: 'Role Detail',
          key: '/team/role/:roleId',
          icon: <SettingOutlined />,
          hideInMenu: true,
        },
      },
      {
        path: 'role/:roleId/permissions',
        element: (
          <LazyRoute>
            <RolePermissionsPage />
          </LazyRoute>
        ),
        meta: {
          label: 'Permissions',
          title: 'Role Permissions',
          key: '/team/role/:roleId/permissions',
          icon: <SettingOutlined />,
          hideInMenu: true,
        },
      },
    ],
  },
]

export default teamRoutes
