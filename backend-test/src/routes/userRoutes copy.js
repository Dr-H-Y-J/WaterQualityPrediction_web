const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 获取所有用户
router.get('/users', userController.getAllUsers);

// 获取用户信息
router.get('/users/:id', userController.getUserById);

// 更新用户
router.put('/users/:id', userController.updateUser);

// 删除用户
router.delete('/users/:id', userController.deleteUser);

module.exports = router;