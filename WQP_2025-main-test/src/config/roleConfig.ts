// src/config/roleConfig.ts

// 权限列表配置
export interface Permission {
  id: string
  name: string
  category: string
}

export const permissionList: Permission[] = [
  { id: 'user_view', name: '用户查看', category: '用户管理' },
  { id: 'user_create', name: '用户创建', category: '用户管理' },
  { id: 'user_edit', name: '用户编辑', category: '用户管理' },
  { id: 'user_delete', name: '用户删除', category: '用户管理' },
  { id: 'data_view', name: '数据查看', category: '数据管理' },
  { id: 'data_upload', name: '数据上传', category: '数据管理' },
  { id: 'data_download', name: '数据下载', category: '数据管理' },
  { id: 'data_delete', name: '数据删除', category: '数据管理' },
  { id: 'device_view', name: '设备查看', category: '设备管理' },
  { id: 'device_control', name: '设备控制', category: '设备管理' },
  { id: 'device_config', name: '设备配置', category: '设备管理' },
  { id: 'report_view', name: '报表查看', category: '报表管理' },
  { id: 'report_create', name: '报表创建', category: '报表管理' },
  { id: 'report_export', name: '报表导出', category: '报表管理' },
  { id: 'system_config', name: '系统配置', category: '系统管理' },
  { id: 'system_monitor', name: '系统监控', category: '系统管理' },
  { id: 'role_manage', name: '角色管理', category: '系统管理' },
]

// 按分类分组的权限
export const permissionsByCategory = (() => {
  const grouped: Record<string, Permission[]> = {}
  permissionList.forEach((permission) => {
    if (!grouped[permission.category]) {
      grouped[permission.category] = []
    }
    grouped[permission.category].push(permission)
  })
  return grouped
})()

// 获取权限名称
export const getPermissionName = (permissionId: string): string => {
  const permission = permissionList.find((p) => p.id === permissionId)
  return permission ? permission.name : permissionId
}

// 获取权限标签类型
export const getPermissionTagType = (permissionId: string): string => {
  const typeMap: Record<string, string> = {
    user_: 'primary',
    data_: 'success',
    device_: 'warning',
    report_: 'info',
    system_: 'danger',
    role_: 'danger',
  }

  for (const [prefix, type] of Object.entries(typeMap)) {
    if (permissionId.startsWith(prefix)) {
      return type
    }
  }
  return 'default'
}

// 获取用户角色标签类型
export const getUserRoleTagType = (role: string): string => {
  const roleTypeMap: Record<string, string> = {
    admin: 'danger',
    manager: 'warning',
    operator: 'primary',
    analyst: 'success',
    technician: 'info',
    viewer: 'default',
    user: 'default',
  }
  return roleTypeMap[role] || 'default'
}

// 获取用户角色显示名称
export const getUserRoleLabel = (role: string): string => {
  const roleLabelMap: Record<string, string> = {
    admin: '管理员',
    manager: '经理',
    operator: '操作员',
    analyst: '分析师',
    technician: '技术员',
    viewer: '查看员',
    user: '普通用户',
  }
  return roleLabelMap[role] || role
}