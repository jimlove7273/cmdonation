import { FriendType, DATASETS } from '@/types/DataTypes';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '@/utils/supabase/crud';

// Adapter functions to transform between FriendType and Supabase database structure
function friendToDb(friend: Omit<FriendType, 'id'>): any {
  return {
    firstName: friend.firstName,
    lastName: friend.lastName,
    address: friend.address,
    city: friend.city,
    state: friend.state,
    zipcode: friend.zipcode, // Map zip to zipcode
    dns: friend.dns,
    phone: friend.phone,
    email: friend.email,
    country: friend.country,
    notes: friend.notes,
  };
}

function dbToFriend(dbFriend: any): FriendType {
  return {
    id: dbFriend.id,
    firstName: dbFriend.firstName,
    lastName: dbFriend.lastName,
    address: dbFriend.address,
    city: dbFriend.city,
    state: dbFriend.state,
    zipcode: dbFriend.zipcode, // Map zipcode to zip
    dns: dbFriend.dns,
    phone: dbFriend.phone,
    email: dbFriend.email,
    country: dbFriend.country,
    notes: dbFriend.notes,
  };
}

/**
 * Get all friends from the database.
 * @returns Promise<FriendType[]> - Array of all friends
 */
export async function getAllFriends(): Promise<FriendType[]> {
  try {
    const allFriends: any[] = await getAll(DATASETS.DONATION_FRIENDS);
    return allFriends.map(dbToFriend);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
}

/**
 * Get a single friend by ID.
 * @param id - The friend's ID
 * @returns Promise<FriendType | null> - The friend object or null if not found
 */
export async function getOneFriend(id: string): Promise<FriendType | null> {
  try {
    const friend: any = await getOne(DATASETS.DONATION_FRIENDS, id);
    return friend ? dbToFriend(friend) : null;
  } catch (error) {
    console.error('Error fetching friend:', error);
    return null;
  }
}

/**
 * Create a new friend in the database.
 * @param friend - The friend data to create (without ID as it should be auto-generated)
 * @returns Promise<FriendType | null> - The created friend object or null on error
 */
export async function createFriend(
  friend: Omit<FriendType, 'id'>,
): Promise<FriendType | null> {
  try {
    const dbFriendData = friendToDb(friend);
    const newFriend: any = await createOne(
      DATASETS.DONATION_FRIENDS,
      dbFriendData,
    );
    return newFriend ? dbToFriend(newFriend) : null;
  } catch (error: any) {
    console.error('Error creating friend:', error);
    // If there's a duplicate key error, try to handle it by not passing an ID
    if (error.code === '23505') {
      // This is a duplicate key error, which suggests ID conflict
      // Try again without explicitly setting any ID-related fields
      try {
        const dbFriendData = friendToDb(friend);
        // Ensure no ID-related fields are passed
        const cleanData = { ...dbFriendData };
        const newFriend: any = await createOne(
          DATASETS.DONATION_FRIENDS,
          cleanData,
        );
        return newFriend ? dbToFriend(newFriend) : null;
      } catch (retryError) {
        console.error('Retry error creating friend:', retryError);
        return null;
      }
    }
    return null;
  }
}

/**
 * Update an existing friend by ID.
 * @param id - The friend's ID
 * @param friend - The updated friend data
 * @returns Promise<FriendType | null> - The updated friend object or null on error
 */
export async function updateFriend(
  id: string,
  friend: FriendType,
): Promise<FriendType | null> {
  try {
    // Remove the id from the friend object since we don't want to update it
    const { id: _, ...friendData } = friend;
    const dbFriendData = friendToDb(friendData);
    const updatedFriendData: any = await updateOne(
      DATASETS.DONATION_FRIENDS,
      id,
      dbFriendData,
    );
    // Add the id back to the returned object
    return updatedFriendData ? dbToFriend({ ...updatedFriendData, id }) : null;
  } catch (error) {
    console.error('Error updating friend:', error);
    return null;
  }
}

/**
 * Delete a friend by ID.
 * @param id - The friend's ID
 * @returns Promise<void> - No return value
 * @throws Error if deletion fails
 */
export async function deleteFriend(id: string): Promise<void> {
  try {
    await deleteOne(DATASETS.DONATION_FRIENDS, id);
  } catch (error) {
    console.error('Error deleting friend:', error);
    throw error;
  }
}
