'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { ComponentType } from 'react';

/**
 * Higher-Order Component that wraps a page component with authentication logic.
 * Handles login, loading states, and redirects to login page if not authenticated.
 * 
 * @param WrappedComponent - The component to wrap with authentication
 * @returns A new component with authentication logic
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   return <div>Protected content</div>;
 * }
 * 
 * export default withAuth(MyPage);
 * ```
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, login, isLoading } = useAuth();

    const handleLogin = (username: string, password: string) => {
      const success = login(username, password);
      if (!success) {
        alert('Invalid credentials');
      }
    };

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      );
    }

    // Show login page if not authenticated
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };
}

