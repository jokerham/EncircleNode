// src/components/header/MobileMenuDrawer.tsx
import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress
} from '@mui/material';
import type { MenuItem } from '../../../types/menu.types'

interface MobileMenuDrawerProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  isLoading: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  menuItems,
  isLoading,
  onClose
}) => (
  <Drawer anchor="right" open={isOpen} onClose={onClose}>
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {isLoading ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                component="a"
                href={item.path}
                onClick={onClose}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  </Drawer>
);