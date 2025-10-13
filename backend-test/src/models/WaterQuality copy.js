// src/models/WaterQuality.js
const { promisePool } = require('../config/database');

class WaterQuality {
  // 获取所有数据集（表）
  static async getDatasets() {
    try {
      // 获取所有表名（假设水质数据表有特定前缀或标识）
      const [tables] = await promisePool.execute(
        "SHOW TABLES LIKE 'water_%'"
      );
      
      // 获取每个表的详细信息
      const datasets = [];
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const tableName = Object.values(table)[0];
        
        // 获取表的行数
        try {
         const escapedTableName = `\`${tableName}\``;
          const [countResult] = await promisePool.execute(
            `SELECT COUNT(*) as count FROM ${escapedTableName}`
          );
          const rowCount = countResult[0].count;
          
          datasets.push({
            id: i + 1,
            table_name: tableName,
            description: `水质数据表 ${tableName}`,
            created_at: new Date().toISOString(),
            row_count: rowCount
          });
        } catch (countError) {
          console.warn(`无法获取表 ${tableName} 的行数:`, countError.message);
          datasets.push({
            id: i + 1,
            table_name: tableName,
            description: `水质数据表 ${tableName}`,
            created_at: new Date().toISOString(),
            row_count: 0
          });
        }
      }
      
      return datasets;
    } catch (error) {
      console.error('获取数据集列表失败:', error);
      throw error;
    }
  }

  // 根据表名获取数据
  static async getDataByTable(table_name, limit = 10, offset = 0) {
    try {
      // 验证表名（防止SQL注入）
      if (!table_name || typeof table_name !== 'string') {
        throw new Error('无效的表名');
      }
      
      
    // 更宽松但仍然安全的表名校验（允许字母、数字、下划线和连字符，且不超过64字符）
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(table_name)) {
      throw new Error('表名格式不正确');
    }
    
      
      // 检查表是否存在
      const [tableExists] = await promisePool.execute(
        'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        [table_name]
      );
      
      if (tableExists.length === 0) {
        throw new Error(`表 ${table_name} 不存在`);
      }
      
      // 确保 limit 和 offset 是有效的数字
      const validLimit = Math.max(1, Math.min(1000, parseInt(limit) || 10));
      const validOffset = Math.max(0, parseInt(offset) || 0);
      
      // 调试信息
      console.log('Debug - table_name:', table_name);
      console.log('Debug - limit:', limit, 'type:', typeof limit);
      console.log('Debug - offset:', offset, 'type:', typeof offset);
      console.log('Debug - validLimit:', validLimit, 'type:', typeof validLimit);
      console.log('Debug - validOffset:', validOffset, 'type:', typeof validOffset);
      
      // 查询数据 - 使用字符串插值而不是参数化查询来避免参数问题
      const query = `SELECT * FROM \`${table_name}\` LIMIT ${validLimit} OFFSET ${validOffset}`;
      
      // 不使用参数化查询，直接执行
      const [rows] = await promisePool.execute(query);
      
      return {
        table_name,
        rows,
        limit: validLimit,
        offset: validOffset,
        total: rows.length
      };
    } catch (error) {
      console.error('获取表数据失败:', error);
      throw error;
    }
  }
}

module.exports = WaterQuality;