// src/models/WaterQuality.js
const { promisePool } = require('../config/database');

class WaterQuality {
  // 获取数据集列表（这里简化为返回new_data表）
  static async getDatasets() {
    try {
      const [rows] = await promisePool.query('SELECT COUNT(*) as count FROM new_data');
      return [{
        id: 1,
        table_name: 'new_data',
        description: '水质监测数据',
        created_at: new Date().toISOString(),
        row_count: rows[0].count
      }];
    } catch (error) {
      throw error;
    }
  }

  // 获取指定表的数据（分页）
  static async getDataByTable(tableName, limit = 10, offset = 0) {
    if (tableName !== 'new_data') {
      throw new Error('不支持的数据表');
    }

    try {
      const [rows] = await promisePool.query(
        'SELECT date, temperature, pH, O2, NTU, uS FROM new_data LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );
      
      const [countResult] = await promisePool.query('SELECT COUNT(*) as count FROM new_data');
      
      return {
        rows,
        total: countResult[0].count
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WaterQuality;