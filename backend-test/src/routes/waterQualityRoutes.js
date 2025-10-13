// src/routes/waterQualityRoutes.js
const express = require('express');
const router = express.Router();
const { getDatasets, getDataByTable } = require('../controllers/waterQualityController');

// 获取所有数据集列表
router.get('/datasets', getDatasets);

// 获取指定表的数据
router.get('/datasets/:table_name', getDataByTable);

module.exports = router;