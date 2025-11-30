// src/components/header/DesktopMenu.tsx
import React from 'react';
import { NavButton, LoadingSkeleton } from './styled';
import { Box } from '@mui/material';
import type { MenuItem } from '../../../types/menu.types';

interface DesktopMenuProps {
  menuItems: MenuItem[];
  isLoading: boolean;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ menuItems, isLoading }) => (
  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
    {isLoading ? (
      <Box sx={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3].map((i) => ( <LoadingSkeleton key={i} /> ))}
      </Box>
    ) : (
      menuItems.map((item) => (
        <NavButton key={item.id} href={item.path}>
          {item.name}
        </NavButton>
      ))
    )}
  </Box>
);