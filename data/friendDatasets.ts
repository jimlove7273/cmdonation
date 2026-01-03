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
 * Create a new friend in the database with a unique ID that is one greater than the maximum existing ID.
 * Implements retry logic to handle potential race conditions during ID assignment.
 * @param friend - The friend data to create
 * @returns Promise<FriendType | null> - The created friend object or null on error
 */
export async function createFriend(
  friend: Omit<FriendType, 'id'>,
): Promise<FriendType | null> {
  try {
    // Get all existing friends to find the maximum ID
    const allFriends = await getAllFriends();

    // Find the highest ID currently in the database
    const maxId =
      allFriends.length > 0
        ? Math.max(...allFriends.map((f) => parseInt(f.id)))
        : 0;

    // Set the new ID to be one greater than the maximum
    let newId = maxId + 1;

    // Add the new ID to the friend data
    const dbFriendData = friendToDb(friend);

    // Insert the record with the calculated ID
    let newFriend: any = null;
    let attempts = 0;
    const maxAttempts = 5; // Limit retry attempts

    while (attempts < maxAttempts) {
      try {
        newFriend = await createOne(DATASETS.DONATION_FRIENDS, {
          ...dbFriendData,
          id: newId,
        });
        break; // Exit the loop if successful
      } catch (createError: any) {
        // If it's a duplicate key error, increment the ID and try again
        if (
          createError.code === '23505' ||
          createError.message.includes('duplicate') ||
          createError.message.includes('unique')
        ) {
          // Get updated max ID in case other records were added
          const updatedFriends = await getAllFriends();
          const updatedMaxId =
            updatedFriends.length > 0
              ? Math.max(...updatedFriends.map((f) => parseInt(f.id)))
              : 0;
          newId = updatedMaxId + 1;
          attempts++;
        } else {
          // Re-throw if it's a different error
          throw createError;
        }
      }
    }

    if (!newFriend) {
      throw new Error(`Failed to create friend after ${maxAttempts} attempts`);
    }

    return newFriend ? dbToFriend(newFriend) : null;
  } catch (error: any) {
    console.error('Error creating friend:', error);
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
