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

interface CheckRoleResponse {
  userId: string;
  userName: string;
  roleName: string;
  userCurrentRole: string | null;
  hasRole: boolean;
}

interface CheckPermissionPayload {
  userId: string;
  resource: string;
  action: string;
  resourceOwnerId?: string;
}

interface CheckPermissionResponse {
  userId: string;
  resource: string;
  action: string;
  resourceOwnerId: string | null;
  hasPermission: boolean;
}

export const userApi = {
  signIn: (payload: { email: string; password: string }) =>
    api.post<SignInResponse>('/users/signin', payload),

  signUp: (payload: SignUpPayload) =>
    api.post<SignUpResponse>('/users/signup', payload),

  getUser: (id: string) =>
    api.get(`/users/${id}`),

  getAllUsers: () =>
    api.get(`/users`),

  // New method to get user with full permissions populated
  getUserWithPermissions: (id: string) =>
    api.get(`/users/${id}`),

  checkRole: (payload: { userId: string; roleName: string }) =>
    api.post<CheckRoleResponse>('/users/check-role', payload),

  checkPermission: (payload: CheckPermissionPayload) =>
    api.post<CheckPermissionResponse>('/users/check-permission', payload)
};