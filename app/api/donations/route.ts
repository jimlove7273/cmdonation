import { NextResponse } from 'next/server';
import {
  getAllDonations,
  createDonation,
} from '../../../data/donationDatasets';
import { DonationType } from '../../../types/DataTypes';

// GET /api/donations - Get all donations
export async function GET() {
  try {
    const donations = await getAllDonations();
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 },
    );
  }
}

// POST /api/donations - Create a new donation
export async function POST(request: Request) {
  try {
    const donationData = await request.json();

    // Transform the incoming data to match the database schema
    // We need to map the field names to what the database expects
    const dbDonationData: any = {
      created_at: new Date().toISOString(),
      eDate: donationData.date || donationData.eDate,
      Friend: donationData.friendId || donationData.Friend,
      Type: donationData.donationType || donationData.Type,
      Check: donationData.checkNumber || donationData.Check,
      Amount:
        donationData.amount !== undefined
          ? donationData.amount
          : donationData.Amount,
      Notes:
        donationData.notes !== undefined
          ? donationData.notes
          : donationData.Notes,
      Pledge: null, // Set default value for Pledge
    };

    // Remove any undefined values
    Object.keys(dbDonationData).forEach((key) => {
      if (dbDonationData[key] === undefined) {
        delete dbDonationData[key];
      }
    });

    const newDonation = await createDonation(dbDonationData);

    if (!newDonation) {
      return NextResponse.json(
        { error: 'Failed to create donation' },
        { status: 500 },
      );
    }

    return NextResponse.json(newDonation);
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 },
    );
  }
}
