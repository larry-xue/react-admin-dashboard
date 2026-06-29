import { useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import type { Role, RoleFormValues } from '../../types'

interface RoleFormProps {
  mode: 'create' | 'edit'
  open: boolean
  initialValues?: Role
  onSubmit: (values: RoleFormValues) => Promise<void> | void
  onCancel: () => void
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Deprecated', value: 'deprecated' },
]

const RoleForm = ({ mode, open, initialValues, onSubmit, onCancel }: RoleFormProps) => {
  const [form] = Form.useForm<RoleFormValues>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initialValues?.name,
        description: initialValues?.description,
        status: initialValues?.status ?? 'pending',
        owner: initialValues?.owner,
      })
    } else {
      form.resetFields()
    }
  }, [form, initialValues, open])

  const handleFinish = async (values: RoleFormValues) => {
    setSubmitting(true)
    try {
      await onSubmit(values)
      form.resetFields()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={mode === 'create' ? 'Create Role' : 'Edit Role'}
      open={open}
      onCancel={() => {
        if (!submitting) onCancel()
      }}
      onOk={() => form.submit()}
      okText={mode === 'create' ? 'Create role' : 'Save changes'}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Role name"
          rules={[{ required: true, message: 'Please enter a role name' }]}
        >
          <Input placeholder="e.g. Billing Analyst" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please describe what this role can do' }]}
        >
          <Input.TextArea rows={3} placeholder="Describe the main access boundaries for this role" />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item
          name="owner"
          label="Role owner"
          rules={[{ required: true, message: 'Please assign an owner' }]}
        >
          <Input placeholder="e.g. Jamie Lee" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RoleForm
