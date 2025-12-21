// src/components/header/UserMenu.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Box, Typography, Divider, ListItemIcon } from '@mui/material';
import {
  FiBell as AlertsIcon,
  FiMail as MessagesIcon,
  FiFileText as PostsIcon,
  FiMessageSquare as CommentsIcon,
  FiSettings as ConfigureIcon,
  FiLogOut as SignOutIcon,
} from 'react-icons/fi';
import { userApi } from '../../../api/userApi';
import { useAuth } from '../../../contexts/authContext';

interface UserMenuProps {
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  userName: string;
  userEmail: string;
  userId: string;
  onClose: () => void;
}

interface MenuOption {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  divider: boolean;
  onClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  isOpen,
  userName,
  userEmail,
  userId,
  onClose
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!userId) return;

      try {
        const response = await userApi.checkRole(userId, { roleName: 'Admin' });
        setIsAdmin(response.hasRole);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
    };

    if (isOpen) {
      checkAdminRole();
    }
  }, [userId, isOpen]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const menuOptions: MenuOption[] = useMemo(() => [
    { 
      label: 'Alerts', 
      icon: AlertsIcon, 
      divider: false,
      onClick: () => console.log('Alerts clicked')
    },
    { 
      label: 'Messages', 
      icon: MessagesIcon, 
      divider: false,
      onClick: () => console.log('Messages clicked')
    },
    { 
      label: 'My Posts', 
      icon: PostsIcon, 
      divider: false,
      onClick: () => console.log('My Posts clicked')
    },
    { 
      label: 'My Comments', 
      icon: CommentsIcon, 
      divider: false,
      onClick: () => console.log('My Comments clicked')
    },
    ...(isAdmin ? [{
      label: 'Configure Site',
      icon: ConfigureIcon,
      divider: true,
      onClick: () => navigate('/admin')
    }] : []),
    {
      label: 'Sign Out',
      icon: SignOutIcon,
      divider: true,
      onClick: handleSignOut
    }
  ], [isAdmin, navigate, handleSignOut]);

  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      onClick={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {userName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {userEmail}
        </Typography>
      </Box>
      
      {menuOptions.flatMap((option, index) => {
        const elements = [];

        if (option.divider) {
          elements.push(
            <Divider key={`divider-${index}`} />
          );
        }

        elements.push(
          <MenuItem
            key={`menu-${index}`}
            onClick={option.onClick}
          >
            <ListItemIcon>
              <option.icon size={18} />
            </ListItemIcon>
            {option.label}
          </MenuItem>
        );

        return elements;
      })}
    </Menu>
  );
};