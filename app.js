// Books database - Add your catalog later
const books = [
  { id: 1, title: "बुद्धिमत्ता - Basic to Advanced", author: "प्रा. सतीश वसे", category: "MPSC EXAM", price: 560, oldPrice: 599, stars: 4.9, reviews: 120, img: "images/buddhimatta-basic-to-advanced.png" },
  { id: 2, title: "FASTRACK MATHS - Basic to Advance (APTI)", author: "प्रा. सतीश वसे", category: "MPSC EXAM", price: 560, oldPrice: 599, stars: 4.9, reviews: 120, img: "images/fastrack-maths.png" },
  { id: 3, title: "भारतीय अर्थव्यवस्था", author: "विठ्ठल पुंगळे", category: "MPSC EXAM", price: 400, stars: 4.8, reviews: 0, img: "images/book-cover-3.png", publisher: "वैदिका पब्लिकेशन", description: "UPSC–MPSC, PSI, STI आणि ASO परीक्षांसाठी भारतीय अर्थव्यवस्थेचे मार्गदर्शक पुस्तक." },
  { id: 4, title: "भूगोल व पर्यावरण (भारत व जग)", author: "विठ्ठल पुंगळे", category: "MPSC EXAM", price: 400, stars: 4.8, reviews: 0, img: "images/book-cover-4.png", publisher: "वैदिका पब्लिकेशन", description: "UPSC–MPSC, PSI, STI आणि ASO परीक्षांसाठी भूगोल व पर्यावरणाचे मार्गदर्शक पुस्तक." },
  { id: 5, title: "आधुनिक भारताचा इतिहास", author: "विठ्ठल पुंगळे", category: "MPSC EXAM", price: 400, stars: 4.8, reviews: 0, img: "images/book-cover-5.png", publisher: "वैदिका पब्लिकेशन", description: "UPSC–MPSC, PSI, STI आणि ASO परीक्षांसाठी आधुनिक भारताच्या इतिहासाचे मार्गदर्शक पुस्तक." },
  { id: 6, title: "महाराष्ट्राचा भूगोल", author: "विठ्ठल पुंगळे", category: "MPSC EXAM", price: 400, stars: 4.8, reviews: 0, img: "images/book-cover-6.png", publisher: "वैदिका पब्लिकेशन", description: "MPSC, PSI, STI आणि ASO परीक्षांसाठी महाराष्ट्राच्या भूगोलाचे मार्गदर्शक पुस्तक." }
];

// Cart state
let cart = [];
const HANDLING_PER_BOOK = 10;
const COURIER_PER_BOOK = 150;
let currentFilter = 'All';

// Rotating Banner State
let currentBannerIndex = 0;
let bannerRotationInterval;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderBooks(books);
  setupFAQs();
  loadCartFromStorage();
  initializeRotatingBanner();
});

// Initialize rotating banner
function initializeRotatingBanner() {
  if (books.length === 0) return;
  
  // Render initial banner
  updateBannerDisplay();
  
  // Create indicators
  const indicatorsContainer = document.getElementById('bannerIndicators');
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = books.map((_, index) => 
      `<div class="banner-indicator ${index === 0 ? 'active' : ''}" onclick="goToBookBanner(${index})"></div>`
    ).join('');
  }
  
  // Start auto-rotation every 5 seconds
  if (bannerRotationInterval) clearInterval(bannerRotationInterval);
  bannerRotationInterval = setInterval(() => {
    currentBannerIndex = (currentBannerIndex + 1) % books.length;
    updateBannerDisplay();
  }, 5000);
}

// Update banner display with current book
function updateBannerDisplay() {
  const book = books[currentBannerIndex];
  if (!book) return;
  
  document.getElementById('bannerTitle').textContent = book.title;
  document.getElementById('bannerDesc').textContent = book.description || 'Essential reference textbook for competitive exams.';
  document.getElementById('bannerImg').src = book.img;
  document.getElementById('bannerLabel').textContent = book.category || 'FEATURED';
  
  // Update indicators
  document.querySelectorAll('.banner-indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentBannerIndex);
  });
}

// Navigate to specific book in banner
function goToBookBanner(index) {
  if (index >= 0 && index < books.length) {
    currentBannerIndex = index;
    updateBannerDisplay();
    
    // Reset the interval
    if (bannerRotationInterval) clearInterval(bannerRotationInterval);
    bannerRotationInterval = setInterval(() => {
      currentBannerIndex = (currentBannerIndex + 1) % books.length;
      updateBannerDisplay();
    }, 5000);
  }
}

// View current banner book details
function viewCurrentBannerBook() {
  openBook(books[currentBannerIndex].id);
}

// Render books grid
function renderBooks(booksToRender) {
  const grid = document.getElementById('booksGrid');
  const noResult = document.getElementById('noResult');

  if (!grid) return;

  if (booksToRender.length === 0) {
    grid.innerHTML = '';
    noResult.style.display = 'flex';
    noResult.style.flexDirection = 'column';
    noResult.style.alignItems = 'center';
    noResult.style.justifyContent = 'center';
    return;
  }

  noResult.style.display = 'none';
  grid.innerHTML = booksToRender.map(book => `
    <div class="book-card" data-category="${book.category}">
      <div class="book-thumb">
        <img src="${book.img}" alt="${book.title}" class="book-image" onclick="openBook(${book.id})"/>
        <button class="quick-view" onclick="openBook(${book.id})">Quick View</button>
      </div>
      <div class="book-info">
        <h3 class="book-title" onclick="location.href='product.html?id=${book.id}'">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-price">₹${book.price}</div>
        <button class="book-btn" onclick="addToCart(${book.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}



// Open book detail modal
function openBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const modal = document.getElementById('bookModal');
  document.getElementById('modalImg').src = book.img;
  document.getElementById('modalTitle').textContent = book.title;
  document.getElementById('modalAuthor').textContent = `by ${book.author}`;
  document.getElementById('modalPrice').textContent = book.price;
  document.getElementById('modalOldPrice').textContent = book.oldPrice ? `₹${book.oldPrice}` : '';
  document.getElementById('modalStock').textContent = book.stock || 'IN STOCK & READY TO SHIP';
  document.getElementById('modalBadge').textContent = book.category || '';
  document.getElementById('modalDesc').textContent = book.description || book.title;

  // extra specs
  document.getElementById('modalPublisher').textContent = book.publisher || '';
  document.getElementById('modalPages').textContent = book.pages || '';
  document.getElementById('modalISBN').textContent = book.isbn || '';

  // rating/reviews
  document.getElementById('modalRating').textContent = book.stars ? `★ ${book.stars}` : '';
  document.getElementById('modalReviews').textContent = book.reviews ? `(${book.reviews} reviews)` : '';

  const highlights = book.highlights || ['Updated for 2026','Practice sets included'];
  const ul = document.getElementById('modalHighlights');
  ul.innerHTML = highlights.map(h => `<li>${h}</li>`).join('');

  // View more link - if book has slug or link
  const viewMore = document.getElementById('modalViewMore');
  if (book.link) {
    viewMore.href = book.link;
    viewMore.style.display = 'inline-block';
  } else {
    viewMore.href = '#';
    viewMore.style.display = 'none';
  }

  // store current open book id on modal element for later actions
  modal.dataset.bookId = bookId;
  modal.style.display = 'flex';
}

function closeBook() {
  const modal = document.getElementById('bookModal');
  if (modal) modal.style.display = 'none';
}

function goToCart() {
  // add if not present and open cart sidebar
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar && overlay) {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }
  closeBook();
}

// modal quantity helpers
function adjustQty(delta) {
  const qtyEl = document.getElementById('modalQty');
  let qty = Number(qtyEl.textContent || '1');
  qty = Math.max(1, qty + delta);
  qtyEl.textContent = qty;
}

// when adding from modal, add quantity
function addToCartFromModal() {
  const modal = document.getElementById('bookModal');
  const id = Number(modal.dataset.bookId);
  const qty = Number(document.getElementById('modalQty').textContent || '1');
  const book = books.find(b=>b.id===id);
  if (!book) return;
  const existing = cart.find(i=>i.id===id);
  if (existing) existing.quantity += qty; else cart.push({...book, quantity: qty});
  saveCartToStorage();
  updateCartUI();
  showNotification(`Added "${book.title}" x${qty} to cart`);
}

function buyNowFromModal() {
  addToCartFromModal();
  openCheckout();
}


// Filter books
function filterBooks(category) {
  currentFilter = category;

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Filter and render
  if (category === 'All') {
    renderBooks(books);
  } else {
    const filtered = books.filter(b => b.category === category);
    renderBooks(filtered);
  }
}

// Search books
function searchBooks(query) {
  if (!query.trim()) {
    renderBooks(books);
    return;
  }

  const searchResults = books.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  );

  renderBooks(searchResults);
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  renderBooks(books);
}

// Add to cart (accepts optional quantity)
function addToCart(bookId, qty = 1) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const existingItem = cart.find(item => item.id === bookId);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 0) + Number(qty);
  } else {
    cart.push({ ...book, quantity: Number(qty) });
  }

  saveCartToStorage();
  updateCartUI();
  showNotification(`Added "${book.title}" x${qty} to cart`);
}

// Remove from cart
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  saveCartToStorage();
  updateCartUI();
}

function updateCartQuantity(bookId, change) {
  const item = cart.find(cartItem => cartItem.id === bookId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(bookId);
  else {
    saveCartToStorage();
    updateCartUI();
  }
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  renderCartItems();
  updateCartTotals();
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Your cart is empty</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-details">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">₹${item.price} each</p>
      </div>
      <div class="cart-item-actions">
        <div class="cart-quantity-controls" aria-label="Quantity for ${item.title}">
          <button type="button" onclick="updateCartQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" onclick="updateCartQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-cart-item" type="button" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.title}">×</button>
      </div>
    </div>
  `).join('');
}

// Update cart totals
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalBooks = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handling = totalBooks * HANDLING_PER_BOOK;
  const courier = totalBooks * COURIER_PER_BOOK;
  const total = subtotal + handling + courier;

  // expose values for other flows
  window.cartSubtotal = subtotal;
  window.handlingCharge = handling;
  window.courierCharge = courier;
  // removed deliveryCharge per request
  window.cartGrandTotal = total;

  document.querySelectorAll('#cartTotal, #rev-sub, #delivery-sub, #pay-sub').forEach(el => {
    if (el) el.textContent = `₹${subtotal}`;
  });

  // handling and courier
  document.querySelectorAll('#delivery-handling, #pay-handling').forEach(el => {
    if (el) el.textContent = `₹${handling}`;
  });
  document.querySelectorAll('#delivery-courier, #pay-courier').forEach(el => {
    if (el) el.textContent = `₹${courier}`;
  });

  // update totals display
  document.querySelectorAll('#delivery-total, #pay-total, #qr-amount, #qr-amount2').forEach(el => {
    if (el) el.textContent = `₹${total}`;
  });

  // Generate UPI QR code
  if (document.getElementById('qrImg')) {
    const upiString = `upi://pay?pa=7020121893@upi&pn=Yash Enterprises&am=${total}`;
    document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  }
}

// Cart toggle
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

// Close cart and overlay
function closeAll() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// Save/load cart
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartUI();
  }
}

// FAQ toggle
function setupFAQs() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');

      // Close other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const ans = item.querySelector('.faq-answer');
          if (ans) ans.style.display = 'none';
        }
      });

      // Toggle current FAQ
      faqItem.classList.toggle('active');
      if (answer) {
        answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
      }
    });
  });
}

// Form submission
function submitForm(e) {
  e.preventDefault();
  alert('Thank you for your message! We will contact you soon.');
  e.target.reset();
}

// Notification
function showNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#2c5aa0; color:white; padding:12px 20px; border-radius:8px; z-index:9999; animation:slideIn 0.3s ease;';
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Copy UPI ID
function copyUPI() {
  const upiID = '7020121893@upi';
  navigator.clipboard.writeText(upiID);
  alert('UPI ID copied!');
}

// Checkout functions
let currentStep = 1;

function goStep(step) {
  currentStep = step;
  document.querySelectorAll('.checkout-step').forEach((el, i) => {
    el.style.display = i + 1 === step ? 'block' : 'none';
  });
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 <= step);
  });
}

function openCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'flex';
    renderOrderReview();
  }
}

function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.style.display = 'none';
  currentStep = 1;
}

function renderOrderReview() {
  const list = document.getElementById('orderReviewList');
  if (!list) return;

  list.innerHTML = cart.map(item => `
    <div style="padding:12px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
      <div>
        <p style="font-weight:600;">${item.title}</p>
        <p style="color:#666; font-size:12px;">Qty: ${item.quantity}</p>
      </div>
      <p style="font-weight:600;">₹${item.price * item.quantity}</p>
    </div>
  `).join('');
}

function validateDelivery() {
  const form = document.getElementById('deliveryForm');
  if (form.checkValidity()) {
    goStep(3);
  } else {
    alert('Please fill all required fields');
  }
}

function updateDelivery(type) {
  const charges = {
    standard: 49,
    express: 99,
    free: 0
  };
  // Updates are handled by updateCartTotals
  updateCartTotals();
}

function placeOrder() {
  const fname  = document.getElementById('fname').value;
  const lname  = document.getElementById('lname').value;
  const name   = `${fname} ${lname}`;
  const mobile = document.getElementById('mobile').value;
  const email  = document.getElementById('email').value;
  const address= document.getElementById('address').value;
  const city   = document.getElementById('city').value;
  const state  = document.getElementById('state').value;
  const pin    = document.getElementById('pincode').value;
  const landmark    = document.getElementById('landmark').value;
  const instructions= document.getElementById('instructions').value;
  const delivType   = document.querySelector('input[name="delivery"]:checked')?.value || 'standard';
  const delivLabel  = { standard:'Standard (5–7 days)', express:'Express (2–3 days)', free:'Free (7–10 days)' };
  const sub = cart.reduce((s,c) => s + (c.price * c.quantity), 0);
  const totalBooks = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handling = window.handlingCharge != null ? window.handlingCharge : totalBooks * HANDLING_PER_BOOK;
  const courier = window.courierCharge != null ? window.courierCharge : totalBooks * COURIER_PER_BOOK;
  const total = sub + handling + courier;
  const orderId = 'YEO' + Date.now().toString().slice(-6);
  const datetime = new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

  // ── Save order to localStorage + Google Sheet ──
  const orderData = {
    orderId, datetime, name, mobile, email, address, city, state, pin, landmark, instructions,
    deliveryType: delivLabel[delivType],
    handling, courier,

    items: cart.map(c => ({ id:c.id, title:c.title, author:c.author, category:c.category, price:c.price, qty:c.quantity })),
    itemCount: cart.reduce((s,c)=>s+c.quantity, 0),
    subtotal: sub, handling, courier, total,
    status: 'Pending'
  };
  const existing = JSON.parse(localStorage.getItem('yeoOrders') || '[]');
  existing.push(orderData);
  localStorage.setItem('yeoOrders', JSON.stringify(existing));

  // Send to Google Sheet via Apps Script Web App
  if (window.APPS_SCRIPT_URL) {
    fetch(window.APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',          // avoids CORS preflight — works on any domain
      body: JSON.stringify(orderData)
    }).catch(() => {}); // silent fail — order is already saved locally
  }

  // ── Show confirmation ──
  document.getElementById('confirmMsg').textContent =
    `Thank you, ${fname}! Your order #${orderId} has been placed.`;
  document.getElementById('confirmDetails').innerHTML = `
    <b>Order ID:</b> #${orderId}<br/>
    <b>Items:</b> ${orderData.itemCount} book(s)<br/>
    <b>Deliver to:</b> ${address}, ${city}, ${state} – ${pin}<br/>
    <b>Mobile:</b> ${mobile}<br/>
    <b>Payment:</b> UPI / QR Code<br/>
    <b>Amount Paid:</b> ₹${total}<br/>
    <b>Charges:</b> Handling ₹${handling}, Courier ₹${courier}<br/>
  `;
  goStep(4);
  const confirmMsg = document.getElementById('confirmMsg');
  if (confirmMsg) {
    confirmMsg.textContent = `Order ID: #${Math.floor(Math.random() * 1000000)}`;
  }
  cart = [];
  saveCartToStorage();
  updateCartUI();
  setTimeout(() => closeCheckout(), 3000);
}

// --- Product page rendering (product.html?id=) ---
(function renderProductPageIfNeeded(){
  try{
    const root = document.getElementById('productRoot');
    if (!root) return;
    // read id from query
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id')) || null;
    const book = id ? books.find(b=>b.id===id) : null;
    if (!book) {
      root.innerHTML = '<p>Product not found. <a href="index.html">Go back</a></p>';
      return;
    }

    root.innerHTML = `
      <a href="index.html" class="back-to-books" onclick="if (window.history.length > 1) { window.history.back(); return false; }">
        <i class="fas fa-arrow-left"></i><span>Home</span>
      </a>
      <div class="product-grid">
        <div class="product-left">
          <img src="${book.img}" alt="${book.title}"/>
        </div>
        <div class="product-right">
          <div class="badge">${book.category || ''}</div>
          <h1 class="product-title">${book.title}</h1>
          <p class="product-author">by ${book.author}</p>
          <div class="product-rating">${book.stars? '★ '+book.stars : ''} ${book.reviews? '('+book.reviews+' reviews)':''}</div>

          <div class="product-price-row">
            <div class="product-price">₹${book.price}</div>
            <div class="product-oldprice">${book.oldPrice? '₹'+book.oldPrice : ''}</div>
            <div class="product-stock">${book.stock || 'IN STOCK & READY TO SHIP'}</div>
          </div>

          <div class="product-specs">
            <div><strong>Publisher:</strong> ${book.publisher || '—'}</div>
            <div><strong>Pages:</strong> ${book.pages || '—'}</div>
            <div><strong>ISBN:</strong> ${book.isbn || '—'}</div>
          </div>

          <h3>Book Description</h3>
          <p class="product-desc">${book.description || ''}</p>

          <h3>Key Highlights</h3>
          <ul class="product-highlights">${(book.highlights||[]).map(h=>'<li>'+h+'</li>').join('')}</ul>

          <div class="product-actions">
            <div class="qty">
              <label>Qty</label>
              <button onclick="(function(){const el=document.getElementById('prodQty');let v=Number(el.textContent);el.textContent=Math.max(1,v-1);})()">-</button>
              <span id="prodQty">1</span>
              <button onclick="(function(){const el=document.getElementById('prodQty');let v=Number(el.textContent);el.textContent=v+1;})()">+</button>
            </div>
            <div class="action-buttons">
                    <button class="btn-add" onclick="(function(){ const qty=Number(document.getElementById('prodQty').textContent||'1'); addToCart(${book.id}, qty); alert('Added to cart'); })()">Add to Cart</button>
                    <button class="btn-buy" onclick="(function(){ const qty=Number(document.getElementById('prodQty').textContent||'1'); addToCart(${book.id}, qty); openCheckout(); })()">Buy Now</button>
            </div>
          </div>

        </div>
      </div>
    `;

  }catch(e){ console.error(e); }
})();
