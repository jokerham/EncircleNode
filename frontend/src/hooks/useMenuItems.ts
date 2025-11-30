// src/hooks/useMenuItems.ts
import { useState, useEffect } from 'react';
import type { MenuItem } from '../types/menu.types';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      // Simulating API call - replace with actual API
      setTimeout(() => {
        const apiMenuItems: MenuItem[] = [
          { id: 1, name: 'Home', path: '/' },
          { id: 2, name: 'Notice', path: '/notice' },
          { id: 3, name: 'Projects', path: '/projects' },
          { id: 4, name: 'Resources', path: '/resources' },
          { id: 5, name: 'About', path: '/about' }
        ];
        setMenuItems(apiMenuItems);
        setIsLoading(false);
      }, 500);
    };

    fetchMenuItems();
  }, []);

  return { menuItems, isLoading };
};