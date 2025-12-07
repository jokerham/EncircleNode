// src/types/menu.types.ts

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export type UserMenuAction = 'alerts' | 'messages' | 'posts' | 'comments' | 'configure' | 'signout';

export interface UserMenuOption {
  action: UserMenuAction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  dividerAfter?: boolean;
}