import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Descriptions, Divider, Drawer, Empty, Skeleton, Space, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Customer, CustomerStatus } from '../types'
import { getCustomerActivities } from '../../../utils/mockData'

interface CustomerDetailProps {
  customer?: Customer
  open: boolean
  onClose: () => void
  statusRender?: (status: CustomerStatus) => ReactNode
}

const CustomerDetail = ({ customer, open, onClose, statusRender }: CustomerDetailProps) => {
  const customerId = customer?.id
  const [activities, setActivities] = useState<
    { id: string; summary: string; actor: string; timestamp: string; statusAfter?: CustomerStatus }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const loadActivities = useCallback(async () => {
    if (!customerId) return

    setLoading(true)
    setError(undefined)
    try {
      const next = await getCustomerActivities(customerId)
      setActivities(next)
    } catch (loadError) {
      console.error(loadError)
      setError('Failed to load customer activity.')
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    if (!open) return
    loadActivities()
  }, [loadActivities, open])

  return (
    <Drawer
      width={420}
      title={customer?.name ?? 'Customer Details'}
      open={open}
      onClose={onClose}
      destroyOnClose
      extra={customer?.status ? statusRender?.(customer.status) ?? <Tag>{customer.status}</Tag> : null}
    >
      {customer ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{customer.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Company">{customer.company || '-'}</Descriptions.Item>
            <Descriptions.Item label="Title">{customer.position || '-'}</Descriptions.Item>
            <Descriptions.Item label="Source">{customer.source}</Descriptions.Item>
            <Descriptions.Item label="Owner">{customer.owner || '-'}</Descriptions.Item>
            <Descriptions.Item label="Notes">{customer.notes || '-'}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(customer.createdAt).toLocaleString()}
            </Descriptions.Item>
            {customer.updatedAt && (
              <Descriptions.Item label="Last Updated">{new Date(customer.updatedAt).toLocaleString()}</Descriptions.Item>
            )}
          </Descriptions>

          <div>
            <Typography.Title level={5}>Activity Timeline</Typography.Title>
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : error ? (
              <Alert
                type="error"
                showIcon
                message={error}
                action={
                  <Button size="small" onClick={loadActivities}>
                    Retry
                  </Button>
                }
              />
            ) : activities.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activity recorded yet." />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {activities.map(activity => (
                  <div key={activity.id}>
                    <Space direction="vertical" size={2}>
                      <Typography.Text strong>{activity.summary}</Typography.Text>
                      <Typography.Text type="secondary">
                        {activity.actor} · {new Date(activity.timestamp).toLocaleString()}
                      </Typography.Text>
                      {activity.statusAfter && (
                        <Typography.Text type="secondary">
                          Status: {statusRender?.(activity.statusAfter) ?? <Tag>{activity.statusAfter}</Tag>}
                        </Typography.Text>
                      )}
                    </Space>
                    <Divider style={{ margin: '12px 0' }} />
                  </div>
                ))}
              </Space>
            )}
          </div>
        </Space>
      ) : (
        <Typography.Text type="secondary">Select a customer to view details.</Typography.Text>
      )}
    </Drawer>
  )
}

export default CustomerDetail
