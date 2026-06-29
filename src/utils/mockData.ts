import { Customer, CustomerActivity, CustomerFormValues, CustomerSource, CustomerStatus } from '../views/customers/types'
import type { Role, RoleDetail, Permission, RoleFormValues } from '../views/team/types'

const sleep = (delay = 320) => new Promise(resolve => setTimeout(resolve, delay))

const randomId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createActivity = (
  customerId: string,
  summary: string,
  options: { actor?: string; type?: CustomerActivity['type']; statusAfter?: CustomerStatus } = {},
): CustomerActivity => ({
  id: `ACT-${randomId()}`,
  customerId,
  actor: options.actor ?? 'System',
  type: options.type ?? 'note',
  summary,
  timestamp: new Date().toISOString(),
  statusAfter: options.statusAfter,
})

const seededCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Acme Corp',
    email: 'ops@acme.com',
    phone: '+1 415-555-1010',
    company: 'Acme Corp',
    position: 'Operations Lead',
    source: CustomerSource.Website,
    status: CustomerStatus.Active,
    owner: 'Jamie Lee',
    lifetimeValue: 48000,
    monthlyRecurringRevenue: 4000,
    notes: 'Enterprise plan. Weekly sync on Mondays.',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-11-02T08:10:00Z',
  },
  {
    id: 'CUS-1002',
    name: 'Nova Retail',
    email: 'cto@novaretail.io',
    phone: '+44 20 7946 0890',
    company: 'Nova Retail',
    position: 'CTO',
    source: CustomerSource.Referral,
    status: CustomerStatus.InProgress,
    owner: 'Iris Chen',
    lifetimeValue: 18000,
    monthlyRecurringRevenue: 1500,
    notes: 'Evaluating automation workflow add-on.',
    createdAt: '2024-08-01T15:30:00Z',
  },
  {
    id: 'CUS-1003',
    name: 'BrightPath Health',
    email: 'product@brightpath.health',
    phone: '+1 312-555-9823',
    company: 'BrightPath Health',
    position: 'Product Manager',
    source: CustomerSource.Ads,
    status: CustomerStatus.Prospect,
    owner: 'Jamie Lee',
    notes: 'Needs HIPAA appendix. Follow-up scheduled next week.',
    createdAt: '2024-10-05T12:20:00Z',
  },
  {
    id: 'CUS-1004',
    name: 'Atlas Logistics',
    email: 'finance@atlaslogi.st',
    phone: '+61 2 9374 4000',
    company: 'Atlas Logistics',
    position: 'Finance Lead',
    source: CustomerSource.Partner,
    status: CustomerStatus.Active,
    owner: 'Marco Díaz',
    lifetimeValue: 6200,
    monthlyRecurringRevenue: 520,
    notes: 'Regional rollout underway, upsell alert for Q1.',
    createdAt: '2023-12-19T09:45:00Z',
    updatedAt: '2024-10-28T11:15:00Z',
  },
]

let customers = [...seededCustomers]

let activities: CustomerActivity[] = [
  {
    id: 'ACT-1',
    customerId: 'CUS-1002',
    actor: 'Iris Chen',
    type: 'call',
    summary: 'Discovery call about automation workflow needs.',
    timestamp: '2024-11-20T16:00:00Z',
    statusAfter: CustomerStatus.InProgress,
  },
  {
    id: 'ACT-2',
    customerId: 'CUS-1001',
    actor: 'Jamie Lee',
    type: 'deal',
    summary: 'Renewed enterprise contract for another 12 months.',
    timestamp: '2024-11-10T09:00:00Z',
    statusAfter: CustomerStatus.Active,
  },
]

const roleSeeds: RoleDetail[] = [
  {
    id: 'ROL-1',
    name: 'Workspace Admin',
    description: 'Full access to billing, members, and security settings.',
    status: 'active',
    memberCount: 4,
    permissionCount: 18,
    updatedAt: '2024-11-24T10:00:00Z',
    owner: 'Jamie Lee',
    members: [
      { id: 'U-1', name: 'Jamie Lee', title: 'Head of Ops' },
      { id: 'U-2', name: 'Marco Díaz', title: 'Finance Lead' },
    ],
    permissions: [
      { id: 'perm-1', name: 'Manage Billing', category: 'Billing', description: 'Access invoices, payment settings, and coupons.', enabled: true },
      { id: 'perm-2', name: 'Invite Members', category: 'Members', description: 'Invite or remove workspace members.', enabled: true },
      { id: 'perm-3', name: 'Edit Roles', category: 'Access Control', description: 'Create or update custom roles.', enabled: true },
    ],
    auditLog: [
      { id: 'audit-1', actor: 'Jamie Lee', action: 'Updated permissions', timestamp: '2024-11-20T09:00:00Z' },
      { id: 'audit-2', actor: 'Marco Díaz', action: 'Removed member limit', timestamp: '2024-11-10T12:30:00Z' },
    ],
  },
  {
    id: 'ROL-2',
    name: 'Sales Manager',
    description: 'Manage pipeline, quotas, and team assignments.',
    status: 'active',
    memberCount: 8,
    permissionCount: 11,
    updatedAt: '2024-11-21T15:40:00Z',
    owner: 'Iris Chen',
    members: [
      { id: 'U-3', name: 'Iris Chen', title: 'Revenue Director' },
      { id: 'U-4', name: 'Alex Morgan', title: 'Regional Lead' },
    ],
    permissions: [
      { id: 'perm-4', name: 'View Revenue Dashboard', category: 'Analytics', description: 'Access team KPIs and forecasts.', enabled: true },
      { id: 'perm-5', name: 'Assign Leads', category: 'CRM', description: 'Assign or reassign leads.', enabled: true },
      { id: 'perm-6', name: 'Export Deals', category: 'CRM', description: 'Export pipeline data.', enabled: false },
    ],
    auditLog: [
      { id: 'audit-3', actor: 'Iris Chen', action: 'Granted export access to Alex Morgan', timestamp: '2024-11-05T08:20:00Z' },
    ],
  },
  {
    id: 'ROL-3',
    name: 'Support Agent',
    description: 'Limited access to ticketing and customer profiles.',
    status: 'pending',
    memberCount: 25,
    permissionCount: 6,
    updatedAt: '2024-11-18T07:15:00Z',
    owner: 'Nina Patel',
    members: [],
    permissions: [
      { id: 'perm-7', name: 'View Tickets', category: 'Support', description: 'Access assigned and team tickets.', enabled: true },
      { id: 'perm-8', name: 'Reply to Tickets', category: 'Support', description: 'Reply using shared inbox.', enabled: true },
      { id: 'perm-9', name: 'View Billing Data', category: 'Billing', description: 'Read-only access to invoices.', enabled: false },
    ],
    auditLog: [],
  },
]

let roles = [...roleSeeds]

const defaultPermissionTemplates: Array<Omit<Permission, 'id'>> = [
  {
    name: 'View Dashboard',
    category: 'Analytics',
    description: 'Read workspace health metrics and revenue charts.',
    enabled: true,
  },
  {
    name: 'View Customers',
    category: 'CRM',
    description: 'Read customer profiles, lifecycle status, and activity history.',
    enabled: true,
  },
  {
    name: 'Edit Customers',
    category: 'CRM',
    description: 'Create, edit, assign, and update customer records.',
    enabled: false,
  },
  {
    name: 'Invite Members',
    category: 'Members',
    description: 'Invite users and manage member access.',
    enabled: false,
  },
  {
    name: 'Edit Roles',
    category: 'Access Control',
    description: 'Create or update custom team roles.',
    enabled: false,
  },
]

const createDefaultPermissions = (): Permission[] =>
  defaultPermissionTemplates.map(permission => ({
    ...permission,
    id: `perm-${randomId()}`,
  }))

const toRoleSummary = (role: RoleDetail): Role => ({
  id: role.id,
  name: role.name,
  description: role.description,
  status: role.status,
  memberCount: role.memberCount,
  permissionCount: role.permissionCount,
  updatedAt: role.updatedAt,
  owner: role.owner,
})

export interface DashboardStats {
  totalCustomers: number
  newCustomers: number
  monthlyRecurringRevenue: number
  activeDeals: number
  revenueTrend: { month: string; revenue: number }[]
  sourceDistribution: { type: string; value: number }[]
  recentActivities: CustomerActivity[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await sleep()
  const now = new Date()
  const newCustomers = customers.filter(customer => {
    const created = new Date(customer.createdAt)
    return created.getUTCFullYear() === now.getUTCFullYear() && created.getUTCMonth() === now.getUTCMonth()
  })

  const revenueTrend = Array.from({ length: 6 }).map((_, idx) => {
    const date = new Date()
    date.setUTCMonth(date.getUTCMonth() - (5 - idx))
    const monthLabel = date.toLocaleString('default', { month: 'short' })
    const revenue = customers.reduce((sum, customer) => {
      if (customer.monthlyRecurringRevenue) {
        return sum + customer.monthlyRecurringRevenue * (0.8 + Math.random() * 0.4)
      }
      return sum
    }, 0)
    return { month: monthLabel, revenue: Number(revenue.toFixed(0)) }
  })

  const sourceCounts = customers.reduce<Record<string, number>>((acc, customer) => {
    acc[customer.source] = (acc[customer.source] ?? 0) + 1
    return acc
  }, {})

  return {
    totalCustomers: customers.length,
    newCustomers: newCustomers.length,
    monthlyRecurringRevenue: customers.reduce((sum, customer) => sum + (customer.monthlyRecurringRevenue ?? 0), 0),
    activeDeals: customers.filter(customer => customer.status === CustomerStatus.InProgress).length,
    revenueTrend,
    sourceDistribution: Object.entries(sourceCounts).map(([type, value]) => ({ type, value })),
    recentActivities: activities.slice(0, 5),
  }
}

export const getCustomers = async (): Promise<Customer[]> => {
  await sleep()
  return customers
}

export const getCustomer = async (id: string): Promise<Customer | undefined> => {
  await sleep()
  return customers.find(customer => customer.id === id)
}

export const createCustomer = async (payload: CustomerFormValues): Promise<Customer> => {
  await sleep()
  const newCustomer: Customer = {
    id: `CUS-${randomId()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  }
  customers = [newCustomer, ...customers]
  activities = [
    createActivity(newCustomer.id, 'Created a new customer record', {
      actor: payload.owner,
      statusAfter: payload.status,
    }),
    ...activities,
  ]
  return newCustomer
}

export const updateCustomer = async (id: string, payload: Partial<CustomerFormValues>): Promise<Customer> => {
  await sleep()
  const index = customers.findIndex(customer => customer.id === id)
  if (index === -1) {
    throw new Error('Customer not found')
  }
  const existing = customers[index]
  const updated: Customer = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  customers[index] = updated
  if (payload.status && payload.status !== existing.status) {
    activities = [
      createActivity(updated.id, `Status updated from ${existing.status} to ${payload.status}`, {
        actor: payload.owner,
        type: 'deal',
        statusAfter: payload.status,
      }),
      ...activities,
    ]
  }
  return updated
}

export const bulkUpdateCustomerStatus = async (ids: string[], status: CustomerStatus): Promise<Customer[]> => {
  await sleep()
  const idSet = new Set(ids)
  const updatedCustomers: Customer[] = []
  const nextActivities: CustomerActivity[] = []

  customers = customers.map(customer => {
    if (!idSet.has(customer.id)) return customer

    const updated: Customer = {
      ...customer,
      status,
      updatedAt: new Date().toISOString(),
    }
    updatedCustomers.push(updated)

    if (customer.status !== status) {
      nextActivities.push(createActivity(customer.id, `Bulk status update from ${customer.status} to ${status}`, {
        actor: customer.owner ?? 'Bulk action',
        type: 'deal',
        statusAfter: status,
      }))
    }

    return updated
  })

  if (updatedCustomers.length === 0) {
    throw new Error('No customers found')
  }

  activities = [...nextActivities, ...activities]
  return updatedCustomers
}

export const bulkAssignCustomerOwner = async (ids: string[], owner: string): Promise<Customer[]> => {
  await sleep()
  const idSet = new Set(ids)
  const updatedCustomers: Customer[] = []

  customers = customers.map(customer => {
    if (!idSet.has(customer.id)) return customer

    const updated: Customer = {
      ...customer,
      owner,
      updatedAt: new Date().toISOString(),
    }
    updatedCustomers.push(updated)
    return updated
  })

  if (updatedCustomers.length === 0) {
    throw new Error('No customers found')
  }

  activities = [
    ...updatedCustomers.map(customer =>
      createActivity(customer.id, `Assigned owner to ${owner}`, {
        actor: owner,
        type: 'note',
        statusAfter: customer.status,
      }),
    ),
    ...activities,
  ]
  return updatedCustomers
}

export const bulkDeleteCustomers = async (ids: string[]): Promise<void> => {
  await sleep()
  const idSet = new Set(ids)
  customers = customers.filter(customer => !idSet.has(customer.id))
  activities = activities.filter(activity => !idSet.has(activity.customerId))
}

export const deleteCustomer = async (id: string): Promise<void> => {
  await sleep()
  customers = customers.filter(customer => customer.id !== id)
  activities = activities.filter(activity => activity.customerId !== id)
}

export const getCustomerActivities = async (customerId: string): Promise<CustomerActivity[]> => {
  await sleep()
  return activities.filter(activity => activity.customerId === customerId)
}

export const getRoles = async (): Promise<Role[]> => {
  await sleep()
  return roles.map(toRoleSummary)
}

export const getRoleDetail = async (roleId: string): Promise<RoleDetail | undefined> => {
  await sleep()
  return roles.find(role => role.id === roleId)
}

export const createRole = async (payload: RoleFormValues): Promise<RoleDetail> => {
  await sleep()
  const permissions = createDefaultPermissions()
  const now = new Date().toISOString()
  const role: RoleDetail = {
    id: `ROL-${randomId()}`,
    ...payload,
    memberCount: 0,
    permissionCount: permissions.filter(permission => permission.enabled).length,
    updatedAt: now,
    members: [],
    permissions,
    auditLog: [
      {
        id: `audit-${randomId()}`,
        actor: payload.owner,
        action: 'Created role',
        timestamp: now,
      },
    ],
  }

  roles = [role, ...roles]
  return role
}

export const updateRole = async (roleId: string, payload: RoleFormValues): Promise<RoleDetail> => {
  await sleep()
  const role = roles.find(roleEntry => roleEntry.id === roleId)
  if (!role) {
    throw new Error('Role not found')
  }

  const now = new Date().toISOString()
  const updated: RoleDetail = {
    ...role,
    ...payload,
    updatedAt: now,
    auditLog: [
      {
        id: `audit-${randomId()}`,
        actor: payload.owner,
        action: 'Updated role details',
        timestamp: now,
      },
      ...role.auditLog,
    ],
  }

  roles = roles.map(roleEntry => (roleEntry.id === roleId ? updated : roleEntry))
  return updated
}

export const updateRolePermissions = async (roleId: string, permissions: Permission[]): Promise<RoleDetail> => {
  await sleep()
  const role = roles.find(roleEntry => roleEntry.id === roleId)
  if (!role) {
    throw new Error('Role not found')
  }
  role.permissions = permissions
  role.permissionCount = permissions.filter(permission => permission.enabled).length
  role.updatedAt = new Date().toISOString()
  roles = roles.map(roleEntry => (roleEntry.id === roleId ? role : roleEntry))
  return role
}
