import { DashboardLayoutClient } from '@/components/dashboard-layout-client';

interface DashboardLayoutProps {
  onLogout?: () => void;
  currentView: 'donations' | 'friends';
  onViewChange?: (view: 'donations' | 'friends') => void;
  donationsView: React.ReactNode;
  friendsView: React.ReactNode;
}

export function DashboardLayout({
  onLogout,
  currentView,
  onViewChange,
  donationsView,
  friendsView,
}: DashboardLayoutProps) {
  return (
    <DashboardLayoutClient
      onLogout={onLogout || (() => {})}
      currentView={currentView}
      onViewChange={onViewChange || (() => {})}
      donationsView={donationsView}
      friendsView={friendsView}
    />
  );
}
