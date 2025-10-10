// src/controllers/permissionController.js
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');

// 获取所有权限
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      message: '获取权限列表失败'
    });
  }
};

// 获取用户权限
const getUserPermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const permissions = await RolePermission.findUserPermissions(role);
    
    res.status(200).json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({
      success: false,
      message: '获取用户权限失败'
    });
  }
};

module.exports = {
  getAllPermissions,
  getUserPermissions
};