import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
  Link
} from '@mui/material';
import {
  FiMenu,
  FiSearch,
  FiBell,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/authContext';
import { Author } from '../../components/Author';

// Header Component
const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const userName = auth.user?.name || 'Admin';

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMenuClick} edge="start" sx={{ mr: 2 }}>
          <FiMenu />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, mr: 2, textDecoration: 'none' }}>
          Encircle Admin Portal
        </Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Encircle Portal
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          sx={{
            maxWidth: 400,
            mr: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch style={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
        />
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={4} color="secondary">
            <FiBell />
          </Badge>
        </IconButton>
        <Author userName={userName} showAvatar/>
      </Toolbar>
    </AppBar>
  );
};

export default Header;