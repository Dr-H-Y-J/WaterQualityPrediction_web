// src/models/Permission.js
const { promisePool } = require('../config/database');

class Permission {
  constructor(id, name, category) {
    this.id = id;
    this.name = name;
    this.category = category;
  }

  // 创建权限表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS permissions (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL
      )
    `;
    try {
      await promisePool.execute(sql);
      console.log('Permissions table created or already exists');
    } catch (error) {
      console.error('Error creating permissions table:', error);
      throw error;
    }
  }

  // 获取所有权限
  static async findAll() {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM permissions');
      return rows;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  // 插入初始权限数据
  static async insertInitialPermissions(permissions) {
    try {
      for (const permission of permissions) {
        await promisePool.execute(
          'INSERT IGNORE INTO permissions (id, name, category) VALUES (?, ?, ?)',
          [permission.id, permission.name, permission.category]
        );
      }
      console.log('Initial permissions inserted');
    } catch (error) {
      console.error('Error inserting initial permissions:', error);
      throw error;
    }
  }
}

module.exports = Permission;