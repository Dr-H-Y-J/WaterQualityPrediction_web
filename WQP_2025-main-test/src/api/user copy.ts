// 更新或创建 src/api/user.ts
import apiClient from './index'

export interface User {
  id?: number
  username: string
  password: string
  email?: string
  role?: string
}

// 用户登录
export const login = (userData: { username: string; password: string }) => {
  return apiClient.post('/api/users/login', userData)
}

// 用户注册
export const register = (userData: User) => {
  return apiClient.post('/api/users/register', userData)
}

// 获取用户信息
export const getUserInfo = () => {
  return apiClient.get('/api/users/info')
}

// 获取所有用户（管理员功能）
export const getAllUsers = () => {
  return apiClient.get('/api/users')
}