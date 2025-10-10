import apiClient from './index';

export const login = (data: any) => {
  return apiClient.post('/user/login', data);
};

export const register = (data: any) => {
  return apiClient.post('/user/register', data);
};