// ── Deploy as Web App: Execute as "Me", Access "Anyone" ──
// Sheet ID from your Google Drive link
const SHEET_ID = '1Bs9ND1O0DEKyytFcQeiQ04tmpmo54ADtKOOwMDJ1qIg';
const SHEET_NAME = 'Orders';

const HEADERS = [
  'Sr No','Order ID','Date & Time','Customer Name','Mobile','Email',
  'Address','City','State','PIN Code','Landmark','Delivery Type',
  'Instructions','Books Ordered','Total Items','Subtotal (₹)',
  'Delivery (₹)','Total (₹)','Payment','Status'
];

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#6c3483').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// POST — save a new order
function doPost(e) {
  try {
    const order = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const srNo = lastRow; // row 1 = header, so lastRow = count of data rows

    sheet.appendRow([
      srNo,
      order.orderId,
      order.datetime,
      order.name,
      order.mobile,
      order.email || '',
      order.address,
      order.city,
      order.state,
      order.pin,
      order.landmark || '',
      order.deliveryType || 'Standard',
      order.instructions || '',
      (order.items || []).map(b => `${b.title} ×${b.qty}`).join(' | '),
      order.itemCount,
      order.subtotal,
      order.delivery,
      order.total,
      'UPI / QR Code',
      order.status || 'Pending'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, orderId: order.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET — fetch all orders
function doGet(e) {
  try {
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const orders = rows.slice(1).map(r => ({
      orderId:      r[1],
      datetime:     r[2],
      name:         r[3],
      mobile:       r[4],
      email:        r[5],
      address:      r[6],
      city:         r[7],
      state:        r[8],
      pin:          r[9],
      landmark:     r[10],
      deliveryType: r[11],
      instructions: r[12],
      items:        (r[13] || '').split(' | ').filter(Boolean).map(s => {
                      const m = s.match(/^(.+) ×(\d+)$/);
                      return m ? { title: m[1], qty: parseInt(m[2]) } : { title: s, qty: 1 };
                    }),
      itemCount:    r[14],
      subtotal:     r[15],
      delivery:     r[16],
      total:        r[17],
      status:       r[19] || 'Pending'
    }));

    return ContentService.createTextOutput(JSON.stringify({ success: true, orders }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
