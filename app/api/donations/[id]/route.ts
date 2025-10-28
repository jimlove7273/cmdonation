import { NextResponse } from 'next/server';
import {
  getOneDonation,
  updateDonation,
  deleteDonation,
} from '@/data/donationDatasets';
import { DonationType } from '@/types/DataTypes';

// GET /api/donations/:id - Get a specific donation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const donation = await getOneDonation(id);
    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(donation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donation' },
      { status: 500 },
    );
  }
}

// PUT /api/donations/:id - Update a donation
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const donationData: Omit<DonationType, 'id'> = await request.json();
    // Include the ID from the URL parameter
    const donationWithId: DonationType = {
      ...donationData,
      id,
    };
    const updatedDonation = await updateDonation(id, donationWithId);

    if (!updatedDonation) {
      return NextResponse.json(
        { error: 'Failed to update donation' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 },
    );
  }
}

// DELETE /api/donations/:id - Delete a donation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteDonation(id);
    return NextResponse.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    return NextResponse.json(
      { error: 'Failed to delete donation' },
      { status: 500 },
    );
  }
}
