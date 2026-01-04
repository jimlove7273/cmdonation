'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function InactivityModal() {
  const { showInactivityModal, closeInactivityModal } = useAuth();

  return (
    <Dialog open={showInactivityModal} onOpenChange={closeInactivityModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            You have been logged out due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            For security purposes, your session has ended due to inactivity.
            Please log back in to continue using the application.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={closeInactivityModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
