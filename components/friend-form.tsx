'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FriendType } from '@/types/DataTypes';

interface FriendFormProps {
  friend?: FriendType | null;
  onSubmit: (data: Omit<FriendType, 'id'>) => void;
  onCancel: () => void;
}

export function FriendForm({ friend, onSubmit, onCancel }: FriendFormProps) {
  const [formData, setFormData] = useState({
    firstName: friend?.firstName || '',
    lastName: friend?.lastName || '',
    chineseName: friend?.chineseName || '',
    address: friend?.address || '',
    city: friend?.city || '',
    state: friend?.state || '',
    zipcode: friend?.zipcode || '',
    dns: friend?.dns || false,
    phone: friend?.phone || '',
    email: friend?.email || '',
    country: friend?.country || '',
    notes: friend?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    /* Updated to light mode styling and converted notes to textarea */
    <Card className="bg-white border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {friend ? 'Edit Friend' : 'Add New Friend'}
      </h3>
      {friend && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <label className="block text-sm font-medium text-gray-700">
            Friend ID
          </label>
          <p className="mt-1 text-sm text-gray-900">{friend.id}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First Name"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chinese Name
            </label>
            <Input
              type="text"
              value={formData.chineseName}
              onChange={(e) =>
                setFormData({ ...formData, chineseName: e.target.value })
              }
              placeholder="Chinese Name"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Address"
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <Input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="State"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <Input
              type="text"
              value={formData.zipcode}
              onChange={(e) =>
                setFormData({ ...formData, zipcode: e.target.value })
              }
              placeholder="Zip"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Phone"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Country"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dns}
                onChange={(e) =>
                  setFormData({ ...formData, dns: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Do Not Send Receipt
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Notes"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
          >
            {friend ? 'Update' : 'Add'} Friend
          </Button>
        </div>
      </form>
    </Card>
  );
}
