import { supabaseServer } from './supabaseServer';

/**
 * Get all rows from a given table.
 * @param table - The table name.
 * @returns An array of rows typed as T.
 */
export async function getAll<T>(table: string): Promise<T[]> {
  const supabase = supabaseServer();
  if (!supabase) throw new Error('Supabase client initialization failed');

  // Fetch all records using pagination to avoid limits
  let allData: T[] = [];
  let start = 0;
  const limit = 1000;
  let finished = false;

  while (!finished) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(start, start + limit - 1);

    if (error) throw error;

    if (data.length === 0) {
      finished = true;
    } else {
      allData = [...allData, ...(data as T[])];
      start += limit;

      // If we got fewer records than the limit, we're done
      if (data.length < limit) {
        finished = true;
      }
    }
  }

  return allData;
}

/**
 * Get a single row by ID from a given table.
 * @param table - The table name.
 * @param id - The ID of the row.
 * @returns A single row typed as T.
 */
export async function getOne<T>(table: string, id: string): Promise<T> {
  const supabase = supabaseServer();
  if (!supabase) throw new Error('Supabase client initialization failed');
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as T;
}

/**
 * Insert a new row into a given table.
 * @param table - The table name.
 * @param payload - The row data to insert.
 * @returns The inserted row typed as T.
 */
export async function createOne<T>(table: string, payload: T): Promise<T> {
  const supabase = supabaseServer();
  if (!supabase) throw new Error('Supabase client initialization failed');
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

/**
 * Update a row by ID in a given table.
 * @param table - The table name.
 * @param id - The ID of the row to update.
 * @param payload - Partial row data with updated values.
 * @returns The updated row typed as T.
 */
export async function updateOne<T>(
  table: string,
  id: string,
  payload: Partial<T>,
): Promise<T> {
  const supabase = supabaseServer();
  if (!supabase) throw new Error('Supabase client initialization failed');
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

/**
 * Delete a row by ID from a given table.
 * @param table - The table name.
 * @param id - The ID of the row to delete.
 */
export async function deleteOne(table: string, id: string): Promise<void> {
  const supabase = supabaseServer();
  if (!supabase) throw new Error('Supabase client initialization failed');
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
