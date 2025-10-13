// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 引入路由
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const roleRoutes = require('./routes/roleRoutes');

// 引入模型
const User = require('./models/User');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const RolePermission = require('./models/RolePermission');

// 引入初始化脚本
const initPermissionsAndRoles = require('./scripts/initData');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全头部
// 配置 CORS 允许前端访问
app.use(cors({
  origin: 'http://localhost:5173', // 前端开发服务器地址
  credentials: true
}));
app.use(morgan('combined')); // 日志记录
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 路由
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/roles', roleRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '服务器运行正常' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误处理:', err.stack);
  res.status(500).json({ 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 初始化数据库表和插入初始数据
const initDatabase = async () => {
  try {
    // 创建表
    await User.createTable();
    await Permission.createTable();
    await Role.createTable();
    await Role.createUserRoleTable();
    await RolePermission.createTable();
    
    console.log('数据库表初始化完成');
    
    // 插入初始数据
    await initPermissionsAndRoles();
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
};

// 启动服务器
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
  }
};

startServer();

module.exports = app;