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
        .sort((a, b) => {
          return new Date(a.eDate).getTime() - new Date(b.eDate).getTime();
        })
        .map(
          (d: DonationType) => `
          <tr>
            <td style="padding: 3px 0; font-size: 14px;">${d.eDate}</td>
            <td style="padding: 3px 0; font-size: 14px;">${
              d.Check === 'paypal'
                ? 'PayPal'
                : d.Check.startsWith('ACH')
                ? d.Check
                : d.Check === 'zelle'
                ? 'Zelle'
                : `Check #${d.Check}`
            }</td>
            <td style="padding: 3px 0; font-size: 14px;">$${d.Amount.toFixed(
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
              <h2 style="font-size: 24px; margin: 0;">${new Date().getFullYear()} Donation Receipt</h2>
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
                    <th style="text-align: left; border-bottom: 1px solid #000; padding: 4px;">Donation Method</th>
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
          
            <div style="margin: 10px 0;">
              <p style="margin: 4px 0; font-size: 14px;">Thank you for your support.<br>
              May God bless you even more abundantly.<br><br></p>
              
              <p style="margin: 10px 0 4px 0;">Love in Christ,</p>
              
              <div style="margin: 8px 0; font-family: 'Dancing Script', cursive; font-size: 22px; font-weight: bold;">
                Amy Sand
              </div>
              
              Clay Music</p>
              <br><br>
            </div>
            
            <div style="text-align: center;">
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
 * Generate HTML content for mailing labels
 */
export function generateLabelsHtml(
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

  // Unique friends who donated last year
  const uniqueFriendIds = Array.from(
    new Set(lastYearDonations.map((d) => d.Friend.toString())),
  );

  const uniqueFriends = uniqueFriendIds
    .map((id) => friends.find((f) => f.id.toString() === id))
    .filter((f): f is FriendType => !!f);

  const sortedFriends = uniqueFriends.sort(
    (a, b) => parseInt(a.id.toString(), 10) - parseInt(b.id.toString(), 10),
  );

  // Avery 5162 specifics (2 columns x 7 rows)
  // Label: 4in x 1.333in
  // Page size: 8.5in x 11in
  // Recommended page padding (top, left/right) for Avery 5162: 0.5in top, 0.1875in left/right
  // Horizontal gap between labels ~0.125in, vertical gap ~0.125in
  const labelsPerPage = 14;
  const cols = 2;

  function renderLabelWithPosition(
    friend: FriendType | null,
    leftInches: number,
    topInches: number,
  ) {
    if (!friend) {
      // empty placeholder - still need to render for spacing consistency
      return `<div style="
        position: absolute;
        left: ${leftInches}in;
        top: ${topInches}in;
        width: 4in;
        height: 1.333in;
        box-sizing: border-box;
      "></div>`;
    }

    const street = friend.address || '';
    const cityLine = friend.city ? `${friend.city},` : '';
    const stateZip = `${friend.state || ''} ${friend.zipcode || ''}`.trim();

    return `
      <div style="
        position: absolute;
        left: ${leftInches}in;
        top: ${topInches}in;
        width: 4in;
        height: 1.333in;
        box-sizing: border-box;
        padding: 6px 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-size: 11px;
      ">
        <div style="margin-left: 1in;">
          <div style="font-size: 10px; font-weight:600; margin-bottom:2px;">#${
            friend.id
          }</div>
          <div style="font-size: 14px;">${friend.firstName || ''} ${
      friend.lastName || ''
    }</div>
          <div style="font-size: 14px;">${street}</div>
          <div style="font-size: 14px;">${cityLine} ${stateZip}</div>
        </div>
      </div>
    `;
  }

  // Build pages
  const pages: string[] = [];
  for (let i = 0; i < sortedFriends.length; i += labelsPerPage) {
    const pageFriends = sortedFriends.slice(i, i + labelsPerPage);

    // Fill up to 14 with nulls (placeholders) so layout is stable
    while (pageFriends.length < labelsPerPage) pageFriends.push(null as any);

    // Build the page container using absolute positioning for precise control
    let pageHtml = `
      <div style="
        width: 8.5in;
        height: 11in;
        position: relative;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      ">
    `;

    // Render 14 labels (2 columns x 7 rows) with absolute positioning
    pageFriends.forEach((friend, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;

      // Calculate exact positions with fine-tuned vertical gaps - moved further up to align with actual labels
      const left = 0.1875 + col * (4 + 0.125); // left margin + column * (label width + gap)
      const top = 0.625 + row * (1.333 + 0.0175); // further reduced top margin + row * (label height + fine gap)

      pageHtml += renderLabelWithPosition(friend, left, top);
    });

    pageHtml += `</div>`;

    // add page-break after each page except the last
    if (i + labelsPerPage < sortedFriends.length) {
      pageHtml += `<div style="page-break-after: always;"></div>`;
    }

    pages.push(pageHtml);
  }

  // If there were no full pages (edgecase), still return an empty page container
  if (pages.length === 0) {
    pages.push(`
      <div style="
        width: 8.5in;
        height: 11in;
        box-sizing: border-box;
        padding: 0.5in 0.1875in;
      "></div>
    `);
  }

  // Wrap all pages so printing will render them consecutively
  return `
    <div>
      ${pages.join('')}
    </div>
  `;
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

/**
 * Open a print window with the generated labels
 */
export function printLabels(htmlContent: string, year: number) {
  const printWindow = window.open('', '', 'width=1000,height=800');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Mailing Labels - ${year} Donors</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            @media print {
              body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
              }
              @page {
                margin: 0;
                size: 8.5in 11in;
              }
            }
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
