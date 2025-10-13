// src/controllers/userController.js
const User = require('../models/User');
const RolePermission = require('../models/RolePermission');
const bcrypt = require('bcryptjs');

// 获取所有用户（支持分页）
const getAllUsers = async (req, res) => {
  try {
    console.log('开始获取用户列表...');
    
    // 获取分页参数，设置默认值
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    // 确保参数有效
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 限制最大每页100条
    
    console.log('分页参数:', { page: validPage, limit: validLimit });
    
    const users = await User.findAll(validPage, validLimit);
    const total = await User.count();
    
    console.log('获取到用户数量:', users.length);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: total,
        pages: Math.ceil(total / validLimit)
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败: ' + error.message
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 检查必要参数
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }
    
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
    
    // 登录成功，返回用户信息（实际项目中应该生成JWT令牌）
    res.status(200).json({
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // 参数验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码是必填项'
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 密码加密
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // 创建用户
    const userData = {
      username,
      email: email || '',
      password_hash,
      role: role || 'user'
    };
    
    const userId = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: { id: userId, username, email, role: userData.role }
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({
      success: false,
      message: '创建用户失败: ' + error.message
    });
  }
};

// 批量创建用户
const batchCreateUsers = async (req, res) => {
  try {
    const users = req.body;
    
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的用户数据数组'
      });
    }
    
    const createdUsers = [];
    const errors = [];
    
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      
      try {
        // 验证必要字段
        if (!userData.username || !userData.password) {
          errors.push(`用户 ${i+1}: 用户名和密码是必填项`);
          continue;
        }
        
        // 检查用户是否已存在
        const existingUser = await User.findByUsername(userData.username);
        if (existingUser) {
          errors.push(`用户 ${i+1}: 用户名 "${userData.username}" 已存在`);
          continue;
        }
        
        // 密码加密
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(userData.password, saltRounds);
        
        // 创建用户
        const userToCreate = {
          username: userData.username,
          email: userData.email || '',
          password_hash,
          role: userData.role || 'user'
        };
        
        const userId = await User.create(userToCreate);
        createdUsers.push({
          id: userId,
          username: userData.username,
          email: userData.email,
          role: userData.role || 'user'
        });
      } catch (userError) {
        errors.push(`用户 ${i+1}: ${userError.message}`);
      }
    }
    
    res.status(201).json({
      success: true,
      message: `成功创建 ${createdUsers.length} 个用户`,
      data: {
        created: createdUsers,
        errors: errors
      }
    });
  } catch (error) {
    console.error('批量创建用户失败:', error);
    res.status(500).json({
      success: false,
      message: '批量创建用户失败: ' + error.message
    });
  }
};

// 根据ID获取用户
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '用户ID是必需的'
      });
    }
    
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
    console.error('获取用户失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户失败: ' + error.message
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '用户ID是必需的'
      });
    }
    
    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新用户信息
    const userData = {
      username: username || existingUser.username,
      email: email !== undefined ? email : existingUser.email,
      role: role || existingUser.role
    };
    
    const updated = await User.update(id, userData);
    
    if (updated) {
      const updatedUser = await User.findById(id);
      res.status(200).json({
        success: true,
        message: '用户更新成功',
        data: updatedUser
      });
    } else {
      res.status(500).json({
        success: false,
        message: '用户更新失败'
      });
    }
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户失败: ' + error.message
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '用户ID是必需的'
      });
    }
    
    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 删除用户
    const deleted = await User.delete(id);
    
    if (deleted) {
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
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败: ' + error.message
    });
  }
};

module.exports = {
  login,
  getAllUsers,
  createUser,
  batchCreateUsers,
  getUserById,
  updateUser,
  deleteUser
};