// src/components/header/styled.ts
import { styled } from '@mui/material/styles';
import { IconButton, Button, Avatar, Box } from '@mui/material';

// Reusable hover effect for icon buttons
export const HoverIconButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary || 'rgba(25, 118, 210, 0.04)',
    color: theme.palette.primary.main,
  }
}));

// Navigation button with consistent styling
export const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary || 'rgba(25, 118, 210, 0.04)',
    color: theme.palette.primary.main,
  }
}));

// User avatar with consistent sizing
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 36,
  height: 36,
  fontSize: '0.875rem',
  fontWeight: 600,
}));

// Logo container
export const LogoImage = styled(Box)({
  height: 40,
  marginRight: 16,
}) as typeof Box;

// Loading skeleton styles
export const LoadingSkeleton = styled(Box)({
  width: 64,
  height: 16,
  backgroundColor: '#e0e0e0',
  borderRadius: 4,
});