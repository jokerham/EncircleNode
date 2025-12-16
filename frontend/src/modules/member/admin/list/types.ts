// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  roleId: {
    _id: string;
    name: string;
    description?: string;
    permissions?: Permission[];
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  _id: string;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}