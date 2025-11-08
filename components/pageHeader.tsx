import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const PageHeader = () => {
  const { logout, username } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Clay Music Donations
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium text-sm">
            Hello,{' '}
            {username
              ? username.charAt(0).toUpperCase() + username.slice(1)
              : 'Admin'}
          </span>
          <Button
            onClick={logout}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
