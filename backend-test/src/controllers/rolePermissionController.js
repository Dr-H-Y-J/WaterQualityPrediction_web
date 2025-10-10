// src/controllers/rolePermissionController.js
const RolePermission = require('../models/RolePermission');

// 获取角色权限
const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const permissions = await RolePermission.findByRole(role);
    
    res.status(200).json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({
      success: false,
      message: '获取角色权限失败'
    });
  }
};

// 分配权限给角色
const assignPermissionsToRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissionIds } = req.body;
    
    await RolePermission.assignPermissionsToRole(role, permissionIds);
    
    res.status(200).json({
      success: true,
      message: '权限分配成功'
    });
  } catch (error) {
    console.error('Error assigning permissions to role:', error);
    res.status(500).json({
      success: false,
      message: '权限分配失败'
    });
  }
};

module.exports = {
  getRolePermissions,
  assignPermissionsToRole
};