import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Link,
  Divider
} from '@mui/material';
import {
  FiX as CloseIcon,
} from 'react-icons/fi';

interface SigninModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (email: string, password: string) => void;
}

export default function SigninModal({ open, handleClose, handleSubmit }: SigninModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(email, password);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="signin-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography 
          id="signin-modal-title" 
          variant="h5" 
          component="h2" 
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Welcome Back
        </Typography>

        {/* Login Form */}
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            sx={{ mb: 1 }}
          />

          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link href="#" underline="hover" sx={{ fontSize: '0.875rem' }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mb: 2 }}
          >
            Login
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="#" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}