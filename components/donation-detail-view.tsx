'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import { DonationType } from '@/types/DataTypes';

interface DonationDetailViewProps {
  donation: DonationType;
  friends: { id: string; firstName: string; lastName: string }[];
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function DonationDetailView({
  donation,
  friends,
  onEdit,
  onDelete,
  onBack,
}: DonationDetailViewProps) {
  const getFriendName = (friendId: number) => {
    if (!friendId) return 'Unknown Friend';
    const friend = friends.find((f) => f.id === friendId.toString());
    return friend
      ? `${friend.firstName || ''} ${friend.lastName || ''}`.trim() ||
          `Friend ID: ${friendId}`
      : `Friend ID: ${friendId}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Donation Details</h2>
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
          >
            Back
          </Button>
          <Button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="bg-white border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Donation Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <p className="mt-1 text-sm text-gray-900">{donation.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="mt-1 text-sm text-gray-900">{donation.eDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-sm text-gray-900">{donation.Type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check Number
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {donation.Check || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  ${donation.Amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Friend Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Friend ID
                </label>
                <p className="mt-1 text-sm text-gray-900">{donation.Friend}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Friend Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {getFriendName(donation.Friend)}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
              Additional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {donation.Notes || 'No notes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
