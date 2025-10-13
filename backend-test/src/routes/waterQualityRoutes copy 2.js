// src/routes/waterQualityRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getDatasets, 
  getDataByTable, 
  predictWaterQuality,
  getModelList
} = require('../controllers/waterQualityController');

// 获取所有数据集列表
router.get('/datasets', getDatasets);

// 获取指定表的数据
router.get('/datasets/:table_name', getDataByTable);

// 添加专门的预览路由（与上面路由功能相同，但语义更清晰）
router.get('/datasets/:table_name/preview', getDataByTable);

// 水质预测路由
router.post('/predict', predictWaterQuality);

// 获取模型列表
router.get('/models', getModelList);

module.exports = router;