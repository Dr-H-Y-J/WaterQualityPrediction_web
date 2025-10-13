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
    // 添加日志来调试
    console.log('正在获取用户列表...');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    console.log('分页参数:', { page, limit });
    
    const users = await User.findAll(page, limit);
    const total = await User.count();
    
    console.log('获取到的用户数据:', users.length);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    // 返回更详细的错误信息
    res.status(500).json({
      success: false,
      message: '获取用户列表失败: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};const createUser = async (req, res) => {
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

// 批量创建用户
const batchCreateUsers = async (req, res) => {
  try {
    const usersToCreate = req.body;
    
    if (!Array.isArray(usersToCreate) || usersToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的用户数据数组'
      });
    }
    
    let createdCount = 0;
    let failedCount = 0;
    const errors = [];
    
    // 批量创建用户
    for (const [index, userData] of usersToCreate.entries()) {
      try {
        // 验证必要字段
        if (!userData.username || !userData.password) {
          errors.push(`第${index + 1}行: 用户名或密码不能为空`);
          failedCount++;
          continue;
        }
        
        // 检查用户是否已存在
        const existingUser = await User.findByUsername(userData.username);
        if (existingUser) {
          errors.push(`第${index + 1}行: 用户名 "${userData.username}" 已存在`);
          failedCount++;
          continue;
        }
        
        // 加密密码
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(userData.password, saltRounds);
        
        // 创建用户
        const result = await User.create({
          username: userData.username,
          email: userData.email || null,
          password_hash,
          role: userData.role || 'user'
        });
        
        if (result) {
          createdCount++;
        } else {
          errors.push(`第${index + 1}行: 创建用户失败`);
          failedCount++;
        }
      } catch (error) {
        console.error(`创建用户失败 (第${index + 1}行):`, error);
        errors.push(`第${index + 1}行: ${error.message}`);
        failedCount++;
      }
    }
    
    res.status(201).json({
      success: true,
      data: {
        createdCount,
        failedCount,
        errors: failedCount > 0 ? errors : undefined
      },
      message: `批量导入完成：成功创建 ${createdCount} 条数据，失败 ${failedCount} 条`
    });
  } catch (error) {
    console.error('批量创建用户失败:', error);
    res.status(500).json({
      success: false,
      message: '批量创建用户失败: ' + error.message
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
  batchCreateUsers, // 添加这一行
  getUserById,
  updateUser,
  deleteUser
};