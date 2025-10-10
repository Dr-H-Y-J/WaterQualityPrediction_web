// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  login, 
  getAllUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');

// 用户登录
router.post('/login', login);

// 获取所有用户
router.get('/', getAllUsers);

// 创建用户
router.post('/', createUser);

// 获取用户详情
router.get('/:id', getUserById);

// 更新用户
router.put('/:id', updateUser);

// 删除用户
router.delete('/:id', deleteUser);

module.exports = router;