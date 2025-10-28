'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { FriendForm } from '@/components/friend-form';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useRouter } from 'next/navigation';
import { FriendType } from '@/types/DataTypes';

export default function AddFriendPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  const handleAddFriend = async (data: Omit<FriendType, 'id'>) => {
    try {
      debugger;
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add friend');
      }

      const newFriend: FriendType = await response.json();
      // Redirect to friends list after successful creation
      router.push('/friends');
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to add friend');
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Friend
              </h2>
            </div>

            <FriendForm
              onSubmit={handleAddFriend}
              onCancel={() => router.push('/friends')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
