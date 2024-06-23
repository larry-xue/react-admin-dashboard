import { Breadcrumb } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import { useMatches } from 'react-router-dom';
import { AdminRouterItem, routes } from '../../router';
import { assign } from 'lodash-es';

const flattenRoutes = (routes: AdminRouterItem[], prefix = '/') => {
  let map: {
    [key: string]: {
      path: string
      title: string
    }
  } = {}

  routes.map(itm => {
    if (!itm.meta?.title || !itm.path) return null
    map[prefix + itm.path] = {
      path: prefix + itm.path,
      title: itm.meta.title
    }

    if (itm.children) {
      map = assign({}, map, flattenRoutes(itm.children, prefix + itm.path + '/'))
    }
  })

  return map
}

const PageBreadcrumb: React.FC = () => {
  const flattendRoutes = flattenRoutes(routes)
  const matches = useMatches();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([])

  useEffect(() => {
    setBreadcrumbs(matches.map((match) => {
      return {
        title: flattendRoutes[match.pathname]?.title
      }
    }))
  }, [matches])


  return <Breadcrumb style={{ margin: '16px 20px' }} items={breadcrumbs} />;
};

export default PageBreadcrumb
