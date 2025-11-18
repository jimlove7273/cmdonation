import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/supabaseServer';
import { DonationType, DATASETS } from '@/types/DataTypes';

// GET /api/friends/:id/donations - Get all donations for a specific friend
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = supabaseServer();

    if (!supabase) {
      throw new Error('Supabase client initialization failed');
    }

    // Query donations where Friend field matches the friend ID
    const { data, error } = await supabase
      .from(DATASETS.DONATIONS)
      .select('*')
      .eq('Friend', parseInt(id))
      .order('eDate', { ascending: false }); // Order by date, newest first

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data as DonationType[] || []);
  } catch (error) {
    console.error('Error fetching donations for friend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations for friend' },
      { status: 500 },
    );
  }
}
