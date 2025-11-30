// src/components/header/UserAvatar.tsx
import React from 'react';
import { HoverIconButton, UserAvatar as StyledAvatar } from './styled';

interface UserAvatarProps {
  name: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isMenuOpen: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getHexFromInitials = (name: string): string => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to hex color
  let color = "#";

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, onClick, isMenuOpen }) => (
  <HoverIconButton
    onClick={onClick}
    sx={{ p: 0 }}
    aria-controls={isMenuOpen ? 'user-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={isMenuOpen ? 'true' : undefined}
  >
    <StyledAvatar sx={{ bgcolor: getHexFromInitials(name) }}>
      {getInitials(name)}
    </StyledAvatar>
  </HoverIconButton>
);