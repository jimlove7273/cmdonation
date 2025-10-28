'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { FriendsView } from '@/components/friends-view';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';

export default function FriendsPage() {
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
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
