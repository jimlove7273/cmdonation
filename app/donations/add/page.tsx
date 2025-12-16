'use client';

import { withAuth } from '@/components/withAuth';
import { DonationForm } from '@/components/donation-form';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface Donation {
  id: string;
  date: string;
  friendId: string;
  donationType: 'Bought CD' | 'Love Offering' | 'Other';
  checkNumber: string;
  amount: number;
  notes: string;
}

function AddDonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendIdParam = searchParams.get('friendId');
  const [allFriends, setAllFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [filteredFriends, setFilteredFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [prefilledDonation, setPrefilledDonation] = useState<any>(null);

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
        address: f.address || '',
        city: f.city || '',
        state: f.state || '',
        zipcode: f.zipcode || '',
        email: f.email || '',
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

  // Fetch friends on component mount and set up prefilled donation if friendId is provided
  useEffect(() => {
    fetchAllFriends();
  }, [fetchAllFriends]);

  // Set up prefilled donation when friendId param changes and friends are loaded
  useEffect(() => {
    if (friendIdParam && allFriends.length > 0 && !prefilledDonation) {
      const friend = allFriends.find((f) => f.id === friendIdParam);
      if (friend) {
        setPrefilledDonation({
          date: new Date().toISOString().split('T')[0],
          friendId: friendIdParam,
          donationType: 'Love Offering',
          checkNumber: '',
          amount: 0,
          notes: '',
        });
      }
    }
  }, [friendIdParam, allFriends, prefilledDonation]);

  const handleAddDonation = async (data: Omit<Donation, 'id'>) => {
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
      // Redirect based on where user came from
      if (friendIdParam) {
        router.push(`/friends/${friendIdParam}/donations`);
      } else {
        router.push('/donations');
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Failed to add donation');
    }
  };

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
    <div className="h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      <div className="flex flex-1 overflow-hidden h-full">
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
              donation={prefilledDonation}
              friends={filteredFriends}
              onSubmit={handleAddDonation}
              onCancel={() => {
                if (friendIdParam) {
                  router.push(`/friends/${friendIdParam}/donations`);
                } else {
                  router.push('/donations');
                }
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(AddDonationPage);
