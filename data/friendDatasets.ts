import { FriendType, DATASETS } from "@/types/DataTypes"
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '@/utils/supabase/crud';

/**
 * Get all friends from the database.
 * @returns Promise<FriendType[]> - Array of all friends
 */
export async function getAllFriends(): Promise<FriendType[]> {
  try {
    const allProducts: FriendType[] = await getAll(DATASETS.DONATION_FRIENDS);
    return allProducts;
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
    const friend: FriendType = await getOne(DATASETS.DONATION_FRIENDS, id);
    return friend;
  } catch (error) {
    console.error('Error fetching friend:', error);
    return null;
  }
}

/**
 * Create a new friend in the database.
 * @param friend - The friend data to create
 * @returns Promise<FriendType | null> - The created friend object or null on error
 */
export async function createFriend(friend: FriendType): Promise<FriendType | null> {
  try {
    const newFriend: FriendType = await createOne(DATASETS.DONATION_FRIENDS, friend);
    return newFriend;
  } catch (error) {
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
export async function updateFriend(id: string, friend: FriendType): Promise<FriendType | null> {
  try {
    const updatedFriend: FriendType = await updateOne(DATASETS.DONATION_FRIENDS, id, friend);
    return updatedFriend;
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
