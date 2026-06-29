import { useEffect, useMemo, useState } from 'react'
import type { Key } from 'react'
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { Customer, CustomerFilters, CustomerSource, CustomerStatus } from './types'
import {
  bulkAssignCustomerOwner,
  bulkDeleteCustomers,
  bulkUpdateCustomerStatus,
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../../utils/mockData'
import CustomerForm from './components/CustomerForm'
import CustomerDetail from './components/CustomerDetail'

const { RangePicker } = DatePicker

const statusOptions = Object.values(CustomerStatus).map(status => ({
  label: {
    [CustomerStatus.Prospect]: 'Prospect',
    [CustomerStatus.InProgress]: 'In Progress',
    [CustomerStatus.Active]: 'Active',
    [CustomerStatus.Churned]: 'Churned',
  }[status],
  value: status,
}))

const statusColorMap: Record<CustomerStatus, string> = {
  [CustomerStatus.Prospect]: 'default',
  [CustomerStatus.InProgress]: 'processing',
  [CustomerStatus.Active]: 'success',
  [CustomerStatus.Churned]: 'error',
}

const sourceOptions = Object.values(CustomerSource).map(source => ({
  label: {
    [CustomerSource.Website]: 'Website',
    [CustomerSource.Referral]: 'Referral',
    [CustomerSource.Ads]: 'Ads',
    [CustomerSource.Partner]: 'Partner',
    [CustomerSource.Other]: 'Other',
  }[source],
  value: source,
}))

const CustomersPage = () => {
  const [filterForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [formVisible, setFormVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>()
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [bulkStatus, setBulkStatus] = useState<CustomerStatus>()
  const [bulkOwner, setBulkOwner] = useState('')
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [error, setError] = useState<string>()

  const loadCustomers = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (loadError) {
      console.error(loadError)
      setError('Failed to load customers. Check the data source and try again.')
      message.error('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const hasActiveFilters = Boolean(
    filters.keyword || filters.status?.length || filters.source?.length || filters.dateRange,
  )

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const hit = [customer.name, customer.email, customer.company, customer.owner].some(field =>
          field?.toLowerCase().includes(keyword),
        )
        if (!hit) return false
      }
      if (filters.status && filters.status.length > 0 && !filters.status.includes(customer.status)) {
        return false
      }
      if (filters.source && filters.source.length > 0 && !filters.source.includes(customer.source)) {
        return false
      }
      if (filters.dateRange) {
        const createdAt = new Date(customer.createdAt).getTime()
        const [start, end] = filters.dateRange
        if (createdAt < new Date(start).getTime() || createdAt > new Date(end).getTime()) {
          return false
        }
      }
      return true
    })
  }, [customers, filters])

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedCustomer(undefined)
    setFormVisible(true)
  }

  const resetFilters = () => {
    filterForm.resetFields()
    setFilters({})
    setSelectedRowKeys([])
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleDelete = async (record: Customer) => {
    try {
      await deleteCustomer(record.id)
      message.success('Customer deleted')
      setSelectedRowKeys(keys => keys.filter(key => key !== record.id))
      await loadCustomers()
    } catch (deleteError) {
      console.error(deleteError)
      message.error('Failed to delete customer. Please try again later.')
    }
  }

  const handleStatusChange = async (record: Customer, status: CustomerStatus) => {
    try {
      await updateCustomer(record.id, { status })
      message.success('Status updated')
      await loadCustomers()
    } catch (statusError) {
      console.error(statusError)
      message.error('Failed to update status. Please try again later.')
    }
  }

  const runBulkAction = async (action: () => Promise<unknown>, successMessage: string) => {
    if (selectedRowKeys.length === 0) return

    setBulkActionLoading(true)
    try {
      await action()
      message.success(successMessage)
      setSelectedRowKeys([])
      setBulkStatus(undefined)
      setBulkOwner('')
      await loadCustomers()
    } catch (bulkError) {
      console.error(bulkError)
      message.error('Bulk action failed. Please try again.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus) {
      message.warning('Select a status before applying a bulk update.')
      return
    }

    const ids = selectedRowKeys.map(String)
    const label = statusOptions.find(option => option.value === bulkStatus)?.label ?? bulkStatus
    await runBulkAction(
      () => bulkUpdateCustomerStatus(ids, bulkStatus),
      `${ids.length} customers updated to ${label}`,
    )
  }

  const handleBulkOwnerAssign = async () => {
    const owner = bulkOwner.trim()
    if (!owner) {
      message.warning('Enter an owner name before assigning customers.')
      return
    }

    const ids = selectedRowKeys.map(String)
    await runBulkAction(
      () => bulkAssignCustomerOwner(ids, owner),
      `${ids.length} customers assigned to ${owner}`,
    )
  }

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(String)
    await runBulkAction(
      () => bulkDeleteCustomers(ids),
      `${ids.length} customers deleted`,
    )
  }

  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.name}</Typography.Text>
          <Typography.Text type="secondary">{record.company}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{record.email}</Typography.Text>
          <Typography.Text type="secondary">{record.phone}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Source / Owner',
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Tag>{sourceOptions.find(option => option.value === record.source)?.label}</Tag>
          <Typography.Text type="secondary">{record.owner ?? 'Unassigned'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_value, record) => (
        <Select
          size="small"
          value={record.status}
          style={{ minWidth: 120 }}
          options={statusOptions}
          onChange={status => handleStatusChange(record, status)}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: value => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_value, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedCustomer(record)
              setDetailVisible(true)
            }}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedCustomer(record)
              setFormMode('edit')
              setFormVisible(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this customer?"
            description="This removes the customer profile and its activity timeline."
            okText="Delete customer"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Form
          form={filterForm}
          layout="inline"
          style={{ rowGap: 16, columnGap: 16, width: '100%' }}
          onFinish={values => {
            setFilters({
              keyword: values.keyword,
              status: values.status,
              source: values.source,
              dateRange: values.dateRange
                ? [values.dateRange[0].toISOString(), values.dateRange[1].toISOString()]
                : undefined,
            })
            setSelectedRowKeys([])
            setPagination(prev => ({ ...prev, current: 1 }))
          }}
        >
          <Form.Item name="keyword" label="Keyword">
            <Input allowClear placeholder="Search name / company / owner" style={{ width: 220 }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select statuses"
              options={statusOptions}
              style={{ minWidth: 180 }}
            />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select sources"
              options={sourceOptions}
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item name="dateRange" label="Created At">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button onClick={resetFilters}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Customers"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            New Customer
          </Button>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {error && (
            <Alert
              type="error"
              showIcon
              message={error}
              action={
                <Button size="small" icon={<ReloadOutlined />} onClick={loadCustomers}>
                  Retry
                </Button>
              }
            />
          )}

          {selectedRowKeys.length > 0 && (
            <Alert
              type="info"
              showIcon
              message={
                <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Typography.Text strong>{selectedRowKeys.length} customers selected</Typography.Text>
                  <Space wrap>
                    <Select
                      allowClear
                      placeholder="New status"
                      value={bulkStatus}
                      options={statusOptions}
                      style={{ width: 160 }}
                      onChange={setBulkStatus}
                    />
                    <Button loading={bulkActionLoading} disabled={!bulkStatus} onClick={handleBulkStatusUpdate}>
                      Update status
                    </Button>
                    <Input
                      allowClear
                      placeholder="Owner name"
                      value={bulkOwner}
                      style={{ width: 180 }}
                      onChange={event => setBulkOwner(event.target.value)}
                    />
                    <Button loading={bulkActionLoading} disabled={!bulkOwner.trim()} onClick={handleBulkOwnerAssign}>
                      Assign owner
                    </Button>
                    <Popconfirm
                      title="Delete selected customers?"
                      description={`This removes ${selectedRowKeys.length} customer records and their activity timelines.`}
                      okText="Delete customers"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true, loading: bulkActionLoading }}
                      onConfirm={handleBulkDelete}
                    >
                      <Button danger icon={<DeleteOutlined />} loading={bulkActionLoading}>
                        Delete selected
                      </Button>
                    </Popconfirm>
                    <Button onClick={() => setSelectedRowKeys([])}>Clear selection</Button>
                  </Space>
                </Space>
              }
            />
          )}

          <Table
            rowKey="id"
            loading={loading}
            dataSource={filteredCustomers}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
              getCheckboxProps: () => ({ disabled: bulkActionLoading }),
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredCustomers.length,
              showSizeChanger: true,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            locale={{
              emptyText: (
                <Empty description={hasActiveFilters ? 'No customers match these filters.' : 'No customers yet.'}>
                  {hasActiveFilters ? (
                    <Button onClick={resetFilters}>Clear filters</Button>
                  ) : (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
                      New Customer
                    </Button>
                  )}
                </Empty>
              ),
            }}
          />
        </Space>
      </Card>

      {formVisible && (
        <CustomerForm
          mode={formMode}
          open={formVisible}
          initialValues={selectedCustomer}
          onCancel={() => setFormVisible(false)}
          onSubmit={async values => {
            try {
              if (formMode === 'create') {
                await createCustomer(values)
                message.success('Customer created successfully')
              } else if (selectedCustomer?.id) {
                await updateCustomer(selectedCustomer.id, values)
                message.success('Customer updated')
              }
              setFormVisible(false)
              await loadCustomers()
            } catch (saveError) {
              console.error(saveError)
              message.error('Failed to save customer. Please try again later.')
            }
          }}
        />
      )}

      <CustomerDetail
        customer={selectedCustomer}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        statusRender={(status) => (
          <Tag color={statusColorMap[status]}>
            {statusOptions.find(option => option.value === status)?.label}
          </Tag>
        )}
      />
    </Space>
  )
}

export default CustomersPage
