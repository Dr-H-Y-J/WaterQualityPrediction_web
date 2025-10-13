// 更新后的 user.ts
import apiClient from './index'

export interface User {
  id?: number
  username: string
  // 注意：password 不应该出现在响应数据中
  email?: string
  role?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: Omit<User, 'password'>
}

// 用户登录
export const login = (userData: LoginRequest): Promise<LoginResponse> => {
  return apiClient.post('/api/users/login', userData)
}

// 用户注册
export const register = (userData: Pick<User, 'username' | 'email'> & { password: string }) => {
  return apiClient.post('/api/users/register', userData)
}

// 获取用户信息
export const getUserInfo = (): Promise<{ user: User }> => {
  return apiClient.get('/api/users/info')
}

// 获取所有用户（管理员功能）
export const getAllUsers = (): Promise<{ users: User[] }> => {
  return apiClient.get('/api/users')
}
