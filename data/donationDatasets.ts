import { DonationType, DATASETS } from '@/types/DataTypes';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '@/utils/supabase/crud';

/**
 * Get all Donations from the database.
 * @returns Promise<DonationType[]> - Array of all Donations
 */
export async function getAllDonations(): Promise<DonationType[]> {
  try {
    console.log('Fetching donations from Supabase...');
    const allProducts: DonationType[] = await getAll(DATASETS.DONATIONS);
    console.log('Donations fetched:', allProducts);
    return allProducts;
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
}

/**
 * Get a single Donation by ID.
 * @param id - The Donation's ID
 * @returns Promise<DonationType | null> - The Donation object or null if not found
 */
export async function getOneDonation(id: string): Promise<DonationType | null> {
  try {
    const donation: DonationType = await getOne(DATASETS.DONATIONS, id);
    return donation;
  } catch (error) {
    console.error('Error fetching donation:', error);
    return null;
  }
}

/**
 * Create a new Donation in the database.
 * @param donation - The Donation data to create
 * @returns Promise<DonationType | null> - The created donation object or null on error
 */
export async function createDonation(
  donation: DonationType,
): Promise<DonationType | null> {
  try {
    const newDonation: DonationType = await createOne(
      DATASETS.DONATIONS,
      donation,
    );
    return newDonation;
  } catch (error) {
    console.error('Error creating donation:', error);
    return null;
  }
}

/**
 * Update an existing Donation by ID.
 * @param id - The Donation's ID
 * @param donation - The updated Donation data
 * @returns Promise<DonationType | null> - The updated Donation object or null on error
 */
export async function updateDonation(
  id: string,
  donation: DonationType,
): Promise<DonationType | null> {
  try {
    const updatedDonation: DonationType = await updateOne(
      DATASETS.DONATIONS,
      id,
      donation,
    );
    return updatedDonation;
  } catch (error) {
    console.error('Error updating donation:', error);
    return null;
  }
}

/**
 * Delete a Donation by ID.
 * @param id - The Donation's ID
 * @returns Promise<void> - No return value
 * @throws Error if deletion fails
 */
export async function deleteDonation(id: string): Promise<void> {
  try {
    await deleteOne(DATASETS.DONATIONS, id);
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw error;
  }
}
