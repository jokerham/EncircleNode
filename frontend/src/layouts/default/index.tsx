import React from 'react';
import {
  Box,
  Container,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
//import "react-toastify/dist/ReactToastify.css";
import Header from './header';
import Footer from './footer';

// Layout Component
const DefaultLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', justifyContent: 'center'}}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        aria-label="Notifications"
      />
    </Box>
  );
};

export default DefaultLayout;