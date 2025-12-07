// src/api/menuApi.ts
import { api } from './httpClient';

// Menu types based on backend model
export const MenuType = {
  INTERNAL: 'internal',
  EXTERNAL: 'external'
} as const;

export type MenuType = typeof MenuType[keyof typeof MenuType];

export interface MenuResponse {
  _id: string;
  title: string;
  type: MenuType;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
  children?: MenuResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuPayload {
  title: string;
  type?: MenuType;
  url: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  parentId?: string;
}

export type UpdateMenuPayload = Partial<CreateMenuPayload>;

export interface MenuTreeResponse extends MenuResponse {
  children?: MenuTreeResponse[];
}

interface CreateMenuResponse {
  message: string;
  menu: MenuResponse;
}

interface UpdateMenuResponse {
  message: string;
  menu: MenuResponse;
}

interface DeleteMenuResponse {
  message: string;
  menuId: string;
}

interface ChildrenResponse {
  parentMenu: {
    id: string;
    title: string;
  };
  children: MenuResponse[];
}

export const menuApi = {
  // Get all menus
  getAllMenus: () =>
    api.get<MenuResponse[]>('/menus'),

  // Get menu tree structure (hierarchical)
  getMenuTree: (activeOnly: boolean = false) =>
    api.get<MenuTreeResponse[]>(`/menus/tree?activeOnly=${activeOnly}`),

  // Get menu by ID
  getMenuById: (id: string) =>
    api.get<MenuResponse>(`/menus/${id}`),

  // Get children of a specific menu
  getMenuChildren: (id: string) =>
    api.get<ChildrenResponse>(`/menus/${id}/children`),

  // Create new menu
  createMenu: (payload: CreateMenuPayload) =>
    api.post<CreateMenuResponse>('/menus', payload),

  // Update menu
  updateMenu: (id: string, payload: UpdateMenuPayload) =>
    api.put<UpdateMenuResponse>(`/menus/${id}`, payload),

  // Delete menu
  deleteMenu: (id: string) =>
    api.del<DeleteMenuResponse>(`/menus/${id}`),

  // Reorder menu
  reorderMenu: (id: string, newOrder: number) =>
    api.put<UpdateMenuResponse>(`/menus/${id}/reorder`, { newOrder }),

  // Toggle menu active status
  toggleMenuActive: (id: string) =>
    api.patch<UpdateMenuResponse>(`/menus/${id}/toggle-active`)
};