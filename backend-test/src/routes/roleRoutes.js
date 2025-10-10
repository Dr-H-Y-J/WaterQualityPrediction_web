// src/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllRoles, 
  createRole, 
  updateRole, 
  deleteRole
} = require('../controllers/roleController');

// 角色相关路由
router.get('/', getAllRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;