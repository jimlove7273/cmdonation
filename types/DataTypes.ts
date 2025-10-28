export type FriendType = {
  id: string;
  firstName: string;
  lastName: string;
  chineseName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  dns: boolean;
  phone: string;
  email: string;
  country: string;
  notes: string;
};

export type DonationType = {
  id: string;
  created_at: string;
  Friend: number;
  eDate: string;
  Type: 'Bought CD' | 'Love Offering' | 'Other';
  Check: string;
  Amount: number;
  Pledge: string | null;
  Notes: string | null;
};

// Dataset constants
export const DATASETS = {
  DONATIONS: 'donations',
  DONATION_FRIENDS: 'donation_friends',
} as const;
