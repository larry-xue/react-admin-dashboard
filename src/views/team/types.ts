export type RoleStatus = 'active' | 'pending' | 'deprecated'

export interface RoleFormValues {
  name: string
  description: string
  status: RoleStatus
  owner: string
}

export interface Role {
  id: string
  name: string
  description: string
  status: RoleStatus
  memberCount: number
  permissionCount: number
  updatedAt: string
  owner: string
}

export interface Permission {
  id: string
  name: string
  category: string
  description: string
  enabled: boolean
}

export interface RoleDetail extends Role {
  members: { id: string; name: string; title: string; avatar?: string }[]
  permissions: Permission[]
  auditLog: {
    id: string
    actor: string
    action: string
    timestamp: string
  }[]
}
