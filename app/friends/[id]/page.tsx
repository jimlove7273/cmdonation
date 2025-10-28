'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { FriendForm } from '@/components/friend-form';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FriendType } from '@/types/DataTypes';

export default function EditFriendPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [friend, setFriend] = useState<FriendType | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  // Fetch friend data when component mounts
  useEffect(() => {
    if (isAuthenticated && id) {
      const fetchFriend = async () => {
        try {
          const response = await fetch(`/api/friends/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch friend');
          }
          const friendData: FriendType = await response.json();
          setFriend(friendData);
        } catch (error) {
          console.error('Error fetching friend:', error);
          alert('Failed to load friend data');
          router.push('/friends');
        } finally {
          setLoading(false);
        }
      };

      fetchFriend();
    }
  }, [isAuthenticated, id, router]);

  const handleUpdateFriend = async (data: Omit<FriendType, 'id'>) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/friends/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update friend');
      }

      const updatedFriend: FriendType = await response.json();
      // Redirect to friends list after successful update
      router.push('/friends');
    } catch (error) {
      console.error('Error updating friend:', error);
      alert('Failed to update friend');
    }
  };

  // Show loading state while checking authentication
  if (isLoading || loading) {
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
              <h2 className="text-2xl font-bold text-gray-900">Edit Friend</h2>
            </div>

            {friend ? (
              <FriendForm
                friend={friend}
                onSubmit={handleUpdateFriend}
                onCancel={() => router.push('/friends')}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Friend not found</p>
                <button
                  onClick={() => router.push('/friends')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Back to Friends List
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
