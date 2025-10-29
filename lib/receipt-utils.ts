import { DonationType, FriendType } from '@/types/DataTypes';

/**
 * Generate HTML content for donation receipts
 */
export function generateReceiptsHtml(
  donations: DonationType[],
  friends: FriendType[],
): string {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearDonations = donations.filter(
    (d: DonationType) => new Date(d.eDate).getFullYear() === lastYear,
  );

  if (lastYearDonations.length === 0) {
    throw new Error(`No donations found for ${lastYear}`);
  }

  // Group donations by friend
  const donationsByFriend: { [key: string]: DonationType[] } = {};
  lastYearDonations.forEach((donation: DonationType) => {
    const friendId = donation.Friend.toString();
    if (!donationsByFriend[friendId]) {
      donationsByFriend[friendId] = [];
    }
    donationsByFriend[friendId].push(donation);
  });

  // Generate print content for each friend
  return Object.keys(donationsByFriend)
    .map((friendId) => {
      const friendDonations = donationsByFriend[friendId];
      const friend = friends.find(
        (f: FriendType) => f.id.toString() === friendId,
      );

      if (!friend) return '';

      const fullName = `${friend.firstName || ''} ${
        friend.lastName || ''
      }`.trim();
      const friendName = fullName || `Friend ID: ${friendId}`;

      // Calculate total amount for this friend
      const totalAmount = friendDonations.reduce(
        (sum, d) => sum + (d.Amount || 0),
        0,
      );

      // Generate donation rows
      const donationRows = friendDonations
        .map(
          (d: DonationType) => `
          <tr>
            <td style="padding: 4px 0; font-size: 14px;">${d.eDate}</td>
            <td style="padding: 4px 0; font-size: 14px;">${d.Check || ''}</td>
            <td style="padding: 4px 0; font-size: 14px;">$${d.Amount.toFixed(
              2,
            )}</td>
          </tr>
        `,
        )
        .join('');

      return `
        <div style="page-break-after: always; padding: 50px; font-family: Arial, sans-serif; display: flex; flex-direction: column; min-height: 90vh;">
          <div style="flex: 1;">
            <div style="text-align: center; margin-bottom: 12px; display: flex; gap: 4px; align-items: center;">
              <img src="https://www.claymusic.org/wp-content/uploads/2015/07/home_logo.gif" alt="Clay Music Logo" style="height: 35px;" />
            </div>
            
            <div style="text-align: center; margin-bottom: 15px;">
              <h2 style="font-size: 16px; margin: 0;">${new Date().getFullYear()} Donation Receipt</h2>
            </div>
            
            <div style="margin-bottom: 20px;">
              <div style="font-size: 10px;">#${friendId}</div>
              <div>${friendName}</div>
              <div>${friend.address || ''}</div>
              <div>${friend.city ? `${friend.city},` : ''} ${
        friend.state || ''
      } ${friend.zipcode || ''}</div>
            </div>
            
            <p style="margin: 35px 0 30px 0;">${new Date().toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )}</p>
            
            <div style="margin: 15px 0;">
              <p style="margin-bottom: 20px;">Dear ${friendName},</p>
              <p style="margin: 20px 0;">Clay Music hereby gratefully acknowledges receipt of your donation as follows in the year of ${lastYear}.</p>
            </div>
            
            <div style="margin: 12px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; border-bottom: 1px solid #000; padding: 4px;">Date</th>
                    <th style="text-align: left; border-bottom: 1px solid #000; padding: 4px;">Check #</th>
                    <th style="text-align: left; border-bottom: 1px solid #000; padding: 4px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${donationRows}
                  <tr><td><br></td></tr>
                  <tr>
                    <td></td>
                    <td style="font-size: 16px; text-align: right; font-weight: bold; padding-top: 4px;">Total:&nbsp;&nbsp;</td>
                    <td style="font-size: 16px; font-weight: bold; padding-top: 4px;">$${totalAmount.toFixed(
                      2,
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
            <div style="margin: 15px 0;">
              <p style="margin: 4px 0; font-size: 14px;">Thank you for your support.<br>
              May God bless you even more abundantly.<br><br></p>
              
              <p style="margin: 10px 0 4px 0;">Love in Christ,</p>
              
              <div style="margin: 8px 0; font-family: 'Dancing Script', cursive; font-size: 22px; font-weight: bold;">
                Amy Sand
              </div>
              
              <p style="margin: 4px 0;"><strong>Amy Sand</strong><br>
              Clay Music</p>
              <br><br>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
              <p style="font-size: 10px; margin: 3px 0;">No goods or services were provided in consideration of the donations</p>
              <hr style="width: 50%; margin: 8px auto; border: 0.5px solid #ccc;">
              <p style="font-size: 9px; margin: 3px 0; line-height: 1.2;">
                www.claymusic.org / email: amy@claymusic.org<br>
                Clay Music Address: P.O. Box 5451 Diamond Bar, CA 91765-7451 / Tel & Fax: 909-861-7906
              </p>
            </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Open a print window with the generated receipts
 */
export function printReceipts(htmlContent: string, year: number) {
  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipts - ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            @media print { 
              body { 
                margin: 0; 
                padding: 0;
                width: 100%;
                height: 100%;
              }
              @page { margin: 0.3cm; }
            }
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
