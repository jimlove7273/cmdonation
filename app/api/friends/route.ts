import { NextResponse } from 'next/server';
import { getAllFriends, createFriend } from '../../../data/friendDatasets';
import { FriendType } from '../../../types/DataTypes';

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
    // When creating a friend, we don't pass an ID as the database should auto-generate it
    const friendWithoutId: any = friendData;
    const newFriend = await createFriend(friendWithoutId as any);

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
