// src/routes/rolePermissionRoutes.js
const express = require('express');
const router = express.Router();
const { getRolePermissions, assignPermissionsToRole } = require('../controllers/rolePermissionController');

// 获取角色权限
router.get('/:role', getRolePermissions);

// 为角色分配权限
router.post('/:role', assignPermissionsToRole);

module.exports = router;