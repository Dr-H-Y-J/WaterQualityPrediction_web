// src/controllers/waterQualityController.js
const WaterQuality = require('../models/WaterQuality');
const axios = require('axios');

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

// 获取指定表的预览数据（用于前端预览）
exports.getTablePreview = async (req, res) => {
  try {
    const { table_name } = req.params;
    const { limit = 5 } = req.query;
    
    // 参数验证
    if (!table_name) {
      return res.status(400).json({
        success: false,
        error: '缺少表名参数'
      });
    }
    
    // 确保参数是数字类型并设置默认值
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 5));
    
    // 获取表数据
    const data = await WaterQuality.getDataByTable(table_name, limitNum, 0);
    
    // 获取表列信息
    const columns = await WaterQuality.getTableColumns(table_name);
    
    res.json({
      success: true,
      ...data,
      columns
    });
  } catch (error) {
    console.error('获取预览数据失败:', error);
    
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
        error: '获取预览数据失败',
        message: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
      });
    }
  }
};

// 水质预测功能
exports.predictWaterQuality = async (req, res) => {
  try {
    const { table_name, prediction_hours = 24, model_type = 'R-Informer' } = req.body;
    
    // 参数验证
    if (!table_name) {
      return res.status(400).json({
        success: false,
        error: '缺少表名参数'
      });
    }
    
    // 获取数据用于预测
    const data = await WaterQuality.getDataByTable(table_name, 1000, 0); // 获取最近1000条数据
    
    // 准备输入数据
    const inputData = data.rows.map(row => [
      parseFloat(row.temperature),
      parseFloat(row.pH),
      parseFloat(row.O2),
      parseFloat(row.NTU),
      parseFloat(row.uS)
    ]);
    
    // 调用Python模型服务
    const modelServiceUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:5001';
    
    const response = await axios.post(`${modelServiceUrl}/predict`, {
      input_data: inputData,
      prediction_hours: parseInt(prediction_hours),
      model_type: model_type
    }, {
      timeout: 30000 // 30秒超时
    });
    
    if (response.data.success) {
      // 处理预测结果，添加水质状态判断
      const predictionsWithQuality = response.data.predictions.map(pred => ({
        ...pred,
        quality: determineWaterQuality(pred)
      }));
      
      res.json({
        success: true,
        predictions: predictionsWithQuality,
        model_type: response.data.model_type,
        prediction_hours: response.data.prediction_hours
      });
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('预测失败:', error);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        success: false,
        error: '模型服务不可用',
        message: '预测模型服务当前不可用，请稍后重试'
      });
    } else {
      res.status(500).json({
        success: false,
        error: '预测失败',
        message: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
      });
    }
  }
};

// 获取模型列表
exports.getModelList = async (req, res) => {
  try {
    const modelServiceUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:5001';
    
    const response = await axios.get(`${modelServiceUrl}/models`, {
      timeout: 5000
    });
    
    if (response.data.success) {
      res.json({
        success: true,
        models: response.data.models
      });
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('获取模型列表失败:', error);
    
    // 返回默认模型列表
    const defaultModels = [
      {
        name: 'R-Informer',
        versions: [
          { label: '水质预测 R-Informer v1.0', value: 'r_informer_v1_0', accuracy: '95.2%', trainDate: '2024-08-10' },
          { label: '水质预测 R-Informer best_model', value: 'r_informer_best', accuracy: '96.8%', trainDate: '2024-08-12' },
          { label: '水质预测 R-Informer checkpoint_100', value: 'r_informer_cp100', accuracy: '94.5%', trainDate: '2024-08-08' }
        ]
      }
    ];
    
    res.json({
      success: true,
      models: defaultModels
    });
  }
};

// 判断水质状态
function determineWaterQuality(prediction) {
  const { pH, O2, NTU } = prediction;
  
  // 水质判断逻辑
  if (pH < 6.5 || pH > 8.5 || O2 < 4 || NTU > 20) {
    return '异常';
  } else if (pH < 7 || pH > 8 || O2 < 5 || NTU > 10) {
    return '警告';
  } else {
    return '正常';
  }
}