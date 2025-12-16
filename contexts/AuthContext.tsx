'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and manages authentication state.
 * Handles login persistence via localStorage and provides auth context to all children.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 20 * 60 * 1000;

  // Reset the inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (isAuthenticated) {
      inactivityTimer.current = setTimeout(() => {
        logout();
        alert('You have been logged out due to inactivity.');
        // Note: We can't redirect here because this is a context provider
        // Redirecting should be handled in the components that use this context
      }, INACTIVITY_LIMIT);
    }
  };

  // Set up event listeners for user activity
  useEffect(() => {
    if (isAuthenticated) {
      // Reset timer on user activity
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
      ];
      events.forEach((event) => {
        window.addEventListener(event, resetInactivityTimer, true);
      });

      // Start the initial timer
      resetInactivityTimer();
    }

    return () => {
      // Clean up event listeners and timer
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
      ];
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer, true);
      });

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [isAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUsername = localStorage.getItem('username');

    if (storedAuth === 'true' && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  /**
   * Authenticates a user with username and password.
   * Stores auth state in localStorage for persistence across sessions.
   * @returns true if login successful, false otherwise
   */
  const login = (username: string, password: string): boolean => {
    // Simple authentication - hardcoded credentials
    if (username === 'cmdonation' && password === 'N5sRBP6C') {
      setIsAuthenticated(true);
      setUsername(username);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      resetInactivityTimer(); // Start the inactivity timer after login
      return true;
    }
    return false;
  };

  /**
   * Logs out the current user and clears all authentication data.
   * Removes auth state from localStorage.
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');

    // Clear the inactivity timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider component.
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
