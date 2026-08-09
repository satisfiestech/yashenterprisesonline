// Books database - Add your catalog later
const books = [
  { id: 1, title: "Sample Book Title", author: "Author Name", category: "UPSC", price: 499, oldPrice: 799, stars: 5, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" }
];

// Cart state
let cart = [];
let currentFilter = 'All';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderBooks(books);
  setupFAQs();
  loadCartFromStorage();
});

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
      <img src="${book.img}" alt="${book.title}" class="book-image"/>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-price">₹${book.price}</div>
        <button class="book-btn" onclick="addToCart(${book.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
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

// Add to cart
function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const existingItem = cart.find(item => item.id === bookId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  saveCartToStorage();
  updateCartUI();
  showNotification(`Added "${book.title}" to cart`);
}

// Remove from cart
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  saveCartToStorage();
  updateCartUI();
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
    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #eee;">
      <div style="flex:1;">
        <p style="font-weight:600; margin-bottom:4px;">${item.title}</p>
        <p style="color:#666; font-size:12px;">₹${item.price} × ${item.quantity}</p>
      </div>
      <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:18px;">×</button>
    </div>
  `).join('');
}

// Update cart totals
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 999 ? 0 : subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery;

  document.querySelectorAll('#cartTotal, #rev-sub, #pay-sub').forEach(el => {
    if (el) el.textContent = `₹${subtotal}`;
  });

  document.querySelectorAll('#cartDelivery, #rev-del, #pay-del').forEach(el => {
    if (el) el.textContent = `₹${delivery}`;
  });

  document.querySelectorAll('#cartGrand, #rev-total, #pay-total, #qr-amount, #qr-amount2').forEach(el => {
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
  const fname = document.getElementById('fname')?.value || 'Customer';
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
