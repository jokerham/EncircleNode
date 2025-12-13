import React from 'react';
import {
  Box,
} from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './header';
import Footer from './footer';

// Layout Component
const DefaultLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', justifyContent: 'center'}}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default DefaultLayout;