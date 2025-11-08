'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { FriendType } from '@/types/DataTypes';
import { useRouter } from 'next/navigation';

type SortColumn =
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'city'
  | null;
type SortDirection = 'asc' | 'desc';

export function FriendsView() {
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const router = useRouter();

  const refreshFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      const data: FriendType[] = await response.json();
      const sortedData = data.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
      });
      setFriends(sortedData);
    } catch (error) {
      console.error('Error refreshing friends:', error);
    }
  };

  // Fetch friends when component mounts
  useEffect(() => {
    refreshFriends();
  }, []);

  const filteredFriends = friends.filter(
    (f) =>
      (f.firstName &&
        f.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.lastName &&
        f.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.phone && f.phone.includes(searchTerm)),
  );

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn];
    let bVal: any = b[sortColumn];

    // Handle null/undefined values
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedFriends.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFriends = sortedFriends.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleDeleteFriend = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/friends/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete friend');
      }

      setFriends(friends.filter((f) => f.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column)
      return <span className="text-gray-400 ml-1">↕</span>;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Friends</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Refresh friends
              refreshFriends();
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Refresh
          </Button>
          <Button
            onClick={() => {
              router.push('/friends/add');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      />

      {/* Table */}
      <Card className="bg-white border-gray-200 overflow-hidden">
        <div className="h-[calc(100vh-429px)] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  ID <SortIndicator column="id" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstName')}
                >
                  First Name <SortIndicator column="firstName" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastName')}
                >
                  Last Name <SortIndicator column="lastName" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  Email <SortIndicator column="email" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('phone')}
                >
                  Phone <SortIndicator column="phone" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('city')}
                >
                  City <SortIndicator column="city" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  DNS
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedFriends.map((friend) => (
                <tr
                  key={friend.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.firstName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.city}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {friend.dns && <Check className="w-5 h-5 text-green-600" />}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          router.push(`/friends/${friend.id}`);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(friend.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, sortedFriends.length)} of{' '}
            {sortedFriends.length} friends
          </span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50"
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const distance = Math.abs(page - currentPage);
                return distance <= 2 || page === 1 || page === totalPages;
              })
              .map((page, idx, arr) => (
                <div key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <Button
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <DeleteConfirmDialog
          onConfirm={handleDeleteFriend}
          onCancel={() => setDeleteId(null)}
          itemType="friend"
        />
      )}
    </div>
  );
}
