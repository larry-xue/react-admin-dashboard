import { Breadcrumb } from 'antd'
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useMemo } from 'react'
import { matchPath, useMatches } from 'react-router-dom'
import type { AdminRouterItem } from '../../router'
import { routes } from '../../router'

type FlattenedRoute = {
  pattern: string
  title: string
}

const normalizePath = (prefix: string, path: string) => {
  const sanitized = `${prefix}${path}`.replace(/\/+/g, '/')
  return sanitized.startsWith('/') ? sanitized : `/${sanitized}`
}

const flattenRoutes = (routeList: AdminRouterItem[], prefix = '/'): FlattenedRoute[] => {
  const map: FlattenedRoute[] = []

  routeList.forEach(itm => {
    if (itm.meta?.title && itm.path) {
      map.push({
        pattern: normalizePath(prefix, itm.path),
        title: itm.meta.title,
      })
    }

    if (itm.children && itm.path) {
      map.push(...flattenRoutes(itm.children, normalizePath(prefix, `${itm.path}/`)))
    }
  })

  return map
}

const fallbackTitle = (pathname: string) => {
  const segment = pathname.split('/').filter(Boolean).pop() ?? ''
  if (!segment) return 'Home'
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

const PageBreadcrumb = () => {
  const matches = useMatches()
  const flattenedRoutes = useMemo(() => flattenRoutes(routes), [])
  const breadcrumbs = useMemo<BreadcrumbItemType[]>(
    () =>
      matches.map(match => {
        const found = flattenedRoutes.find(route =>
          matchPath({ path: route.pattern, end: true }, match.pathname),
        )

        return {
          title: found?.title ?? fallbackTitle(match.pathname),
        }
      }),
    [matches, flattenedRoutes],
  )

  return <Breadcrumb style={{ margin: '16px 20px' }} items={breadcrumbs} />
}

export default PageBreadcrumb
