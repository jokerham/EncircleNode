import React from 'react';
import {
  Box,
} from '@mui/material';

import Header from './header';
import DefaultContent from '../../DefaultContent';
import Footer from './footer';

interface LayoutProps {
  children?: React.ReactNode;
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({ children }) => {

  if (!children) {
    children = <DefaultContent />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', justifyContent: 'center'}}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;