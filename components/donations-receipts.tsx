import { DonationType, FriendType } from '@/types/DataTypes';
import { generateReceiptsHtml, printReceipts } from '@/lib/receipt-utils';

interface DonationReceiptsProps {
  donations: DonationType[];
  friends: FriendType[];
}

const DonationReceipts = ({ donations, friends }: DonationReceiptsProps) => {
  try {
    const htmlContent = generateReceiptsHtml(donations, friends);
    const lastYear = new Date().getFullYear() - 1;
    printReceipts(htmlContent, lastYear);
  } catch (error: any) {
    alert(error.message || 'Error generating receipts');
  }

  return null;
};

export default DonationReceipts;
