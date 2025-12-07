// src/components/header/UserMenu.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
import type { UserMenuAction } from '../../../types/menu.types';

interface UserMenuProps {
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  userName: string;
  userEmail: string;
  userId: string;
  onClose: () => void;
  onMenuAction: (action: UserMenuAction) => void;
}

interface MenuOption {
  action: UserMenuAction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  divider: boolean;
}

const menuOptions: MenuOption[] = [
  { action: 'alerts' as const, label: 'Alerts', icon: AlertsIcon, divider: false },
  { action: 'messages' as const, label: 'Messages', icon: MessagesIcon, divider: false },
  { action: 'posts' as const, label: 'My Posts', icon: PostsIcon, divider: false },
  { action: 'comments' as const, label: 'My Comments', icon: CommentsIcon, divider: false },
];

const adminOption: MenuOption = {
  action: 'configure' as const,
  label: 'Configure Site',
  icon: ConfigureIcon,
  divider: true
};

const signOutOption: MenuOption = {
  action: 'signout' as const,
  label: 'Sign Out',
  icon: SignOutIcon,
  divider: true
};

export const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  isOpen,
  userName,
  userEmail,
  userId,
  onClose,
  onMenuAction
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const finalMenuOptions = useMemo(() => [
    ...menuOptions,
    ...(isAdmin ? [adminOption] : []),
    signOutOption
  ], [isAdmin]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!userId) return;

      try {
        const response = await userApi.checkRole(userId, 'Admin');
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

      {/* {finalMenuOptions.map((option) => (
        <React.Fragment key={option.action}>
          {option.divider && <Divider />}
          <MenuItem onClick={() => onMenuAction(option.action)}>
            <ListItemIcon>
              <option.icon size={18} />
            </ListItemIcon>
            {option.label}
          </MenuItem>
        </React.Fragment>
      ))} */}

      {finalMenuOptions.flatMap((option) => {
        const elements = [];

        if (option.divider) {
          elements.push(
            <Divider key={`${option.action}-divider`} />
          );
        }

        elements.push(
          <MenuItem
            key={option.action}
            onClick={() => onMenuAction(option.action)}
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