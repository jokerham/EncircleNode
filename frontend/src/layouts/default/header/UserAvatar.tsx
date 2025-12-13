// src/components/header/UserAvatar.tsx
import React from 'react';
import { HoverIconButton } from './styled';
import { Author } from '../../../components/Author';

interface UserAvatarProps {
  name: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isMenuOpen: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, onClick, isMenuOpen }) => (
  <HoverIconButton
    onClick={onClick}
    sx={{ p: 0 }}
    aria-controls={isMenuOpen ? 'user-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={isMenuOpen ? 'true' : undefined}
  >
    <Author userName={name} showAvatar />
  </HoverIconButton>
);