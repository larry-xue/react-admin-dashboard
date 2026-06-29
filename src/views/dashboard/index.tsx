import { useEffect, useMemo, useState } from 'react'
import { ArrowUpOutlined, FireOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, List, Row, Skeleton, Space, Statistic, Tag, Typography, theme } from 'antd'
import type { DashboardStats } from '../../utils/mockData'
import { getDashboardStats } from '../../utils/mockData'
import { CustomerStatus } from '../customers/types'

const statusLabelMap: Record<CustomerStatus, string> = {
  [CustomerStatus.Prospect]: 'Prospect',
  [CustomerStatus.InProgress]: 'In Progress',
  [CustomerStatus.Active]: 'Active',
  [CustomerStatus.Churned]: 'Churned',
}

const statusColorMap: Record<CustomerStatus, string> = {
  [CustomerStatus.Prospect]: 'default',
  [CustomerStatus.InProgress]: 'processing',
  [CustomerStatus.Active]: 'success',
  [CustomerStatus.Churned]: 'error',
}

type AntdToken = ReturnType<typeof theme.useToken>['token']

const formatCurrency = (value: number) => `¥${value.toLocaleString()}`

const RevenueTrendChart = ({
  data,
  token,
}: {
  data: DashboardStats['revenueTrend']
  token: AntdToken
}) => {
  const width = 640
  const height = 320
  const padding = { top: 18, right: 24, bottom: 38, left: 64 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const maxRevenue = Math.max(...data.map(item => item.revenue), 1)
  const points = data.map((item, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * plotWidth
    const y = padding.top + (1 - item.revenue / maxRevenue) * plotHeight
    return { ...item, x, y }
  })
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const lastPoint = points[points.length - 1]
  const areaPath = `${path} L ${lastPoint?.x ?? padding.left} ${padding.top + plotHeight} L ${padding.left} ${padding.top + plotHeight} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trend over the last six months" style={{ width: '100%', height }}>
      {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const y = padding.top + ratio * plotHeight
        const value = Math.round(maxRevenue * (1 - ratio))

        return (
          <g key={ratio}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={token.colorSplit} strokeDasharray="4 4" />
            <text x={padding.left - 12} y={y + 4} textAnchor="end" fill={token.colorTextSecondary} fontSize="12">
              {formatCurrency(value)}
            </text>
          </g>
        )
      })}
      <path d={areaPath} fill={token.colorPrimaryBg} opacity={0.85} />
      <path d={path} fill="none" stroke={token.colorPrimary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {points.map(point => (
        <g key={point.month}>
          <circle cx={point.x} cy={point.y} r={4} fill={token.colorBgContainer} stroke={token.colorPrimary} strokeWidth={2} />
          <text x={point.x} y={height - 12} textAnchor="middle" fill={token.colorTextSecondary} fontSize="12">
            {point.month}
          </text>
        </g>
      ))}
    </svg>
  )
}

const CustomerSourceBreakdown = ({
  data,
  token,
}: {
  data: DashboardStats['sourceDistribution']
  token: AntdToken
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const palette = [token.colorPrimary, token.colorSuccess, token.colorWarning, token.colorInfo, token.colorError]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%', minHeight: 320, justifyContent: 'center' }}>
      {data.map((item, index) => {
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0
        const color = palette[index % palette.length]

        return (
          <div key={item.type}>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 6 }}>
              <Typography.Text strong>{item.type}</Typography.Text>
              <Typography.Text type="secondary">{item.value} · {percent}%</Typography.Text>
            </Space>
            <div style={{ height: 10, overflow: 'hidden', borderRadius: 999, background: token.colorFillSecondary }}>
              <div style={{ width: `${percent}%`, height: '100%', borderRadius: 999, background: color }} />
            </div>
          </div>
        )
      })}
    </Space>
  )
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>()
  const [loading, setLoading] = useState(true)
  const { token } = theme.useToken()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const nextStats = await getDashboardStats()
        if (mounted) {
          setStats(nextStats)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const timer = setInterval(load, 1000 * 60 * 5)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const metricCards = useMemo(() => ([
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      suffix: 'customers',
      icon: <TeamOutlined style={{ color: '#1890ff' }} />,
      trend: '+12% MoM',
    },
    {
      title: 'New Customers (Monthly)',
      value: stats?.newCustomers ?? 0,
      suffix: 'customers',
      icon: <ArrowUpOutlined style={{ color: '#52c41a' }} />,
      trend: '+8% YoY',
    },
    {
      title: 'MRR',
      value: stats?.monthlyRecurringRevenue ?? 0,
      prefix: '¥',
      icon: <FireOutlined style={{ color: '#fa8c16' }} />,
      trend: '+5.6% QoQ',
    },
    {
      title: 'Active Deals',
      value: stats?.activeDeals ?? 0,
      suffix: 'deals',
      icon: <ArrowUpOutlined style={{ color: '#722ed1' }} />,
      trend: '72% win rate',
    },
  ]), [stats])

  const metricCardStyle = {
    background: token.colorBgElevated,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }

  if (loading && !stats) {
    return <Skeleton active paragraph={{ rows: 12 }} />
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {metricCards.map(card => (
          <Col key={card.title} xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }} style={metricCardStyle}>
              <Space align="start">
                {card.icon}
                <Statistic
                  title={card.title}
                  value={card.value}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  valueStyle={{ color: token.colorText }}
                />
              </Space>
              <Typography.Text style={{ color: token.colorTextSecondary }}>{card.trend}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Trend" extra={<Typography.Text type="secondary">Last 6 months</Typography.Text>}>
            {stats ? (
              <RevenueTrendChart data={stats.revenueTrend} token={token} />
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Customer Sources">
            {stats ? (
              <CustomerSourceBreakdown data={stats.sourceDistribution} token={token} />
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <List
              dataSource={stats?.recentActivities ?? []}
              renderItem={activity => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Typography.Text strong>{activity.summary}</Typography.Text>
                        {activity.statusAfter && (
                          <Tag color={statusColorMap[activity.statusAfter]}>{statusLabelMap[activity.statusAfter]}</Tag>
                        )}
                      </Space>
                    }
                    description={`${activity.actor} · ${new Date(activity.timestamp).toLocaleString()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Health Insights">
            <List
              dataSource={[
                {
                  title: 'Follow-up Reminder',
                  description: 'Four prospects have been idle for over 7 days. Reach out soon to improve conversion.',
                },
                {
                  title: 'Expansion Opportunity',
                  description: 'Atlas Logistics active usage grew 32%. Consider pitching an upgraded plan.',
                },
                {
                  title: 'Renewal Alert',
                  description: 'Two enterprise contracts expire within 30 days. Prepare renewal strategies.',
                },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.title}</Typography.Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default DashboardPage
