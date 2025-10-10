// src/routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const { getAllPermissions, getUserPermissions } = require('../controllers/permissionController');

// 获取所有权限
router.get('/', getAllPermissions);

// 获取特定角色的权限
router.get('/:role', getUserPermissions);

module.exports = router;