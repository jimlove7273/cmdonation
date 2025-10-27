import { NextResponse } from 'next/server';
import {
  getAllFriends,
  getOneFriend,
  createFriend,
  updateFriend,
  deleteFriend,
} from '@/data/friendDatasets';
import { FriendType } from '@/types/DataTypes';

// GET /api/friends - Get all friends
export async function GET() {
  try {
    const friends = await getAllFriends();
    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 },
    );
  }
}

// POST /api/friends - Create a new friend
export async function POST(request: Request) {
  try {
    const friendData: Omit<FriendType, 'id'> = await request.json();
    const newFriend = await createFriend(friendData as FriendType);

    if (!newFriend) {
      return NextResponse.json(
        { error: 'Failed to create friend' },
        { status: 500 },
      );
    }

    return NextResponse.json(newFriend);
  } catch (error) {
    console.error('Error creating friend:', error);
    return NextResponse.json(
      { error: 'Failed to create friend' },
      { status: 500 },
    );
  }
}

// PUT /api/friends/:id - Update a friend
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const friendData: Omit<FriendType, 'id'> = await request.json();
    // Include the ID from the URL parameter
    const friendWithId: FriendType = {
      ...friendData,
      id: params.id,
    };
    const updatedFriend = await updateFriend(params.id, friendWithId);

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
  { params }: { params: { id: string } },
) {
  try {
    await deleteFriend(params.id);
    return NextResponse.json({ message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend:', error);
    return NextResponse.json(
      { error: 'Failed to delete friend' },
      { status: 500 },
    );
  }
}
