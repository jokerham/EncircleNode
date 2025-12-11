import React, { useState } from 'react';
import {
  Box,
  Toolbar,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//import Header from './Header';
import Header from './Header';
import Sidebar from './Sidebar';
import MenuSettings from '../../module/menu/admin/list';
import ModuleSettings from '../../module/module/admin/list';
import MemberList from '../../module/member/admin/list';
import PostManagement from '../../module/post/admin/list';
import FileManagement from '../../module/file/admin/list';

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

// Main App Component
const AdminDashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuSettings />;
      case 'modules':
        return <ModuleSettings />;
      case 'members':
        return <MemberList />;
      case 'posts':
        return <PostManagement />;
      case 'files':
        return <FileManagement />;
      default:
        return <MenuSettings />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', width: '100vw' }}>
        <Header onMenuClick={() => setDrawerOpen(!drawerOpen)} />
        <Sidebar open={drawerOpen} activeTab={activeTab} onTabChange={setActiveTab} />
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
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;