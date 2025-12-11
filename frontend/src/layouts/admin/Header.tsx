import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Badge
} from '@mui/material';
import {
  FiMenu,
  FiSearch,
  FiBell,
} from 'react-icons/fi';

// Header Component
const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <IconButton color="inherit" onClick={onMenuClick} edge="start" sx={{ mr: 2 }}>
        <FiMenu />
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, mr: 4 }}>
        Encircle Admin Portal
      </Typography>
      <TextField
        placeholder="Search..."
        variant="outlined"
        size="small"
        sx={{
          flexGrow: 1,
          maxWidth: 400,
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
      <Box sx={{ flexGrow: 1 }} />
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <FiBell />
        </Badge>
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>A</Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2">Admin User</Typography>
          <Typography variant="caption">admin@mizuho.com</Typography>
        </Box>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;