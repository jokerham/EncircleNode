// src/components/header/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FiUser as PersonIcon, FiMenu as MenuIcon, FiX as CloseIcon } from 'react-icons/fi';
import { useAuth } from '../../../contexts/authContext';
import { useMenuItems } from '../../../hooks/useMenuItems';
import { useUserMenu } from '../../../hooks/useUserMenu';
import { Logo } from './Logo';
import { DesktopMenu } from './DesktopMenu';
import { SearchButton } from './SearchButton';
import { UserAvatar } from './UserAvatar';
import { UserMenu } from './UserMenu';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import SigninModal from '../signinModal';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Custom hooks
  const { menuItems, isLoading } = useMenuItems();
  const { user, isAuthenticated, signIn } = useAuth();
  const { anchorEl, isOpen, handleOpen, handleClose, handleMenuAction } = useUserMenu();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      console.log('Login Success');
      setIsSignInModalOpen(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('Login Failed:', errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo />
            <DesktopMenu menuItems={menuItems} isLoading={isLoading} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <SearchButton />

              {isAuthenticated && user ? (
                <>
                  <UserAvatar
                    name={user.name}
                    onClick={handleOpen}
                    isMenuOpen={isOpen}
                  />
                  <UserMenu
                    anchorEl={anchorEl}
                    isOpen={isOpen}
                    userName={user.name}
                    userEmail={user.email}
                    userId={user._id}
                    onClose={handleClose}
                    onMenuAction={handleMenuAction}
                  />
                </>
              ) : (
                <IconButton
                  color="default"
                  aria-label="Login"
                  onClick={() => setIsSignInModalOpen(true)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.50',
                      color: 'primary.main'
                    }
                  }}
                >
                  <PersonIcon />
                </IconButton>
              )}

              {isMobile && (
                <IconButton
                  color="default"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.50',
                      color: 'primary.main'
                    }
                  }}
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        menuItems={menuItems}
        isLoading={isLoading}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <SigninModal
        open={isSignInModalOpen}
        handleClose={() => setIsSignInModalOpen(false)}
        handleSubmit={handleSignIn}
      />
    </>
  );
};

export default Header;