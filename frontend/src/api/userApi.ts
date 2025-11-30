// src/api/userApi.ts
import { api } from './httpClient';

// Response structures based on your backend routes
interface SignInResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    roleId?: unknown;
  };
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

interface SignUpResponse {
  message: string;
  user: unknown;
}

export const userApi = {
  signIn: (payload: { email: string; password: string }) =>
    api.post<SignInResponse>('/users/signin', payload),

  signUp: (payload: SignUpPayload) =>
    api.post<SignUpResponse>('/users/signup', payload),

  getUser: (id: string) =>
    api.get(`/users/${id}`),

  getAllUsers: () =>
    api.get(`/users`)
};