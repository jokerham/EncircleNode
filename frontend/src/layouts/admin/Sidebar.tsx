import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  FiUsers,
  FiFileText,
  FiFolder,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiList
} from 'react-icons/fi';
import {
  PiFiles
} from 'react-icons/pi';

const drawerWidth = 260;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}

// Sidebar Component
const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems: MenuItem[] = [
    { id: 'menu', label: 'Menu Settings', icon: FiList, path: '/admin/menu/list' },
    { id: 'members', label: 'Member List', icon: FiUsers, path: '/admin/member/list' },
    { id: 'posts', label: 'Post Management', icon: FiFileText, path: '/admin/post/list' },
    { id: 'board', label: 'Board Management', icon: PiFiles, path: '/admin/board/list' },
    { id: 'files', label: 'File Management', icon: FiFolder, path: '/admin/file/list' },
    { id: 'modules', label: 'Module Settings', icon: FiGrid, path: '/admin/module/list' },
  ];

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/admin/settings')}>
              <ListItemIcon>
                <FiSettings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/logout')}>
              <ListItemIcon>
                <FiLogOut />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;