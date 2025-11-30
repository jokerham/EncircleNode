// src/hooks/useUserMenu.ts
import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import type { UserMenuAction } from '../types/menu.types';

export const useUserMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { signOut } = useAuth();
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: UserMenuAction) => {
    handleClose();
    
    switch (action) {
      case 'alerts':
        console.log('Navigate to alerts');
        // TODO: Add navigation
        break;
      case 'messages':
        console.log('Navigate to messages');
        // TODO: Add navigation
        break;
      case 'posts':
        console.log('Navigate to my posts');
        // TODO: Add navigation
        break;
      case 'comments':
        console.log('Navigate to my comments');
        // TODO: Add navigation
        break;
      case 'signout':
        signOut();
        break;
    }
  };

  return {
    anchorEl,
    isOpen,
    handleOpen,
    handleClose,
    handleMenuAction
  };
};