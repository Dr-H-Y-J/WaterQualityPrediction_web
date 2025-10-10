import { permissionList } from './roleConfig.js'

// 模拟用户数据
export const mockUsers = [
  { id: '1', username: 'admin', role: 'admin', email: 'admin@example.com' },
  { id: '2', username: 'user1', role: 'user', email: 'user1@example.com' },
  { id: '3', username: 'user2', role: 'user', email: 'user2@example.com' },
  { id: '4', username: 'manager1', role: 'manager', email: 'manager1@example.com' },
  { id: '5', username: 'operator1', role: 'operator', email: 'operator1@example.com' },
  { id: '6', username: 'analyst1', role: 'analyst', email: 'analyst1@example.com' },
  { id: '7', username: 'viewer1', role: 'viewer', email: 'viewer1@example.com' },
  { id: '8', username: 'tech1', role: 'technician', email: 'tech1@example.com' },
  { id: '9', username: 'john_doe', role: 'user', email: 'john.doe@example.com' },
  { id: '10', username: 'jane_smith', role: 'manager', email: 'jane.smith@example.com' },
  { id: '11', username: 'mike_wilson', role: 'operator', email: 'mike.wilson@example.com' },
  { id: '12', username: 'sarah_johnson', role: 'analyst', email: 'sarah.johnson@example.com' },
  { id: '13', username: 'tom_brown', role: 'technician', email: 'tom.brown@example.com' },
  { id: '14', username: 'lisa_davis', role: 'viewer', email: 'lisa.davis@example.com' },
  { id: '15', username: 'david_miller', role: 'user', email: 'david.miller@example.com' },
]

// 模拟组别数据
export const mockGroups = [
  {
    id: '1',
    name: '超级管理员',
    description: '拥有系统全部权限',
    permissions: permissionList.map((p: any) => p.id), // 使用 any 类型避免类型错误
    userIds: ['1'],
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    name: '数据管理员',
    description: '负责数据的上传、下载和管理',
    permissions: ['data_view', 'data_upload', 'data_download', 'data_delete', 'report_view'],
    userIds: ['4'],
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
  },
  {
    id: '3',
    name: '设备操作员',
    description: '负责设备的日常操作和监控',
    permissions: ['device_view', 'device_control', 'data_view'],
    userIds: ['5'],
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
  },
  {
    id: '4',
    name: '数据分析师',
    description: '负责数据分析和报表生成',
    permissions: ['data_view', 'data_download', 'report_view', 'report_create', 'report_export'],
    userIds: ['6'],
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
  },
  {
    id: '5',
    name: '普通查看员',
    description: '只能查看基础数据和报表',
    permissions: ['data_view', 'report_view', 'device_view'],
    userIds: ['7'],
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00',
  },
]