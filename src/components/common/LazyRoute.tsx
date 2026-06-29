import { Suspense, type ReactNode } from 'react'
import { Spin } from 'antd'

type LazyRouteProps = {
  children: ReactNode
}

const LazyRoute = ({ children }: LazyRouteProps) => (
  <Suspense
    fallback={
      <div style={{ display: 'grid', minHeight: 240, placeItems: 'center' }}>
        <Spin />
      </div>
    }
  >
    {children}
  </Suspense>
)

export default LazyRoute
