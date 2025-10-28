import { NextResponse } from 'next/server';
import {
  getOneFriend,
  updateFriend,
  deleteFriend,
} from '@/data/friendDatasets';
import { FriendType } from '@/types/DataTypes';

// GET /api/friends/:id - Get a specific friend
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const friend = await getOneFriend(id);
    if (!friend) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }
    return NextResponse.json(friend);
  } catch (error) {
    console.error('Error fetching friend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend' },
      { status: 500 },
    );
  }
}

// PUT /api/friends/:id - Update a friend
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const friendData: Omit<FriendType, 'id'> = await request.json();
    const updatedFriend = await updateFriend(id, {
      ...friendData,
      id,
    } as FriendType);

    if (!updatedFriend) {
      return NextResponse.json(
        { error: 'Failed to update friend' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedFriend);
  } catch (error) {
    console.error('Error updating friend:', error);
    return NextResponse.json(
      { error: 'Failed to update friend' },
      { status: 500 },
    );
  }
}

// DELETE /api/friends/:id - Delete a friend
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteFriend(id);
    return NextResponse.json({ message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend:', error);
    return NextResponse.json(
      { error: 'Failed to delete friend' },
      { status: 500 },
    );
  }
}
