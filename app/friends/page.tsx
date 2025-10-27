'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { FriendsView } from '@/components/friends-view';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function FriendsPage() {
  const { isAuthenticated, login, logout, isLoading, username } = useAuth();

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

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Clay Music Donations
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Hello,{' '}
              {username
                ? username.charAt(0).toUpperCase() + username.slice(1)
                : 'Admin'}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <SidebarNavigation />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <FriendsView />
        </main>
      </div>
    </div>
  );
}
