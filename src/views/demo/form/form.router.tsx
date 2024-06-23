import { FormOutlined, TeamOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../../router'
import FormPage from '.'
import { Outlet } from 'react-router-dom'
import CallendarCmp from './components/calendar'

const demoRoutes: AdminRouterItem[] = [
  {
    path: 'form',
    element: <FormPage />,
    meta: {
      label: "Form",
      title: "Form",
      key: "/form",
      icon: <FormOutlined />,
    },
  },
  {
    path: 'form2',
    element: <Outlet />,
    meta: {
      label: "Form2",
      title: "Form2",
      key: "/form2",
      icon: <FormOutlined />,
    },
    children: [{
      path: 'callendar',
      element: <CallendarCmp />,
      meta: {
        label: "Callendar",
        title: "Callendar",
        key: "/form2/callendar",
        icon: <TeamOutlined />,
      }
    }]
  }
]

export default demoRoutes
