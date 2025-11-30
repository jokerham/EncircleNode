// src/types/menu.types.ts

export interface MenuItem {
  id: number;
  name: string;
  path: string;
}

export type UserMenuAction = 'alerts' | 'messages' | 'posts' | 'comments' | 'signout';

export interface UserMenuOption {
  action: UserMenuAction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  dividerAfter?: boolean;
}