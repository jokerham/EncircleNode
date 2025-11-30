// src/components/header/UserMenu.tsx
import React from 'react';
import { Menu, MenuItem, Box, Typography, Divider, ListItemIcon } from '@mui/material';
import {
  FiBell as AlertsIcon,
  FiMail as MessagesIcon,
  FiFileText as PostsIcon,
  FiMessageSquare as CommentsIcon,
  FiLogOut as SignOutIcon,
} from 'react-icons/fi';
import type { UserMenuAction } from '../../../types/menu.types';

interface UserMenuProps {
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onMenuAction: (action: UserMenuAction) => void;
}

const menuOptions = [
  { action: 'alerts' as const, label: 'Alerts', icon: AlertsIcon },
  { action: 'messages' as const, label: 'Messages', icon: MessagesIcon },
  { action: 'posts' as const, label: 'My Posts', icon: PostsIcon },
  { action: 'comments' as const, label: 'My Comments', icon: CommentsIcon },
  { action: 'signout' as const, label: 'Sign Out', icon: SignOutIcon, divider: true },
];

export const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  isOpen,
  userName,
  userEmail,
  onClose,
  onMenuAction
}) => (
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

    {menuOptions.map((option) => (
      <React.Fragment key={option.action}>
        {option.divider && <Divider />}
        <MenuItem onClick={() => onMenuAction(option.action)}>
          <ListItemIcon>
            <option.icon size={18} />
          </ListItemIcon>
          {option.label}
        </MenuItem>
      </React.Fragment>
    ))}
  </Menu>
);