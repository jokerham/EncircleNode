// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { userApi } from '../api/userApi';
import type { AppError } from '../api/httpClient';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  roleId: {
    _id: string;
    name: string;
    description?: string;
  };
  isActive: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, roleId: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export context for use in custom hooks
export { AuthContext };

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  });


  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const response = await userApi.signIn({ email, password });
      
      // Store user in state and localStorage
      const userData = response.user as User;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      const appError = error as AppError;
      console.error('Sign in error:', appError);
      throw new Error(appError.message || 'Sign in failed');
    }
  };

  // Sign Up
  const signUp = async (name: string, email: string, password: string, roleId: string) => {
    try {
      const response = await userApi.signUp({ name, email, password, roleId });
      
      // Store user in state and localStorage
      const userData = response.user as User;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      const appError = error as AppError;
      console.error('Sign up error:', appError);
      throw new Error(appError.message || 'Sign up failed');
    }
  };

  // Sign Out
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update User
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: false,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};