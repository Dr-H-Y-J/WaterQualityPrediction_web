// src/models/RolePermission.js
const { promisePool } = require('../config/database');

class RolePermission {
  constructor(role, permission_id) {
    this.role = role;
    this.permission_id = permission_id;
  }

  // 创建角色权限表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS role_permissions (
        role VARCHAR(20),
        permission_id VARCHAR(50),
        PRIMARY KEY (role, permission_id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `;
    try {
      await promisePool.execute(sql);
      console.log('Role permissions table created or already exists');
    } catch (error) {
      console.error('Error creating role permissions table:', error);
      throw error;
    }
  }

  // 根据角色获取权限
  static async findByRole(role) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT permission_id FROM role_permissions WHERE role = ?',
        [role]
      );
      return rows.map(row => row.permission_id);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      throw error;
    }
  }

  // 获取用户权限
  static async findUserPermissions(role) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT p.* FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role = ?',
        [role]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }

  // 为角色分配权限
  static async assignPermissionsToRole(role, permissionIds) {
    try {
      // 先删除该角色的所有权限
      await promisePool.execute(
        'DELETE FROM role_permissions WHERE role = ?',
        [role]
      );
      
      // 再插入新的权限
      for (const permissionId of permissionIds) {
        await promisePool.execute(
          'INSERT IGNORE INTO role_permissions (role, permission_id) VALUES (?, ?)',
          [role, permissionId]
        );
      }
      console.log(`Permissions assigned to role ${role}`);
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      throw error;
    }
  }
}

module.exports = RolePermission;