'use client';

import { withAuth } from '@/components/withAuth';
import { DonationsView } from '@/components/donations-view';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import PageHeader from '@/components/pageHeader';

function DonationsPage() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <PageHeader />

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar Navigation */}
        <SidebarNavigation />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <DonationsView />
        </main>
      </div>
    </div>
  );
}

export default withAuth(DonationsPage);
