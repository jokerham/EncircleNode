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

// Sidebar Component
const Sidebar: React.FC<{
  open: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ open, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'menu', label: 'Menu Settings', icon: FiList },
    { id: 'modules', label: 'Module Settings', icon: FiGrid },
    { id: 'members', label: 'Member List', icon: FiUsers },
    { id: 'posts', label: 'Post Management', icon: FiFileText },
    { id: 'files', label: 'File Management', icon: FiFolder },
  ];

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
                selected={activeTab === item.id}
                onClick={() => onTabChange(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: activeTab === item.id ? 'white' : 'inherit' }}>
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
            <ListItemButton>
              <ListItemIcon>
                <FiSettings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
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