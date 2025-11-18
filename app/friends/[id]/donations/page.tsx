'use client';

import { withAuth } from '@/components/withAuth';
import { FriendDonationsView } from '@/components/friend-donations-view';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';
import { useParams } from 'next/navigation';

function FriendDonationsPage() {
  const { id } = useParams();
  const friendId = Array.isArray(id) ? id[0] : id;

  if (!friendId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Invalid friend ID</div>
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
          <FriendDonationsView friendId={friendId} />
        </main>
      </div>
    </div>
  );
}

export default withAuth(FriendDonationsPage);
