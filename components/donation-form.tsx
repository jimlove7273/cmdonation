'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
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

// Function to convert number to words (for check amount in words)
function numberToWords(num: number): string {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if (num === 0) return 'Zero';

  function convertHundreds(n: number): string {
    let str = '';
    if (n > 99) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str;
  }

  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);

  let result = '';
  if (dollars > 0) {
    result += convertHundreds(dollars).trim();
  }

  if (cents > 0) {
    if (result) result += ' and ';
    result += cents + '/100';
  }

  return result.trim();
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
            <Select
              value={formData.friendId}
              onValueChange={(value) =>
                setFormData({ ...formData, friendId: value })
              }
            >
              <SelectTrigger className="bg-white border-b border-gray-300 text-gray-900 text-lg w-full rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 py-1 h-auto">
                <SelectValue placeholder="Select a friend">
                  {payeeName || 'Select a friend'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 max-h-60">
                <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
                  <Input
                    placeholder="Search friends..."
                    value={friendSearchTerm}
                    onChange={(e) => setFriendSearchTerm(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {filteredFriends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.firstName} {friend.lastName}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
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

        {/* Amount in words on its own line */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-600">Amount in words:</span>
          </div>
          <div className="border-b border-gray-300 py-1 min-h-[40px]">
            <p className="text-gray-900">
              {numberToWords(formData.amount)} *****
            </p>
          </div>
        </div>

        {/* Memo */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-600 mr-2">For:</span>
          </div>
          <Select
            value={formData.donationType}
            onValueChange={(value: any) =>
              setFormData({ ...formData, donationType: value })
            }
          >
            <SelectTrigger className="bg-white border-b border-gray-300 text-gray-900 rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 py-1 h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="Bought CD">Bought CD</SelectItem>
              <SelectItem value="Love Offering">Love Offering</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Enter additional notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

        <div className="flex gap-2 justify-end">
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
