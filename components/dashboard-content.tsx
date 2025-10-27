interface DashboardContentProps {
  currentView: 'donations' | 'friends';
  donationsView: React.ReactNode;
  friendsView: React.ReactNode;
}

export function DashboardContent({
  currentView,
  donationsView,
  friendsView,
}: DashboardContentProps) {
  return (
    <div className="p-6">
      {currentView === 'donations' ? donationsView : friendsView}
    </div>
  );
}
