// src/components/header/Logo.tsx
import React from 'react';
import { LogoImage } from './styled';
import { Typography } from '@mui/material';

export const Logo: React.FC = () => (
  <>
    <LogoImage
      component="img"
      src="/encircle_logo_transparent.png"
      alt="Encircle Logo"
    />
    <Typography
      variant="h5"
      component="h1"
      sx={{
        fontWeight: 700,
        color: 'primary.main',
        mr: 4
      }}
    >
      ENCIRCLE
    </Typography>
  </>
);