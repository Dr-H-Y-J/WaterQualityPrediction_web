// src/controllers/userController.js
const User = require('../models/User');
const RolePermission = require('../models/RolePermission');
const bcrypt = require('bcryptjs');

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 获取用户权限
    const permissions = await RolePermission.findUserPermissions(user.role);
    
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        permissions: permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
};

// 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 加密密码
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // 创建用户
    const userId = await User.create({
      username,
      email,
      password_hash,
      role: role || 'user' // 默认角色为user
    });
    
    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: { id: userId }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: '创建用户失败'
    });
  }
};

// 获取用户详情
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    
    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新用户
    const success = await User.update(id, { username, email, role });
    
    if (success) {
      res.status(200).json({
        success: true,
        message: '用户更新成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '用户更新失败'
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: '更新用户失败'
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 删除用户
    const success = await User.delete(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: '用户删除成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '用户删除失败'
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败'
    });
  }
};

module.exports = {
  login,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};