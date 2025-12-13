import React, { useState } from 'react';
import {
  Box,
  Toolbar,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#001E62',
      light: '#2D4A8E',
      dark: '#000A2E',
    },
    secondary: {
      main: '#C00008',
      light: '#E63946',
      dark: '#8B0000',
    },
  },
});

const drawerWidth = 260;

// Admin Layout Component
const AdminLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', width: '100vw' }}>
        <Header onMenuClick={() => setDrawerOpen(!drawerOpen)} />
        <Sidebar open={drawerOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: drawerOpen ? 0 : `-${drawerWidth}px`,
          }}
        >
          <Toolbar />
          <Box>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;