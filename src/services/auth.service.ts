import { request } from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return request<User>('/auth/me', {
      method: 'GET',
    });
  },
};
