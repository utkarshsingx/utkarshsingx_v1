import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlitchLoadingText from '../GlitchLoadingText';
import NotAdminScreen from './NotAdminScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-lightest_slate">
        <GlitchLoadingText className="text-lightest_slate font-mono text-lg" />
      </div>
    );
  }

  if (!isAdmin) {
    if (user) {
      return <NotAdminScreen />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
