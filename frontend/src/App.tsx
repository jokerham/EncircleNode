import React, { Suspense, lazy, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider } from './contexts/authContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import PageNotFound from './components/PageNotFound';
import DefaultContent from './components/DefaultContent';
import DefaultLayout from './layouts/default';
import AdminLayout from './layouts/admin';

// Type definitions
interface RouteParams {
  module: string;
  action: string | null;
  identifier: string | null;
  isAdmin: boolean;
}

type ModuleComponent = ComponentType<RouteParams>;

// Loading fallback component with MUI
const LoadingFallback: React.FC = () => (
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
      Loading...
    </Typography>
  </Box>
);

// Dynamic module loader component
interface DynamicModuleProps {
  isAdmin?: boolean;
}

const DynamicModule: React.FC<DynamicModuleProps> = ({ isAdmin = false }) => {
  const params = useParams<{ module: string; action?: string; identifier?: string }>();
  const { module = 'home', action = null, identifier = null } = params;

  const LazyComponent = lazy(async () => {
    try {
      let ComponentModule: { default: ModuleComponent } | undefined;

      // Try to load action-specific component first, then fallback to module index
      const componentPath = action
        ? (isAdmin ? `./modules/${module}/admin/${action}` : `./modules/${module}/${action}`)
        : (isAdmin ? `./modules/${module}/admin/index` : `./modules/${module}/index`);

      try {
        ComponentModule = await import(/* @vite-ignore */ componentPath);
      } catch {
        // If action component fails, try module index as fallback
        if (action) {
          try {
            const indexPath = isAdmin ? `./modules/${module}/admin/index` : `./modules/${module}/index`;
            ComponentModule = await import(/* @vite-ignore */ indexPath);
          } catch {
            return { default: () => <PageNotFound /> };
          }
        } else {
          return { default: () => <PageNotFound /> };
        }
      }

      if (!ComponentModule || !ComponentModule.default) {
        return { default: () => <PageNotFound /> };
      }

      // Return component with props already bound
      return {
        default: () => {
          const Component = ComponentModule.default;
          return (
            <Component
              module={module}
              action={action}
              identifier={identifier}
              isAdmin={isAdmin}
            />
          );
        }
      };
    } catch (error) {
      console.error('Error loading route:', error);
      return { default: () => <PageNotFound /> };
    }
  });

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent />
    </Suspense>
  );
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Layout Routes */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<DefaultContent />} />
            <Route path=":module" element={<DynamicModule />} />
            <Route path=":module/:action" element={<DynamicModule />} />
            <Route path=":module/:action/:identifier" element={<DynamicModule />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Admin Layout Routes - Protected */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DefaultContent />} />
              <Route path=":module" element={<DynamicModule isAdmin />} />
              <Route path=":module/:action" element={<DynamicModule isAdmin />} />
              <Route path=":module/:action/:identifier" element={<DynamicModule isAdmin />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;