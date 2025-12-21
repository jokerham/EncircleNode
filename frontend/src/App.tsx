import React, { Suspense, lazy, useMemo} from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider } from './contexts/authContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import PageNotFound from './components/PageNotFound';
import DefaultContent from './components/DefaultContent';
import DefaultLayout from './layouts/default';
import AdminLayout from './layouts/admin';

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
  const { module = "home", action, identifier } = useParams<{
    module: string;
    action?: string;
    identifier?: string;
  }>();

  const location = useLocation();

  const LazyComponent = useMemo(
    () =>
      lazy(async (): Promise<{ default: React.ComponentType<unknown> }> => {
        const NotFound: React.ComponentType<unknown> = () => <PageNotFound />;

        try {
          const componentPath = action
            ? isAdmin
              ? `./modules/${module}/admin/${action}`
              : `./modules/${module}/${action}`
            : isAdmin
              ? `./modules/${module}/admin/index`
              : `./modules/${module}/index`;

          // Try to load the main component path
          try {
            const imported = await import(/* @vite-ignore */ componentPath);
            
            const Loaded = imported?.default;
            if (!Loaded) return { default: NotFound };

            const Wrapped: React.ComponentType<unknown> = () => (
              <Loaded
                module={module}
                action={action ?? null}
                identifier={identifier ?? null}
                isAdmin={isAdmin}
              />
            );

            return { default: Wrapped };
          } catch (firstError) {
            // If action exists, try action folder's index.tsx
            if (action) {
              const actionIndexPath = isAdmin
                ? `./modules/${module}/admin/${action}/index`
                : `./modules/${module}/${action}/index`;

              try {
                const imported = await import(/* @vite-ignore */ actionIndexPath);
                
                const Loaded = imported?.default;
                if (!Loaded) return { default: NotFound };

                const Wrapped: React.ComponentType<unknown> = () => (
                  <Loaded
                    module={module}
                    action={action ?? null}
                    identifier={identifier ?? null}
                    isAdmin={isAdmin}
                  />
                );

                return { default: Wrapped };
              } catch {
                // Final fallback to module index
                const moduleIndexPath = isAdmin
                  ? `./modules/${module}/admin/index`
                  : `./modules/${module}/index`;

                try {
                  const imported = await import(/* @vite-ignore */ moduleIndexPath);
                  
                  const Loaded = imported?.default;
                  if (!Loaded) return { default: NotFound };

                  const Wrapped: React.ComponentType<unknown> = () => (
                    <Loaded
                      module={module}
                      action={action ?? null}
                      identifier={identifier ?? null}
                      isAdmin={isAdmin}
                    />
                  );

                  return { default: Wrapped };
                } catch (moduleIndexError) {
                  console.error("Error loading all fallbacks:", moduleIndexError);
                  return { default: NotFound };
                }
              }
            } else {
              console.error("Error loading component:", firstError);
              return { default: NotFound };
            }
          }
        } catch (e) {
          console.error("Error loading route:", e);
          return { default: NotFound };
        }
      }),
    [isAdmin, module, action, identifier]
  );

  return (
    // force remount on every route change
    <Suspense key={location.pathname} fallback={<LoadingFallback />}>
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