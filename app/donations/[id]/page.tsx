'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/login-page';
import { DonationForm } from '@/components/donation-form';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function EditDonationPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [donation, setDonation] = useState<any | null>(null);
  const [allFriends, setAllFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [filteredFriends, setFilteredFriends] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch donation and friends data when component mounts
  useEffect(() => {
    if (isAuthenticated && id) {
      const fetchData = async () => {
        try {
          // Fetch donation data
          const donationResponse = await fetch(`/api/donations/${id}`);
          if (!donationResponse.ok) {
            throw new Error('Failed to fetch donation');
          }
          const donationData = await donationResponse.json();

          // Transform donation data to match form structure
          const transformedDonation = {
            id: donationData.id,
            date: donationData.eDate,
            friendId: donationData.Friend.toString(),
            donationType: donationData.Type,
            checkNumber: donationData.Check,
            amount: donationData.Amount,
            notes: donationData.Notes || '',
          };

          setDonation(transformedDonation);

          // Fetch friends data
          await fetchAllFriends();
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('Failed to load data');
          router.push('/donations');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, id, router, fetchAllFriends]);

  const handleUpdateDonation = async (
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
    if (!id) return;

    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          Friend: parseInt(data.friendId),
          eDate: data.date,
          Type: data.donationType,
          Check: data.checkNumber,
          Amount: data.amount,
          Notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update donation');
      }

      const updatedDonation = await response.json();
      // Redirect to donations list after successful update
      router.push('/donations');
    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Failed to update donation');
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
                  Edit Donation
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
                Edit Donation
              </h2>
            </div>

            {donation ? (
              <DonationForm
                donation={donation}
                friends={filteredFriends}
                onSubmit={handleUpdateDonation}
                onCancel={() => router.push('/donations')}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Donation not found</p>
                <button
                  onClick={() => router.push('/donations')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Back to Donations List
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
