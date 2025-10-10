const { promisePool } = require('../config/database');

class User {
  // 创建用户表
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    try {
      await promisePool.execute(query);
      console.log('Users table created or already exists');
    } catch (error) {
      console.error('Error creating users table:', error);
      throw error;
    }
  }

  // 查找用户通过用户名
  static async findByUsername(username) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // 创建新用户
  static async create(userData) {
    const { username, password, role = 'user' } = userData;
    const [result] = await promisePool.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    return result.insertId;
  }

  // 获取所有用户
  static async findAll() {
    const [rows] = await promisePool.execute('SELECT id, username, role, created_at FROM users');
    return rows;
  }

  // 根据ID查找用户
  static async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT id, username, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 更新用户
  static async update(id, userData) {
    const { username, role } = userData;
    const [result] = await promisePool.execute(
      'UPDATE users SET username = ?, role = ? WHERE id = ?',
      [username, role, id]
    );
    return result.affectedRows > 0;
  }

  // 删除用户
  static async delete(id) {
    const [result] = await promisePool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;