import { authAPI } from './api';

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  subscription_tier: string;
  created_at: string;
}

export const login = async (email: string, password: string): Promise<User> => {
  const response = await authAPI.login(email, password);
  const { access_token, refresh_token } = response.data;

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  // Get user info
  const userResponse = await authAPI.getMe();
  return userResponse.data;
};

export const signup = async (
  email: string,
  password: string,
  fullName?: string
): Promise<User> => {
  const response = await authAPI.signup(email, password, fullName);
  const { access_token, refresh_token } = response.data;

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  // Get user info
  const userResponse = await authAPI.getMe();
  return userResponse.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const getUser = async (): Promise<User | null> => {
  try {
    const response = await authAPI.getMe();
    return response.data;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};
