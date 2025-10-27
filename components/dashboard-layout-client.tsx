'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Gift, Users } from 'lucide-react';
import { DashboardContent } from '@/components/dashboard-content';

interface DashboardLayoutClientProps {
  onLogout?: () => void;
  currentView: 'donations' | 'friends';
  onViewChange?: (view: 'donations' | 'friends') => void;
  donationsView: React.ReactNode;
  friendsView: React.ReactNode;
}

export function DashboardLayoutClient({
  onLogout,
  currentView: initialView,
  onViewChange,
  donationsView,
  friendsView,
}: DashboardLayoutClientProps) {
  const [currentView, setCurrentView] = useState<'donations' | 'friends'>(
    initialView,
  );
  const { username } = useAuth();

  // Update the parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

  // Update local state when initialView prop changes
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  return (
    /* Updated to light mode colors */
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Clay Music Donations
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Hello,{' '}
              {username
                ? username.charAt(0).toUpperCase() + username.slice(1)
                : 'Admin'}
            </span>
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('donations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'donations'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Gift className="w-5 h-5" />
              Donations
            </button>
            <button
              onClick={() => setCurrentView('friends')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'friends'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Friends
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <DashboardContent
            currentView={currentView}
            donationsView={donationsView}
            friendsView={friendsView}
          />
        </main>
      </div>
    </div>
  );
}
