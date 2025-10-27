"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DeleteConfirmDialogProps {
  onConfirm: () => void
  onCancel: () => void
  itemType: string
}

export function DeleteConfirmDialog({ onConfirm, onCancel, itemType }: DeleteConfirmDialogProps) {
  return (
    /* Updated to light mode styling */
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-white border-gray-200 p-6 max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </Button>
        </div>
      </Card>
    </div>
  )
}
