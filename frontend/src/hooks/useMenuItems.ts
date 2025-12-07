// src/hooks/useMenuItems.ts
import { useState, useEffect, useCallback } from 'react';
import { menuApi, type MenuTreeResponse } from '../api/menuApi';
import type { MenuItem } from '../types/menu.types';

// Helper function to convert backend menu structure to frontend MenuItem
const convertToMenuItem = (menu: MenuTreeResponse): MenuItem => {
  const menuItem: MenuItem = {
    id: menu._id,
    name: menu.title,
    path: menu.url,
    icon: menu.icon,
    children: menu.children?.map(child => convertToMenuItem(child))
  };

  // Only include children if they exist
  if (!menuItem.children || menuItem.children.length === 0) {
    delete menuItem.children;
  }

  return menuItem;
};

interface UseMenuItemsOptions {
  activeOnly?: boolean;
}

export const useMenuItems = (options: UseMenuItemsOptions = {}) => {
  const { activeOnly = true } = options;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await menuApi.getMenuTree(activeOnly);
      
      // Convert backend menu structure to frontend MenuItem structure
      const convertedMenuItems = response.map(menu => convertToMenuItem(menu));
      
      setMenuItems(convertedMenuItems);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to fetch menu items');
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return { 
    menuItems, 
    isLoading, 
    error,
    refetch: fetchMenuItems 
  };
};