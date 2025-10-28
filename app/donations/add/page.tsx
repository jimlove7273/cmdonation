'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { DonationForm } from '@/components/donation-form';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';

export default function AddDonationPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const [allFriends, setAllFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [filteredFriends, setFilteredFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  // Fetch all friends
  const fetchAllFriends = useCallback(async () => {
    try {
      const response = await fetch('/api/friends');
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      const friendsData = await response.json();
      const mappedFriends = friendsData.map((f: any) => ({
        id: f.id.toString(), // Ensure ID is a string
        firstName: f.firstName || '',
        lastName: f.lastName || '',
      }));

      setAllFriends(mappedFriends);
      setFilteredFriends(mappedFriends); // Initially show all friends
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  // Filter friends based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFriends(allFriends);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = allFriends.filter(
        (friend) =>
          friend.firstName.toLowerCase().includes(term) ||
          friend.lastName.toLowerCase().includes(term) ||
          `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(term),
      );
      setFilteredFriends(filtered);
    }
  }, [searchTerm, allFriends]);

  // Fetch friends on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllFriends();
    }
  }, [isAuthenticated, fetchAllFriends]);

  const handleAddDonation = async (
    data: Omit<
      {
        id: string;
        date: string;
        friendId: string;
        donationType: 'Bought CD' | 'Love Offering' | 'Other';
        checkNumber: string;
        amount: number;
        notes: string;
      },
      'id'
    >,
  ) => {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: data.date,
          friendId: data.friendId,
          donationType: data.donationType,
          checkNumber: data.checkNumber,
          amount: data.amount,
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add donation');
      }

      const newDonation = await response.json();
      // Redirect to donations list after successful creation
      router.push('/donations');
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Failed to add donation');
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

  // Show loading indicator for friends
  if (loadingFriends) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNavigation />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Donation
                </h2>
              </div>
              <div className="bg-white border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600">Loading friends data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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
                Add New Donation
              </h2>
            </div>

            <DonationForm
              friends={filteredFriends}
              onSubmit={handleAddDonation}
              onCancel={() => router.push('/donations')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
