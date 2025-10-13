// src/controllers/waterQualityController.js
const WaterQuality = require('../models/WaterQuality');

// 获取所有数据集列表
exports.getDatasets = async (req, res) => {
  try {
    const datasets = await WaterQuality.getDatasets();
    
    res.json({
      datasets,
      total: datasets.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '获取数据集失败' });
  }
};

// 获取指定表的数据
exports.getDataByTable = async (req, res) => {
  try {
    const { table_name } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const data = await WaterQuality.getDataByTable(table_name, limit, offset);
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '获取数据失败: ' + error.message });
  }
};