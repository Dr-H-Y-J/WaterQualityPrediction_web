const User = require('../models/User');
const bcrypt = require('bcrypt');

// 用户注册
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ 
        message: '用户名已存在' 
      });
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const userId = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: '用户注册成功',
      userId
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ 
        message: '用户名或密码错误' 
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: '用户名或密码错误' 
      });
    }

    // 这里应该生成JWT token，简化处理
    res.status(200).json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

// 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

// 获取用户信息
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        message: '用户不存在' 
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    
    const result = await User.update(id, { username, role });
    
    if (!result) {
      return res.status(404).json({ 
        message: '用户不存在' 
      });
    }
    
    res.status(200).json({ 
      message: '用户更新成功' 
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 不能删除自己（如果是管理员操作）
    // 这里简化处理
    
    const result = await User.delete(id);
    
    if (!result) {
      return res.status(404).json({ 
        message: '用户不存在' 
      });
    }
    
    res.status(200).json({ 
      message: '用户删除成功' 
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};