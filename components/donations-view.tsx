"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit2,
  Trash2,
  Printer,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { DonationDetailView } from "@/components/donation-detail-view";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { DonationType, FriendType } from "@/types/DataTypes";
import { useRouter } from "next/navigation";
import {
  generateReceiptsHtml,
  printReceipts,
  generateLabelsHtml,
  printLabels,
} from "@/lib/receipt-utils";

// Define the interface that matches what DonationForm expects
type Donation = {
  id: string;
  date: string;
  friendId: string;
  donationType: "Bought CD" | "Love Offering" | "Other";
  checkNumber: string;
  amount: number;
  notes: string;
};

// Adapter function to transform Supabase data to DonationForm format
const transformDonation = (donation: DonationType): Donation => {
  return {
    id: donation.id,
    date: donation.eDate,
    friendId: donation.Friend.toString(),
    donationType: donation.Type,
    checkNumber: donation.Check,
    amount: donation.Amount,
    notes: donation.Notes || "",
  };
};

// Adapter function to transform DonationForm data to Supabase format
const transformDonationForSupabase = (
  donation: Omit<Donation, "id">,
): Omit<DonationType, "id"> => {
  return {
    created_at: new Date().toISOString(),
    Friend: parseInt(donation.friendId) || 0,
    eDate: donation.date,
    Type: donation.donationType,
    Check: donation.checkNumber,
    Amount: donation.amount,
    Pledge: null,
    Notes: donation.notes,
  };
};

type SortColumn = "eDate" | "Friend" | "Type" | "Check" | "Amount" | null;
type SortDirection = "asc" | "desc";
type YearFilter = "current" | number;

export function DonationsView() {
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [donations, setDonations] = useState<DonationType[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedDonation, setSelectedDonation] = useState<DonationType | null>(
    null,
  );
  const [yearFilter, setYearFilter] = useState<YearFilter>("current");
  const router = useRouter();

  const refreshFriends = async () => {
    try {
      const response = await fetch("/api/friends");
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      const data: FriendType[] = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error refreshing friends:", error);
    }
  };

  const refreshDonations = async () => {
    try {
      const response = await fetch("/api/donations");
      if (!response.ok) {
        throw new Error("Failed to fetch donations");
      }
      const data: DonationType[] = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error refreshing donations:", error);
      // Optionally show an error message to the user
    }
  };

  // Fetch donations and friends when component mounts
  useEffect(() => {
    console.log("DonationsView useEffect triggered");
    refreshDonations();
    refreshFriends();
  }, []);

  // Filter donations by search term, year, and date range
  const filteredDonations = donations.filter((d) => {
    // Search filter - search by Check Number, Amount, Date, and Notes
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      // Check Number search
      (d.Check && d.Check.toLowerCase().includes(searchLower)) ||
      // Amount search (convert amount to string and search)
      (d.Amount && d.Amount.toString().includes(searchTerm)) ||
      // Date search (search in formatted date string)
      (d.eDate && d.eDate.toLowerCase().includes(searchLower)) ||
      // Notes search
      (d.Notes && d.Notes.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Date filter based on year selection
    const donationDate = new Date(d.eDate);
    const donationYear = donationDate.getFullYear();

    if (yearFilter === "current") {
      // Default: Jan 1st of last year to today
      const lastYear = new Date().getFullYear() - 1;
      const startDate = new Date(lastYear, 0, 1); // Jan 1st of last year
      const endDate = new Date(); // Today
      return donationDate >= startDate && donationDate <= endDate;
    } else {
      // Specific year: Jan 1st to Dec 31st of that year
      const startDate = new Date(yearFilter, 0, 1);
      const endDate = new Date(yearFilter, 11, 31);
      return donationDate >= startDate && donationDate <= endDate;
    }
  });

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn as keyof typeof a];
    let bVal: any = b[sortColumn as keyof typeof b];

    // Handle undefined/null values
    if (aVal == null) aVal = "";
    if (bVal == null) bVal = "";

    if (sortColumn === "eDate") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortColumn === "Amount") {
      aVal = Number.parseFloat(aVal) || 0;
      bVal = Number.parseFloat(bVal) || 0;
    } else if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
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

  const handleYearFilterChange = (value: string) => {
    if (value === "current") {
      setYearFilter("current");
    } else {
      setYearFilter(parseInt(value));
    }
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleDeleteDonation = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/donations/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete donation");
      }

      setDonations(donations.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting donation:", error);
      // Optionally show an error message to the user
    }
  };

  const getFriendName = (friendId: number) => {
    if (!friendId) return "Unknown Friend";
    const friend = friends.find((f) => f.id.toString() === friendId.toString());
    if (friend) {
      const fullName = `${friend.firstName || ""} ${
        friend.lastName || ""
      }`.trim();
      return fullName ? `${fullName} (${friendId})` : `Friend ID: ${friendId}`;
    }
    return `Friend ID: ${friendId}`;
  };

  const handlePrintReceipts = () => {
    try {
      // Get last year's donations
      const htmlContent = generateReceiptsHtml(donations, friends);
      const lastYear = new Date().getFullYear() - 1;
      printReceipts(htmlContent, lastYear);
    } catch (error: any) {
      alert(error.message || "Error generating receipts");
    }
  };

  const handlePrintLabels = () => {
    try {
      // Get last year's donations
      const htmlContent = generateLabelsHtml(donations, friends);
      const lastYear = new Date().getFullYear() - 1;
      printLabels(htmlContent, lastYear);
    } catch (error: any) {
      alert(error.message || "Error generating labels");
    }
  };

  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column)
      return <span className="text-gray-400 ml-1">↕</span>;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  // Generate year options for the dropdown from current year down to 2005
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Add "Current" option
    years.push({ value: "current", label: "Current" });

    // Add years from current year down to 2005
    for (let year = currentYear; year >= 2005; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }

    return years;
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="p-6 space-y-6">
      {/* Show detail view when a donation is selected */}
      {selectedDonation && (
        <DonationDetailView
          donation={selectedDonation}
          friends={friends}
          onEdit={() => {
            router.push(`/donations/${selectedDonation.id}`);
          }}
          onDelete={() => {
            setDeleteId(selectedDonation.id);
            setSelectedDonation(null);
          }}
          onBack={() => setSelectedDonation(null)}
        />
      )}

      {/* Header */}
      {!selectedDonation && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Donations</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Refresh donations
                refreshDonations();
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Refresh
            </Button>
            <Button
              onClick={handlePrintLabels}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Labels
            </Button>
            <Button
              onClick={handlePrintReceipts}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipts
            </Button>
            <Button
              onClick={() => {
                router.push("/donations/add");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Donation
            </Button>
          </div>
        </div>
      )}

      {/* Search and Year Filter */}
      {!selectedDonation && (
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by Check #, Amount, Date, or Notes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="w-32">
            <Select
              value={
                yearFilter === "current" ? "current" : yearFilter.toString()
              }
              onValueChange={handleYearFilterChange}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Current" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {yearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      {!selectedDonation && (
        <Card className="bg-white border-gray-200 overflow-hidden">
          <div className="h-[calc(100vh-429px)] overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("eDate")}
                  >
                    Date <SortIndicator column="eDate" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("Friend")}
                  >
                    Friend <SortIndicator column="Friend" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("Type")}
                  >
                    Type <SortIndicator column="Type" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("Check")}
                  >
                    Check # <SortIndicator column="Check" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("Amount")}
                  >
                    Amount <SortIndicator column="Amount" />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Notes
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
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Show read-only view of the donation
                      setSelectedDonation(donation);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.id || ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.eDate || ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getFriendName(donation.Friend)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.Type || ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.Check || ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${(donation.Amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {donation.Notes || ""}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            router.push(`/donations/${donation.id}`);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setDeleteId(donation.id);
                          }}
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
      )}

      {!selectedDonation && (
        <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, sortedDonations.length)} of{" "}
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
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-900"
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
