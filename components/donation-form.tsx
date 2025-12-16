'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  email?: string;
}

interface Donation {
  id: string;
  date: string;
  friendId: string;
  donationType: 'Bought CD' | 'Love Offering' | 'Other';
  checkNumber: string;
  amount: number;
  notes: string;
}

interface DonationFormProps {
  donation?: Donation | null;
  friends: Friend[];
  onSubmit: (data: Omit<Donation, 'id'>) => void;
  onCancel: () => void;
}

export function DonationForm({
  donation,
  friends,
  onSubmit,
  onCancel,
}: DonationFormProps) {
  const [formData, setFormData] = useState({
    date: donation?.date || new Date().toISOString().split('T')[0],
    friendId: donation?.friendId || '',
    donationType: donation?.donationType || ('Love Offering' as const),
    checkNumber: donation?.checkNumber || '',
    amount: donation?.amount || 0,
    notes: donation?.notes || '',
  });
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [showFriendSearch, setShowFriendSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter friends based on search term
  const filteredFriends = useMemo(() => {
    if (!friendSearchTerm) return friends;
    const term = friendSearchTerm.toLowerCase();
    return friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(term) ||
        friend.lastName.toLowerCase().includes(term) ||
        `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(term),
    );
  }, [friends, friendSearchTerm]);

  // Find the selected friend to display the name properly
  const selectedFriend = friends.find((f) => f.id === formData.friendId);

  // Get the full name of the selected friend
  const payeeName = selectedFriend
    ? `${selectedFriend.firstName} ${selectedFriend.lastName}`
    : '';

  const handleFriendSearch = () => {
    setShowFriendSearch(true);
  };

  const handleFriendSelect = (friendId: string) => {
    setFormData({ ...formData, friendId });
    setShowFriendSearch(false);
    setFriendSearchTerm('');
  };

  const handleClearFriend = () => {
    setFormData({ ...formData, friendId: '' });
  };

  return (
    <Card className="bg-white border-gray-300 p-8 max-w-3xl mx-auto">
      <div className="border-2 border-gray-800 p-6 bg-white">
        {/* Check header with logo/name */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CLAY MUSIC</h2>
            <p className="text-sm text-gray-600">Donation Management</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Check No.</p>
            <Input
              type="text"
              value={formData.checkNumber}
              onChange={(e) =>
                setFormData({ ...formData, checkNumber: e.target.value })
              }
              placeholder="0000"
              className="bg-white border-gray-300 text-gray-900 w-24 text-right"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Date:</span>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="bg-white border-gray-300 text-gray-900 w-40"
            />
          </div>
        </div>

        {/* Donation Received From and Amount in one line */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">
                Donation Received From:
              </span>
            </div>

            {/* Improved friend selection UI */}
            {!showFriendSearch ? (
              <div className="space-y-2 mb-4">
                {selectedFriend ? (
                  <div className="p-3 border border-gray-300 rounded-md bg-gray-50 max-w-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{payeeName}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>ID: {selectedFriend.id}</div>
                          {selectedFriend.address && (
                            <div>{selectedFriend.address}</div>
                          )}
                          {(selectedFriend.city ||
                            selectedFriend.state ||
                            selectedFriend.zipcode) && (
                            <div>
                              {selectedFriend.city}
                              {selectedFriend.city && ', '}
                              {selectedFriend.state} {selectedFriend.zipcode}
                            </div>
                          )}
                          {selectedFriend.email && (
                            <div className="mt-1">{selectedFriend.email}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClearFriend}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search for a friend..."
                        value={friendSearchTerm}
                        onChange={(e) => setFriendSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleFriendSearch();
                          }
                        }}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 pr-10"
                      />
                      <Button
                        type="button"
                        onClick={handleFriendSearch}
                        className="absolute right-0 top-0 h-full bg-blue-200 hover:bg-blue-300 text-gray-900 rounded-l-none px-3"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-gray-300 rounded-md bg-white">
                <div className="p-2 border-b border-gray-200">
                  <Input
                    placeholder="Search friends..."
                    value={friendSearchTerm}
                    onChange={(e) => setFriendSearchTerm(e.target.value)}
                    autoFocus
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleFriendSelect(friend.id)}
                      >
                        <div className="font-medium">
                          {friend.firstName} {friend.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          ID: {friend.id}
                        </div>
                        {friend.email && (
                          <div className="text-sm text-gray-600">
                            {friend.email}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No friends found
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowFriendSearch(false);
                      setFriendSearchTerm('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">$</span>
            </div>
            <Input
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="bg-white border-b border-gray-300 text-gray-900 text-lg w-full rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 py-1 h-auto"
            />
          </div>
        </div>

        {/* Form actions */}
        {donation && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-md">
            <label className="block text-sm font-medium text-gray-700">
              Donation ID
            </label>
            <p className="mt-1 text-sm text-gray-900">{donation.id}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            {donation ? 'Update' : 'Add'} Donation
          </Button>
        </div>
      </div>
    </Card>
  );
}
