import React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';

interface AuthorProps {
  userName: string;
  showAvatar?: boolean;
  showName?: boolean;
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

export const StyledUserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 36,
  height: 36,
  fontSize: '0.875rem',
  fontWeight: 600,
}));

export const Author: React.FC<AuthorProps> = ({
  userName,
  showAvatar = true,
  showName = false
}) => {
  return (
    <>
      {showAvatar && (
        <StyledUserAvatar sx={{ bgcolor: getHexFromInitials(userName) }}>
          {getInitials(userName)}
        </StyledUserAvatar>
      )}
      {showName && (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {userName || 'Unknown Author'}
          </Typography>
        </Box>
      )}
    </>
  )
}