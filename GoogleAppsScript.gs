// Deploy as Web App: Execute as "Me", Access "Anyone"
var SHEET_ID = '1Bs9ND1O0DEKyytFcQeiQ04tmpmo54ADtKOOwMDJ1qIg';
var SHEET_NAME = 'Orders';

var HEADERS = [
  'Sr No', 'Order ID', 'Date & Time', 'Customer Name', 'Mobile', 'Email',
  'Address', 'City', 'State', 'PIN Code', 'Landmark', 'Delivery Type',
  'Instructions', 'Books Ordered', 'Total Items', 'Subtotal (Rs)',
  'Delivery (Rs)', 'Total (Rs)', 'Payment', 'Status'
];

function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#6c3483')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// POST - save a new order OR update status
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Handle status update
    if (data.action === 'updateStatus') {
      var sheet = getSheet();
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] == data.orderId) {
          sheet.getRange(i + 1, 20).setValue(data.status); // column 20 = Status
          return ContentService
            .createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Order not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Handle new order
    var order = data;
    var sheet = getSheet();
    var srNo = sheet.getLastRow();

    var booksOrdered = (order.items || []).map(function(b) {
      return b.title + ' x' + b.qty;
    }).join(' | ');

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
      booksOrdered,
      order.itemCount,
      order.subtotal,
      order.delivery,
      order.total,
      'UPI / QR Code',
      order.status || 'Pending'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: order.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET - fetch all orders
function doGet(e) {
  try {
    var sheet = getSheet();
    var rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var orders = rows.slice(1).map(function(r) {
      var itemsRaw = (r[13] || '').toString();
      var items = itemsRaw.split(' | ').filter(function(s) { return s; }).map(function(s) {
        var m = s.match(/^(.+) x(\d+)$/);
        return m ? { title: m[1], qty: parseInt(m[2]) } : { title: s, qty: 1 };
      });

      return {
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
        items:        items,
        itemCount:    r[14],
        subtotal:     r[15],
        delivery:     r[16],
        total:        r[17],
        status:       r[19] || 'Pending'
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orders: orders }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
