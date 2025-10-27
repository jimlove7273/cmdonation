"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Friend {
  id: string
  firstName: string
  lastName: string
}

interface Donation {
  id: string
  date: string
  friendId: string
  donationType: "Bought CD" | "Love Offering" | "Other"
  checkNumber: string
  amount: number
  notes: string
}

interface DonationFormProps {
  donation?: Donation | null
  friends: Friend[]
  onSubmit: (data: Omit<Donation, "id">) => void
  onCancel: () => void
}

export function DonationForm({ donation, friends, onSubmit, onCancel }: DonationFormProps) {
  const [formData, setFormData] = useState({
    date: donation?.date || new Date().toISOString().split("T")[0],
    friendId: donation?.friendId || "",
    donationType: donation?.donationType || ("Love Offering" as const),
    checkNumber: donation?.checkNumber || "",
    amount: donation?.amount || 0,
    notes: donation?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const selectedFriend = friends.find((f) => f.id === formData.friendId)
  const friendDisplayName = selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : ""

  return (
    <Card className="bg-white border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{donation ? "Edit Donation" : "Add New Donation"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Friend</label>
            <Select value={formData.friendId} onValueChange={(value) => setFormData({ ...formData, friendId: value })}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select a friend" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id}>
                    {friend.firstName} {friend.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
            <Select
              value={formData.donationType}
              onValueChange={(value: any) => setFormData({ ...formData, donationType: value })}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="Bought CD">Bought CD</SelectItem>
                <SelectItem value="Love Offering">Love Offering</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check Number</label>
            <Input
              type="text"
              value={formData.checkNumber}
              onChange={(e) => setFormData({ ...formData, checkNumber: e.target.value })}
              placeholder="Enter Check Number"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
            placeholder="0.00"
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter notes"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            {donation ? "Update" : "Add"} Donation
          </Button>
        </div>
      </form>
    </Card>
  )
}
