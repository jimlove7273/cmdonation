'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DonationsView } from '@/components/donations-view';
import { FriendsView } from '@/components/friends-view';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'donations' | 'friends'>(
    'donations',
  );
  const { isAuthenticated, login, logout, isLoading } = useAuth();

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
    <DashboardLayout
      onLogout={logout}
      currentView={currentView}
      onViewChange={setCurrentView}
      donationsView={<DonationsView />}
      friendsView={<FriendsView />}
    />
  );
}
