import React from 'react';
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

const drawerWidth = 260;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}

// Sidebar Component
const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const currentPath = window.location.pathname;

  const menuItems: MenuItem[] = [
    { id: 'menu', label: 'Menu Settings', icon: FiList, path: '/admin/menu/list' },
    { id: 'modules', label: 'Module Settings', icon: FiGrid, path: '/admin/module/list' },
    { id: 'members', label: 'Member List', icon: FiUsers, path: '/admin/member/list' },
    { id: 'posts', label: 'Post Management', icon: FiFileText, path: '/admin/post/list' },
    { id: 'files', label: 'File Management', icon: FiFolder, path: '/admin/file/list' },
  ];

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    // Trigger popstate event to update the router
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
                onClick={() => handleNavigation(item.path)}
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
            <ListItemButton onClick={() => handleNavigation('/admin/settings')}>
              <ListItemIcon>
                <FiSettings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/logout')}>
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