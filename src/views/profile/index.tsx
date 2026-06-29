import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  message,
  theme,
} from 'antd'
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useUserStore from '../../store/user'
import type { User } from '../../store/user'

type ProfileFormValues = Pick<
  User,
  | 'avatar'
  | 'bio'
  | 'department'
  | 'email'
  | 'emailNotifications'
  | 'fullName'
  | 'language'
  | 'location'
  | 'phone'
  | 'productUpdates'
  | 'timezone'
  | 'title'
  | 'twoFactorEnabled'
  | 'username'
>

const timezoneOptions = [
  { label: 'Pacific Time (UTC-08:00)', value: 'America/Los_Angeles' },
  { label: 'Eastern Time (UTC-05:00)', value: 'America/New_York' },
  { label: 'London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Paris (UTC+01:00)', value: 'Europe/Paris' },
  { label: 'Shanghai (UTC+08:00)', value: 'Asia/Shanghai' },
  { label: 'Tokyo (UTC+09:00)', value: 'Asia/Tokyo' },
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
  { label: '日本語', value: 'ja' },
]

const getProfileInitialValues = (user: User): ProfileFormValues => ({
  avatar: user.avatar,
  bio: user.bio ?? 'Owns customer operations and keeps team access aligned with daily workflows.',
  department: user.department ?? 'Operations',
  email: user.email,
  emailNotifications: user.emailNotifications ?? true,
  fullName: user.fullName ?? user.username,
  language: user.language ?? 'en',
  location: user.location ?? 'San Francisco, CA',
  phone: user.phone,
  productUpdates: user.productUpdates ?? true,
  timezone: user.timezone ?? 'America/Los_Angeles',
  title: user.title ?? 'Workspace Admin',
  twoFactorEnabled: user.twoFactorEnabled ?? false,
  username: user.username,
})

const ProfilePage = () => {
  const [form] = Form.useForm<ProfileFormValues>()
  const user = useUserStore(state => state.user)
  const token = useUserStore(state => state.token)
  const updateUser = useUserStore(state => state.updateUser)
  const [saving, setSaving] = useState(false)
  const { token: themeToken } = theme.useToken()
  const watchedAvatar = Form.useWatch('avatar', form)
  const watchedFullName = Form.useWatch('fullName', form)
  const watchedUsername = Form.useWatch('username', form)
  const watchedTwoFactor = Form.useWatch('twoFactorEnabled', form)

  useEffect(() => {
    if (!user) return
    form.setFieldsValue(getProfileInitialValues(user))
  }, [form, user])

  const profileSummary = useMemo(() => {
    if (!user) return []
    const initialValues = getProfileInitialValues(user)

    return [
      { label: 'User ID', children: user.id },
      { label: 'Email', children: initialValues.email },
      { label: 'Role', children: initialValues.title },
      { label: 'Department', children: initialValues.department },
      {
        label: 'Session',
        children: token ? `${token.slice(0, 18)}...` : 'No active token',
      },
    ]
  }, [token, user])

  if (!user) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No signed-in user profile is available."
      />
    )
  }

  const previewName = watchedFullName || watchedUsername || user.username
  const previewAvatar = watchedAvatar || user.avatar
  const twoFactorEnabled = watchedTwoFactor ?? user.twoFactorEnabled ?? false

  const handleReset = () => {
    form.setFieldsValue(getProfileInitialValues(user))
    message.info('Profile form reset')
  }

  const handleFinish = async (values: ProfileFormValues) => {
    setSaving(true)
    try {
      updateUser(values)
      message.success('Profile saved')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={8}>
          <Card style={{ height: '100%' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%', alignItems: 'center' }}>
              <Avatar
                size={96}
                src={previewAvatar}
                icon={!previewAvatar && <UserOutlined />}
                style={{ backgroundColor: themeToken.colorPrimary }}
              />
              <Space direction="vertical" size={2} style={{ textAlign: 'center' }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {previewName}
                </Typography.Title>
                <Typography.Text type="secondary">{user.email}</Typography.Text>
              </Space>
              <Space wrap style={{ justifyContent: 'center' }}>
                <Tag color="processing" icon={<CheckCircleOutlined />}>Active</Tag>
                <Tag color={twoFactorEnabled ? 'success' : 'warning'} icon={<SafetyCertificateOutlined />}>
                  {twoFactorEnabled ? 'MFA enabled' : 'MFA optional'}
                </Tag>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Account Summary" style={{ height: '100%' }}>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" items={profileSummary} />
          </Card>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <Card
              title="Profile Details"
              extra={
                <Space>
                  <Button onClick={handleReset}>Reset</Button>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Save changes
                  </Button>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Full name"
                    rules={[{ required: true, message: 'Please enter a full name' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: 'Please enter a username' },
                      { min: 3, message: 'Username must be at least 3 characters' },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter an email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="name@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="Phone">
                    <Input placeholder="+1 415 000 0000" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="title" label="Title">
                    <Input placeholder="Workspace Admin" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="department" label="Department">
                    <Input placeholder="Operations" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="location" label="Location">
                    <Input placeholder="City, country" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="avatar" label="Avatar URL">
                    <Input placeholder="https://example.com/avatar.png" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="bio" label="Bio">
                    <Input.TextArea rows={4} placeholder="Short profile note for teammates" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Preferences">
                <Row gutter={16}>
                  <Col xs={24} md={12} xl={24}>
                    <Form.Item name="timezone" label="Timezone">
                      <Select options={timezoneOptions} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} xl={24}>
                    <Form.Item name="language" label="Language">
                      <Select options={languageOptions} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="emailNotifications"
                  label="Email notifications"
                  valuePropName="checked"
                  extra="Receive assignment, customer, and role activity updates."
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name="productUpdates"
                  label="Product updates"
                  valuePropName="checked"
                  extra="Receive release notes and template maintenance notices."
                >
                  <Switch />
                </Form.Item>
              </Card>

              <Card title="Security">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                    These controls are stored locally in the demo profile. Wire them to your identity provider when replacing the mock API.
                  </Typography.Paragraph>
                  <Form.Item
                    name="twoFactorEnabled"
                    label="Two-factor authentication"
                    valuePropName="checked"
                    extra="Mark the account as using a second sign-in factor."
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => message.info('Password changes should be wired to your identity provider.')}
                  >
                    Change password
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </Space>
  )
}

export default ProfilePage
