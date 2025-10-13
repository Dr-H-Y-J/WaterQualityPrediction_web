// src/controllers/waterQualityController.js
const WaterQuality = require('../models/WaterQuality');

// 获取所有数据集列表
exports.getDatasets = async (req, res) => {
  try {
    const datasets = await WaterQuality.getDatasets();
    
    res.json({
      success: true,
      datasets,
      total: datasets.length
    });
  } catch (error) {
    console.error('获取数据集失败:', error);
    res.status(500).json({ 
      success: false,
      error: '获取数据集失败',
      message: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
};

// 获取指定表的数据
exports.getDataByTable = async (req, res) => {
  try {
    const { table_name } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // 参数验证
    if (!table_name) {
      return res.status(400).json({
        success: false,
        error: '缺少表名参数'
      });
    }
    
    // 确保参数是数字类型并设置默认值
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit) || 10));
    const offsetNum = Math.max(0, parseInt(offset) || 0);
    
    const data = await WaterQuality.getDataByTable(table_name, limitNum, offsetNum);
    
    // 添加缓存控制头，避免304缓存问题
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('获取数据失败:', error);
    
    // 根据错误类型返回不同的状态码
    if (error.message.includes('不存在')) {
      res.status(404).json({ 
        success: false,
        error: '请求的表不存在',
        message: error.message
      });
    } else if (error.message.includes('非法字符')) {
      res.status(400).json({ 
        success: false,
        error: '无效的表名',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: '获取数据失败',
        message: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
      });
    }
  }
};