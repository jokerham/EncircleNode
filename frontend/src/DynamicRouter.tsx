import React, { useState, useEffect, type ComponentType } from 'react';
import PageNotFound from './PageNotFound';
import DefaultLayout from './layouts/default';
import AdminLayout from './layouts/admin';
import DefaultContent from './DefaultContent';

// Type definitions
interface RouteParams {
  module: string;
  action: string | null;
  identifier: string | null;
  isAdmin: boolean;
}

type ModuleComponent = ComponentType<RouteParams>;

interface RouteState {
  module: string | null;
  action: string | null;
  identifier: string | null;
  isAdmin: boolean;
  Component: ModuleComponent | null;
  loading: boolean;
  error: 'not_found' | null;
  isDefaultContent: boolean;
}

// Router component that parses URL and loads modules dynamically
const DynamicRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteState>({
    module: null,
    action: null,
    identifier: null,
    isAdmin: false,
    Component: null,
    loading: true,
    error: null,
    isDefaultContent: false
  });

  useEffect(() => {
    const loadRoute = async (): Promise<void> => {
      // Parse the URL pathname (using path-based routing for client-side routing)
      const pathname = window.location.pathname || '/';
      const parts = pathname.split('/').filter(Boolean);
      
      // Check if this is the root path (no module, no action)
      if (parts.length === 0) {
        setCurrentRoute({
          module: null,
          action: null,
          identifier: null,
          isAdmin: false,
          Component: DefaultContent as ModuleComponent,
          loading: false,
          error: null,
          isDefaultContent: true
        });
        return;
      }

      let module: string = 'home';
      let action: string | null = null;
      let identifier: string | null = null;
      let isAdmin = false;

      // Check if this is an admin route: /admin/{module}/{action}/{identifier}
      if (parts[0] === 'admin') {
        module = parts[1] || 'home';
        action = parts[2] || null;
        identifier = parts[3] || null;
        isAdmin = true;
      } else {
        // Regular route: /{module}/{action}/{identifier}
        module = parts[0] || 'home';
        action = parts[1] || null;
        identifier = parts[2] || null;
        isAdmin = false;
      }

      setCurrentRoute(prev => ({ ...prev, loading: true, error: null, isDefaultContent: false }));

      try {
        let ComponentModule: { default: ModuleComponent } | undefined;
        
        // Try to load action-specific component
        if (action) {
          try {
            if (isAdmin) {
              // Try to load from /src/{module}/admin/{action}
              ComponentModule = await import(`./modules/${module}/admin/${action}`);
            } else {
              // Try to load from /src/{module}/{action}
              ComponentModule = await import(`./modules/${module}/${action}`);
            }
          } catch (actionError) {
            // If action component doesn't exist, fall through to module index
            console.log(`Action component not found: ${module}${isAdmin ? '/admin' : ''}/${action}`);
          }
        }
        
        // If no action component, load module index
        if (!ComponentModule) {
          try {
            if (isAdmin) {
              // Try to load from /src/{module}/admin/index
              ComponentModule = await import(`./modules/${module}/admin/index`);
            } else {
              // Try to load from /src/{module}/index
              ComponentModule = await import(`./modules/${module}/index`);
            }
          } catch (moduleError) {
            // Module doesn't exist - show 404
            setCurrentRoute({
              module,
              action,
              identifier,
              isAdmin,
              Component: null,
              loading: false,
              error: 'not_found',
              isDefaultContent: false
            });
            return;
          }
        }

        if (!ComponentModule) {
          setCurrentRoute({
            module,
            action,
            identifier,
            isAdmin,
            Component: null,
            loading: false,
            error: 'not_found',
            isDefaultContent: false
          });
          return;
        }

        const Component = ComponentModule.default;
        setCurrentRoute({
          module,
          action,
          identifier,
          isAdmin,
          Component,
          loading: false,
          error: null,
          isDefaultContent: false
        });

      } catch (error) {
        console.error('Error loading route:', error);
        setCurrentRoute({
          module,
          action,
          identifier,
          isAdmin,
          Component: null,
          loading: false,
          error: 'not_found',
          isDefaultContent: false
        });
      }
    };

    loadRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', loadRoute);
    return () => window.removeEventListener('hashchange', loadRoute);
  }, []);

  if (currentRoute.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const { Component, module, action, identifier, isAdmin, isDefaultContent, error } = currentRoute;
  const Layout = isAdmin ? AdminLayout : DefaultLayout;

  // If it's default content, render without RouteParams
  if (isDefaultContent) {
    return (
      <Layout>
        <DefaultContent />
      </Layout>
    );
  }
  // If error or no component found, show 404
  if (error === 'not_found' || !Component) {
    return (
      <Layout>
        <PageNotFound />
      </Layout>
    );
  }

  // Wrap component in appropriate layout
  return (
    <Layout>
      <Component 
        module={module!} 
        action={action} 
        identifier={identifier}
        isAdmin={isAdmin}
      />
    </Layout>
  );
};

export default DynamicRouter;