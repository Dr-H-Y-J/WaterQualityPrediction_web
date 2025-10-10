// src/scripts/initData.js
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');

// 初始权限数据
const initialPermissions = [
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
];

// 角色权限映射
const rolePermissions = {
  'admin': initialPermissions.map(p => p.id),
  'manager': ['data_view', 'data_upload', 'data_download', 'data_delete', 'report_view'],
  'operator': ['device_view', 'device_control', 'data_view'],
  'analyst': ['data_view', 'data_download', 'report_view', 'report_create', 'report_export'],
  'viewer': ['data_view', 'report_view', 'device_view'],
  'user': ['data_view', 'report_view']
};

const initPermissionsAndRoles = async () => {
  try {
    // 插入初始权限
    await Permission.insertInitialPermissions(initialPermissions);
    console.log('初始权限数据插入完成');
    
    // 为每个角色分配权限
    for (const [role, permissions] of Object.entries(rolePermissions)) {
      await RolePermission.assignPermissionsToRole(role, permissions);
      console.log(`角色 ${role} 的权限分配完成`);
    }
    
    console.log('所有初始数据插入完成');
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

module.exports = initPermissionsAndRoles;