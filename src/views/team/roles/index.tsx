import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Empty, Form, Input, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { createRole, getRoles, updateRole } from '../../../utils/mockData'
import type { Role, RoleFormValues } from '../types'
import RoleForm from './components/RoleForm'

const statusOptions: Array<{ label: string; value: Role['status'] }> = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Deprecated', value: 'deprecated' },
]

const statusColors: Record<Role['status'], string> = {
  active: 'green',
  pending: 'gold',
  deprecated: 'red',
}

const RolesPage = () => {
  const [filterForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [filters, setFilters] = useState<{ keyword?: string; status?: Role['status'][] }>({})
  const [error, setError] = useState<string>()
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedRole, setSelectedRole] = useState<Role>()
  const navigate = useNavigate()

  const loadRoles = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await getRoles()
      setRoles(result)
    } catch (loadError) {
      console.error(loadError)
      setError('Failed to load roles. Check the data source and try again.')
      message.error('Failed to load roles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  const hasActiveFilters = Boolean(filters.keyword || filters.status?.length)

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const match = [role.name, role.description, role.owner].some(field => field?.toLowerCase().includes(keyword))
        if (!match) return false
      }
      if (filters.status && filters.status.length > 0 && !filters.status.includes(role.status)) {
        return false
      }
      return true
    })
  }, [roles, filters])

  const resetFilters = () => {
    filterForm.resetFields()
    setFilters({})
  }

  const openCreateForm = () => {
    setSelectedRole(undefined)
    setFormMode('create')
    setFormOpen(true)
  }

  const openEditForm = (role: Role) => {
    setSelectedRole(role)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleSubmit = async (values: RoleFormValues) => {
    try {
      if (formMode === 'create') {
        await createRole(values)
        message.success('Role created')
      } else if (selectedRole?.id) {
        await updateRole(selectedRole.id, values)
        message.success('Role updated')
      }
      setFormOpen(false)
      setSelectedRole(undefined)
      await loadRoles()
    } catch (saveError) {
      console.error(saveError)
      message.error('Failed to save role. Please try again.')
    }
  }

  const columns: ColumnsType<Role> = [
    {
      title: 'Role',
      dataIndex: 'name',
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.name}</Typography.Text>
          <Typography.Text type="secondary">{record.description}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      width: 160,
    },
    {
      title: 'Members',
      dataIndex: 'memberCount',
      width: 120,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissionCount',
      width: 150,
      render: (value: number) => `${value} scopes`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 140,
      render: (value: Role['status']) => (
        <Tag color={statusColors[value]} style={{ textTransform: 'capitalize' }}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_value, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/team/role/${record.id}`)}>
            View
          </Button>
          <Button type="link" onClick={() => openEditForm(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => navigate(`/team/role/${record.id}/permissions`)}>
            Permissions
          </Button>
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
            })
          }}
        >
          <Form.Item name="keyword" label="Keyword">
            <Input allowClear placeholder="Search role, owner, or description" style={{ width: 260 }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select status"
              style={{ minWidth: 200 }}
              options={statusOptions}
            />
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
        title="Roles"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            New Role
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
                <Button size="small" icon={<ReloadOutlined />} onClick={loadRoles}>
                  Retry
                </Button>
              }
            />
          )}

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredRoles}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty description={hasActiveFilters ? 'No roles match these filters.' : 'No roles yet.'}>
                  {hasActiveFilters ? (
                    <Button onClick={resetFilters}>Clear filters</Button>
                  ) : (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
                      New Role
                    </Button>
                  )}
                </Empty>
              ),
            }}
          />
        </Space>
      </Card>

      {formOpen && (
        <RoleForm
          mode={formMode}
          open={formOpen}
          initialValues={selectedRole}
          onCancel={() => {
            setFormOpen(false)
            setSelectedRole(undefined)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </Space>
  )
}

export default RolesPage
