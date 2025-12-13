// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import { userApi } from '../api/userApi';
import AccessDenied from '../components/AccessDenied';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      bgcolor: 'grey.50',
    }}
  >
    <CircularProgress size={48} thickness={4} />
    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
      Verifying access...
    </Typography>
  </Box>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireAdmin = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Not authenticated at all
      if (!isAuthenticated || !user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // If admin is required, check the role
      if (requireAdmin) {
        try {
          const response = await userApi.checkRole(user._id, 'Admin');
          setIsAuthorized(response.hasRole);
        } catch (error) {
          console.error('Error checking admin role:', error);
          setIsAuthorized(false);
        }
      } else {
        // Only authentication required, not admin
        setIsAuthorized(true);
      }

      setIsChecking(false);
    };

    checkAuthorization();
  }, [user, isAuthenticated, requireAdmin]);

  // Still checking authorization
  if (isChecking) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to sign in
  if (!isAuthenticated || !user) {
    //return <Navigate to="/signin" replace />;
    return <AccessDenied />;
  }

  // Authenticated but not authorized (lacks required role) - show AccessDenied
  if (!isAuthorized) {
    return <AccessDenied />;
  }

  // Authorized - render child routes
  return <Outlet />;
};

export default ProtectedRoute;