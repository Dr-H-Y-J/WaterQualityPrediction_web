// src/controllers/roleController.js
const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');

// 获取所有角色
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    
    // 为每个角色添加权限和用户信息
    const rolesWithDetails = await Promise.all(roles.map(async (role) => {
      const permissions = await RolePermission.findByRole(role.name);
      const users = await Role.getUsersByRoleId(role.id);
      return {
        ...role,
        userIds: users.map(user => user.id),
        users: users,
        permissions: permissions
      };
    }));
    
    res.status(200).json({
      success: true,
      data: rolesWithDetails
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: '获取角色列表失败'
    });
  }
};

// 创建角色
const createRole = async (req, res) => {
  try {
    const { name, description, permissions, userIds } = req.body;
    
    // 检查角色是否已存在
    const existingRole = await Role.findByName(name);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: '角色名称已存在'
      });
    }
    
    // 创建角色
    const roleId = await Role.create({ name, description });
    
    // 分配权限
    if (permissions && permissions.length > 0) {
      await RolePermission.assignPermissionsToRole(name, permissions);
    }
    
    // 分配用户
    if (userIds && userIds.length > 0) {
      await Role.assignUsersToRole(roleId, userIds);
    }
    
    // 获取创建后的角色详情
    const newRole = await Role.findById(roleId);
    const users = await Role.getUsersByRoleId(roleId);
    const rolePermissions = await RolePermission.findByRole(name);
    
    res.status(201).json({
      success: true,
      data: {
        ...newRole,
        userIds: users.map(user => user.id),
        users: users,
        permissions: rolePermissions
      },
      message: '角色创建成功'
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: '创建角色失败'
    });
  }
};

// 更新角色
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, userIds } = req.body;
    
    // 检查角色是否存在
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    // 更新角色信息
    const success = await Role.update(id, { name, description });
    if (!success) {
      return res.status(500).json({
        success: false,
        message: '更新角色失败'
      });
    }
    
    // 更新权限
    if (permissions) {
      await RolePermission.assignPermissionsToRole(name, permissions);
    }
    
    // 更新用户分配
    if (userIds) {
      await Role.assignUsersToRole(id, userIds);
    }
    
    // 获取更新后的角色详情
    const updatedRole = await Role.findById(id);
    const users = await Role.getUsersByRoleId(id);
    const rolePermissions = await RolePermission.findByRole(name);
    
    res.status(200).json({
      success: true,
      data: {
        ...updatedRole,
        userIds: users.map(user => user.id),
        users: users,
        permissions: rolePermissions
      },
      message: '角色更新成功'
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: '更新角色失败'
    });
  }
};

// 删除角色
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查角色是否存在
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    // 删除角色
    const success = await Role.delete(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: '角色删除成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '角色删除失败'
      });
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: '删除角色失败'
    });
  }
};

// 确保只导出实际存在的函数
module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole
};