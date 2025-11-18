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
  ArrowLeft,
} from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { DonationType, FriendType } from '@/types/DataTypes';
import { useRouter } from 'next/navigation';

type SortColumn =
  | 'id'
  | 'created_at'
  | 'eDate'
  | 'Type'
  | 'Check'
  | 'Amount'
  | 'Notes'
  | null;
type SortDirection = 'asc' | 'desc';

interface FriendDonationsViewProps {
  friendId: string;
}

export function FriendDonationsView({ friendId }: FriendDonationsViewProps) {
  const [donations, setDonations] = useState<DonationType[]>([]);
  const [friend, setFriend] = useState<FriendType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortColumn, setSortColumn] = useState<SortColumn>('eDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFriendAndDonations = async () => {
    setLoading(true);
    try {
      // Fetch friend details
      const friendResponse = await fetch(`/api/friends/${friendId}`);
      if (friendResponse.ok) {
        const friendData: FriendType = await friendResponse.json();
        setFriend(friendData);
      }

      // Fetch donations for this friend
      const donationsResponse = await fetch(`/api/friends/${friendId}/donations`);
      if (donationsResponse.ok) {
        const donationsData: DonationType[] = await donationsResponse.json();
        setDonations(donationsData);
      }
    } catch (error) {
      console.error('Error fetching friend donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendAndDonations();
  }, [friendId]);

  const filteredDonations = donations.filter(
    (d) =>
      (d.id &&
        d.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.Type && d.Type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.Check && d.Check.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.Amount && d.Amount.toString().includes(searchTerm)) ||
      (d.Notes && d.Notes.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn];
    let bVal: any = b[sortColumn];

    // Handle null/undefined values
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    // Handle dates
    if (sortColumn === 'eDate' || sortColumn === 'created_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortColumn === 'Amount') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = sortedDonations.slice(
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
      setSortDirection(column === 'eDate' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const handleDeleteDonation = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/donations/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete donation');
      }

      setDonations(donations.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const totalAmount = donations.reduce((sum, donation) => sum + (donation.Amount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/friends')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Friends
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Donations by {friend ? `${friend.firstName} ${friend.lastName}` : 'Friend'}
            </h2>
            {friend && (
              <p className="text-gray-600 mt-1">
                {friend.email} • {donations.length} donation{donations.length !== 1 ? 's' : ''} • Total: {formatCurrency(totalAmount)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              fetchFriendAndDonations();
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Refresh
          </Button>
          <Button
            onClick={() => {
              router.push(`/donations/add?friendId=${friendId}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by ID, type, check number, amount, or notes..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      />

      {/* Table */}
      <Card className="bg-white border-gray-200 overflow-hidden">
        <div className="h-[calc(100vh-500px)] overflow-x-auto">
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
                  onClick={() => handleSort('eDate')}
                >
                  Date <SortIndicator column="eDate" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('Type')}
                >
                  Type <SortIndicator column="Type" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('Check')}
                >
                  Check # <SortIndicator column="Check" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('Amount')}
                >
                  Amount <SortIndicator column="Amount" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('Notes')}
                >
                  Notes <SortIndicator column="Notes" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDonations.map((donation) => (
                <tr
                  key={donation.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {donation.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(donation.eDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {donation.Type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {donation.Check || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {formatCurrency(donation.Amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {donation.Notes || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          router.push(`/donations/${donation.id}`);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(donation.id)}
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

          {paginatedDonations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No donations found matching your search.' : 'No donations found for this friend.'}
              </p>
              <Button
                onClick={() => router.push(`/donations/add?friendId=${friendId}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Donation
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, sortedDonations.length)} of{' '}
              {sortedDonations.length} donations
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
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <DeleteConfirmDialog
          onConfirm={handleDeleteDonation}
          onCancel={() => setDeleteId(null)}
          itemType="donation"
        />
      )}
    </div>
  );
}
