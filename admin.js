// ── CREDENTIALS ──
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'yash2025';

// ── LOGIN ──
function doLogin() {
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('adminAuth', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display   = 'flex';
    initDashboard();
  } else {
    document.getElementById('loginError').textContent = '❌ Invalid username or password.';
    document.getElementById('adminPass').value = '';
    document.getElementById('adminPass').focus();
  }
}

function doLogout() {
  sessionStorage.removeItem('adminAuth');
  location.reload();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── INIT ──
function initDashboard() {
  document.getElementById('todayDate').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  renderMiniStats();
  renderTable();
  fetchOrdersFromSheet();
  // Auto-poll every 30s so orders from any device appear automatically
  setInterval(fetchOrdersFromSheet, 30000);
}

// ── ORDERS: Google Sheet (primary) + localStorage (fallback) ──
function getOrders() {
  return JSON.parse(localStorage.getItem('yeoOrders') || '[]');
}
function saveOrders(orders) {
  localStorage.setItem('yeoOrders', JSON.stringify(orders));
}

async function fetchOrdersFromSheet() {
  const urlBanner = document.getElementById('urlWarning');
  if (!window.APPS_SCRIPT_URL || window.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
    if (urlBanner) urlBanner.style.display = 'flex';
    setSheetStatus('⚠️ Apps Script URL not set. Orders from other devices will not sync.');
    return;
  }
  if (urlBanner) urlBanner.style.display = 'none';
  const btn = document.querySelector('.btn-refresh');
  if (btn) btn.classList.add('spinning');
  try {
    const res  = await fetch(window.APPS_SCRIPT_URL + '?t=' + Date.now()); // cache-bust
    const data = await res.json();
    if (data.success) {
      saveOrders(data.orders);  // replace local cache with sheet data (source of truth)
      renderMiniStats();
      renderTable();
      setSheetStatus(`✅ Synced ${data.orders.length} orders from Google Sheet — ${new Date().toLocaleTimeString('en-IN')}`);
    } else {
      setSheetStatus('⚠️ Sheet returned an error: ' + (data.error || 'unknown'));
    }
  } catch (e) {
    setSheetStatus('⚠️ Could not reach Google Sheet. Showing last synced data.');
  } finally {
    if (btn) btn.classList.remove('spinning');
  }
}

async function refreshOrders() {
  await fetchOrdersFromSheet();
}

function setSheetStatus(msg) {
  const el = document.getElementById('sheetStatus');
  if (el) el.textContent = msg;
}

// ── MINI STATS ──
function renderMiniStats() {
  const orders    = getOrders();
  const total     = orders.length;
  const revenue   = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending   = orders.filter(o => (o.status || 'Pending') === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  document.getElementById('miniStats').innerHTML = `
    <div class="stat-card" style="--c:#6c3483">
      <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
      <div class="stat-info"><h4>${total}</h4><p>Total Orders</p></div>
    </div>
    <div class="stat-card" style="--c:#27ae60">
      <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
      <div class="stat-info"><h4>₹${revenue.toLocaleString('en-IN')}</h4><p>Total Revenue</p></div>
    </div>
    <div class="stat-card" style="--c:#e67e22">
      <div class="stat-icon"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><h4>${pending}</h4><p>Pending Orders</p></div>
    </div>
    <div class="stat-card" style="--c:#2980b9">
      <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><h4>${delivered}</h4><p>Delivered</p></div>
    </div>`;
}

// ── RENDER TABLE ──
function renderTable() {
  let orders = getOrders();
  const q      = (document.getElementById('orderSearch')?.value || '').toLowerCase();
  const status = document.getElementById('statusFilter')?.value || '';

  if (q) orders = orders.filter(o =>
    (o.orderId||'').toLowerCase().includes(q) ||
    (o.name||'').toLowerCase().includes(q) ||
    (o.city||'').toLowerCase().includes(q) ||
    (o.mobile||'').toLowerCase().includes(q)
  );
  if (status) orders = orders.filter(o => (o.status || 'Pending') === status);

  const tbody = document.getElementById('ordersBody');
  const empty = document.getElementById('emptyState');

  if (!orders.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const reversed = orders.slice().reverse();
  tbody.innerHTML = reversed.map((o, i) => {
    const st = o.status || 'Pending';
    const booksList  = (o.items || []).map(b => `${b.title} ×${b.qty}`).join(', ');
    const booksShort = booksList.length > 55 ? booksList.slice(0, 55) + '…' : booksList;
    return `
    <tr>
      <td>${orders.length - i}</td>
      <td><span class="order-id">${o.orderId}</span></td>
      <td style="white-space:nowrap;font-size:.78rem">${o.datetime || '—'}</td>
      <td><span class="customer-name">${o.name}</span></td>
      <td>${o.mobile}</td>
      <td>${o.email || '—'}</td>
      <td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${o.address || ''}">${o.address || '—'}</td>
      <td>${o.city}</td>
      <td>${o.state}</td>
      <td>${o.pin}</td>
      <td>${o.landmark || '—'}</td>
      <td style="white-space:nowrap;font-size:.78rem">${o.deliveryType || 'Standard'}</td>
      <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${o.instructions || ''}">${o.instructions || '—'}</td>
      <td class="books-cell"><small>${booksShort}</small></td>
      <td style="text-align:center">${o.itemCount}</td>
      <td>₹${o.subtotal}</td>
      <td>₹${o.delivery}</td>
      <td><b>₹${o.total}</b></td>
      <td>UPI / QR Code</td>
      <td>
        <select class="status-select" onchange="updateStatus('${o.orderId}', this.value)">
          ${['Pending','Processing','Shipped','Delivered','Cancelled'].map(s =>
            `<option value="${s}" ${s===st?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td style="white-space:nowrap">
        <button class="btn-view" onclick="viewOrder('${o.orderId}')"><i class="fas fa-eye"></i></button>
        <button class="btn-del-order" onclick="deleteOrder('${o.orderId}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

// ── STATUS UPDATE ──
function updateStatus(orderId, newStatus) {
  const orders = getOrders();
  const o = orders.find(x => x.orderId === orderId);
  if (o) { o.status = newStatus; saveOrders(orders); renderMiniStats(); }
}

// ── DELETE ──
function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  saveOrders(getOrders().filter(o => o.orderId !== orderId));
  renderMiniStats();
  renderTable();
}

function clearAllOrders() {
  if (!confirm('Clear ALL orders? This cannot be undone.')) return;
  localStorage.removeItem('yeoOrders');
  renderMiniStats();
  renderTable();
}

// ── VIEW DETAIL ──
function viewOrder(orderId) {
  const o = getOrders().find(x => x.orderId === orderId);
  if (!o) return;
  const st = o.status || 'Pending';
  document.getElementById('detailBody').innerHTML = `
    <div class="detail-section">
      <h4>Order Info</h4>
      <div class="detail-row"><span>Order ID</span><b>${o.orderId}</b></div>
      <div class="detail-row"><span>Date & Time</span><b>${o.datetime}</b></div>
      <div class="detail-row"><span>Status</span><span class="status-badge status-${st}">${st}</span></div>
    </div>
    <div class="detail-section">
      <h4>Customer</h4>
      <div class="detail-row"><span>Name</span><b>${o.name}</b></div>
      <div class="detail-row"><span>Mobile</span><b>${o.mobile}</b></div>
      <div class="detail-row"><span>Email</span><b>${o.email || '—'}</b></div>
    </div>
    <div class="detail-section">
      <h4>Delivery Address</h4>
      <div class="detail-row"><span>Address</span><b>${o.address}</b></div>
      <div class="detail-row"><span>City</span><b>${o.city}</b></div>
      <div class="detail-row"><span>State</span><b>${o.state}</b></div>
      <div class="detail-row"><span>PIN</span><b>${o.pin}</b></div>
      <div class="detail-row"><span>Landmark</span><b>${o.landmark || '—'}</b></div>
      <div class="detail-row"><span>Delivery Type</span><b>${o.deliveryType || 'Standard'}</b></div>
      <div class="detail-row"><span>Instructions</span><b>${o.instructions || '—'}</b></div>
    </div>
    <div class="detail-section">
      <h4>Books Ordered</h4>
      ${(o.items||[]).map(b => `
        <div class="detail-book-item">
          <span>${b.title}${b.author ? ` <small style="color:#888">by ${b.author}</small>` : ''}</span>
          <span>${b.price ? `₹${b.price} × ${b.qty} = <b>₹${b.price*b.qty}</b>` : `×${b.qty}`}</span>
        </div>`).join('')}
    </div>
    <div class="detail-section">
      <h4>Payment</h4>
      <div class="detail-row"><span>Subtotal</span><b>₹${o.subtotal}</b></div>
      <div class="detail-row"><span>Delivery Charge</span><b>₹${o.delivery}</b></div>
      <div class="detail-row"><span>Total Paid</span><b style="color:#6c3483;font-size:1.05rem">₹${o.total}</b></div>
      <div class="detail-row"><span>Payment Method</span><b>UPI / QR Code</b></div>
    </div>`;
  document.getElementById('detailModal').classList.add('open');
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('open');
}

// ── EXPORT EXCEL ──
function exportExcel() {
  const orders = getOrders();
  if (!orders.length) { alert('No orders to export.'); return; }

  const rows = orders.map((o, i) => ({
    'Sr No':          i + 1,
    'Order ID':       o.orderId,
    'Date & Time':    o.datetime,
    'Customer Name':  o.name,
    'Mobile':         o.mobile,
    'Email':          o.email || '',
    'Address':        o.address,
    'City':           o.city,
    'State':          o.state,
    'PIN Code':       o.pin,
    'Landmark':       o.landmark || '',
    'Delivery Type':  o.deliveryType || 'Standard',
    'Instructions':   o.instructions || '',
    'Books Ordered':  (o.items||[]).map(b => `${b.title} ×${b.qty}`).join(' | '),
    'Total Items':    o.itemCount,
    'Subtotal (₹)':   o.subtotal,
    'Delivery (₹)':   o.delivery,
    'Total (₹)':      o.total,
    'Payment':        'UPI / QR Code',
    'Status':         o.status || 'Pending'
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    {wch:6},{wch:14},{wch:20},{wch:22},{wch:14},{wch:26},
    {wch:30},{wch:14},{wch:18},{wch:10},{wch:18},{wch:22},
    {wch:26},{wch:52},{wch:10},{wch:12},{wch:12},{wch:12},
    {wch:16},{wch:14}
  ];
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, `YashEnterprises_Orders_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// ── TABS ──
function showTab(tab, e) {
  if (e) e.preventDefault();
  ['orders','stats','sheet'].forEach(t => {
    const el = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = 'none';
  });
  const active = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (active) active.style.display = 'block';

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (e && e.currentTarget) e.currentTarget.classList.add('active');

  const titles = {
    orders: '<i class="fas fa-shopping-bag"></i> Orders Management',
    stats:  '<i class="fas fa-chart-bar"></i> Statistics',
    sheet:  '<i class="fas fa-table"></i> Google Sheet'
  };
  document.getElementById('pageTitle').innerHTML = titles[tab] || '';
  if (tab === 'stats') renderStats();
}

// ── STATS ──
function renderStats() {
  const orders  = getOrders();
  const revenue = orders.reduce((s,o) => s+(o.total||0), 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  const freq = {};
  orders.forEach(o => (o.items||[]).forEach(b => { freq[b.title] = (freq[b.title]||0) + b.qty; }));
  const topBook = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';

  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card" style="--c:#6c3483"><div class="stat-icon"><i class="fas fa-shopping-bag"></i></div><div class="stat-info"><h4>${orders.length}</h4><p>Total Orders</p></div></div>
    <div class="stat-card" style="--c:#27ae60"><div class="stat-icon"><i class="fas fa-rupee-sign"></i></div><div class="stat-info"><h4>₹${revenue.toLocaleString('en-IN')}</h4><p>Total Revenue</p></div></div>
    <div class="stat-card" style="--c:#2980b9"><div class="stat-icon"><i class="fas fa-calculator"></i></div><div class="stat-info"><h4>₹${avgOrder}</h4><p>Avg Order Value</p></div></div>
    <div class="stat-card" style="--c:#e67e22"><div class="stat-icon"><i class="fas fa-star"></i></div><div class="stat-info"><h4 style="font-size:.88rem;line-height:1.2">${topBook.slice(0,20)}</h4><p>Top Selling Book</p></div></div>`;

  renderCharts(orders);
  renderTopBooks(freq);
}

function renderTopBooks(freq) {
  const top5 = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const ranks = ['gold','silver','bronze','',''];
  document.getElementById('topBooksTable').innerHTML = top5.length
    ? top5.map(([title, qty], i) => `
        <div class="top-book-row">
          <div class="top-book-rank ${ranks[i]}">${i+1}</div>
          <div class="top-book-title">${title}</div>
          <div class="top-book-qty">${qty} sold</div>
        </div>`).join('')
    : '<p style="color:#aaa;text-align:center;padding:2rem">No data yet</p>';
}

function renderCharts(orders) {
  // Category chart
  const catCount = {};
  orders.forEach(o => (o.items||[]).forEach(b => {
    catCount[b.category] = (catCount[b.category]||0) + b.qty;
  }));
  const catLabels = Object.keys(catCount);
  const catData   = Object.values(catCount);
  const colors    = ['#ff6b6b','#f9ca24','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#e67e22','#00b894','#d63031'];
  drawBarChart('catChart', catLabels, catData, colors.slice(0, catLabels.length));

  // Revenue last 7 days
  const dayRevenue = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    dayRevenue[d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})] = 0;
  }
  orders.forEach(o => {
    if (!o.datetime) return;
    const key = new Date(o.datetime).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    if (key in dayRevenue) dayRevenue[key] += (o.total||0);
  });
  drawBarChart('revChart', Object.keys(dayRevenue), Object.values(dayRevenue), Array(7).fill('#6c3483'));

  // Status donut
  const statusCount = { Pending:0, Processing:0, Shipped:0, Delivered:0, Cancelled:0 };
  orders.forEach(o => { const s = o.status||'Pending'; if (s in statusCount) statusCount[s]++; });
  drawDonut('statusChart', Object.keys(statusCount), Object.values(statusCount),
    ['#f39c12','#3498db','#9b59b6','#27ae60','#e74c3c']);
}

function drawBarChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = 240;
  ctx.clearRect(0, 0, W, H);

  if (!labels.length) {
    ctx.fillStyle = '#ccc'; ctx.font = '13px Poppins,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('No data yet', W/2, H/2); return;
  }

  const pad = { top:24, right:16, bottom:48, left:52 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top  - pad.bottom;
  const max = Math.max(...data, 1);
  const gap = cW / labels.length;
  const barW = Math.max(8, gap * 0.58);

  // Grid
  ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + cH - (cH/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left+cW, y); ctx.stroke();
    ctx.fillStyle = '#aaa'; ctx.font = '10px Poppins,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max/4*i > 999 ? (max/4*i/1000).toFixed(1)+'k' : max/4*i), pad.left-5, y+4);
  }

  // Bars
  data.forEach((val, i) => {
    const x  = pad.left + gap*i + (gap-barW)/2;
    const bH = Math.max(2, (val/max)*cH);
    const y  = pad.top + cH - bH;
    const g  = ctx.createLinearGradient(0, y, 0, y+bH);
    g.addColorStop(0, colors[i % colors.length]);
    g.addColorStop(1, colors[i % colors.length] + '99');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, bH, 4) : ctx.rect(x, y, barW, bH);
    ctx.fill();
    if (val > 0) {
      ctx.fillStyle = '#555'; ctx.font = 'bold 9px Poppins,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(val > 999 ? '₹'+Math.round(val/1000)+'k' : val, x+barW/2, y-4);
    }
    ctx.fillStyle = '#666'; ctx.font = '9px Poppins,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText((labels[i]||'').slice(0,9), x+barW/2, pad.top+cH+14);
  });
}

function drawDonut(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = 240;
  ctx.clearRect(0, 0, W, H);

  const total = data.reduce((s,v)=>s+v, 0);
  if (!total) {
    ctx.fillStyle = '#ccc'; ctx.font = '13px Poppins,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('No data yet', W/2, H/2); return;
  }

  const cx = W * 0.38, cy = H/2, r = Math.min(cx, cy) - 20, inner = r * 0.58;
  let angle = -Math.PI/2;

  data.forEach((val, i) => {
    if (!val) return;
    const slice = (val/total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle+slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    angle += slice;
  });

  // Hole
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI*2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.fillStyle = '#333'; ctx.font = 'bold 14px Poppins,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy+5);
  ctx.fillStyle = '#888'; ctx.font = '10px Poppins,sans-serif';
  ctx.fillText('orders', cx, cy+18);

  // Legend
  const lx = W * 0.62, ly = cy - (labels.length * 18)/2;
  labels.forEach((lbl, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(lx, ly + i*22, 12, 12);
    ctx.fillStyle = '#555'; ctx.font = '10px Poppins,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${lbl} (${data[i]})`, lx+16, ly + i*22 + 10);
  });
}

// ── AUTO-LOGIN ──
window.onload = () => {
  if (sessionStorage.getItem('adminAuth') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display   = 'flex';
    initDashboard();
  }
};
