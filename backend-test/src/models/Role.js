// src/models/Role.js
const { promisePool } = require('../config/database');

class Role {
  // 创建角色表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    try {
      await promisePool.execute(sql);
      console.log('Roles table created or already exists');
    } catch (error) {
      console.error('Error creating roles table:', error);
      throw error;
    }
  }

  // 创建用户角色关联表
  static async createUserRoleTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        role_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_role (user_id, role_id)
      )
    `;
    try {
      await promisePool.execute(sql);
      console.log('User roles table created or already exists');
    } catch (error) {
      console.error('Error creating user roles table:', error);
      throw error;
    }
  }

  // 获取所有角色
  static async findAll() {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM roles ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  // 根据ID查找角色
  static async findById(id) {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM roles WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching role by id:', error);
      throw error;
    }
  }

  // 根据名称查找角色
  static async findByName(name) {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM roles WHERE name = ?', [name]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching role by name:', error);
      throw error;
    }
  }

  // 创建角色
  static async create(roleData) {
    const { name, description } = roleData;
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO roles (name, description) VALUES (?, ?)',
        [name, description]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  // 更新角色
  static async update(id, roleData) {
    const { name, description } = roleData;
    try {
      const [result] = await promisePool.execute(
        'UPDATE roles SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  // 删除角色
  static async delete(id) {
    try {
      const [result] = await promisePool.execute('DELETE FROM roles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // 获取角色的用户
  static async getUsersByRoleId(roleId) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT u.id, u.username, u.email, u.role FROM users u INNER JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role_id = ?',
        [roleId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching users by role id:', error);
      throw error;
    }
  }

  // 为角色分配用户
  static async assignUsersToRole(roleId, userIds) {
    try {
      // 先删除该角色的所有用户关联
      await promisePool.execute('DELETE FROM user_roles WHERE role_id = ?', [roleId]);
      
      // 再插入新的用户关联
      if (userIds && userIds.length > 0) {
        const values = userIds.map(userId => [userId, roleId]);
        const placeholders = values.map(() => '(?, ?)').join(', ');
        const flatValues = values.flat();
        
        await promisePool.execute(
          `INSERT INTO user_roles (user_id, role_id) VALUES ${placeholders}`,
          flatValues
        );
      }
      
      console.log(`Users assigned to role ${roleId}`);
    } catch (error) {
      console.error('Error assigning users to role:', error);
      throw error;
    }
  }

  // 获取用户的角色
  static async getRolesByUserId(userId) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT r.* FROM roles r INNER JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching roles by user id:', error);
      throw error;
    }
  }
}

module.exports = Role;