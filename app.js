const categoryColors = {
  Fiction:      { bg: '#ff6b6b', text: '#fff' },
  Science:      { bg: '#f9ca24', text: '#333' },
  Children:     { bg: '#48dbfb', text: '#333' },
  Romance:      { bg: '#ff9ff3', text: '#333' },
  History:      { bg: '#54a0ff', text: '#fff' },
  'Self-Help':  { bg: '#5f27cd', text: '#fff' },
  Competitive:  { bg: '#e67e22', text: '#fff' },
  Biography:    { bg: '#00b894', text: '#fff' },
  Religion:     { bg: '#d63031', text: '#fff' }
};

const books = [
  // ── FICTION ──
  { id:1,  title:"The God of Small Things",    author:"Arundhati Roy",          category:"Fiction",     price:299, oldPrice:450, stars:5, img:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80" },
  { id:2,  title:"A Suitable Boy",             author:"Vikram Seth",            category:"Fiction",     price:599, oldPrice:899, stars:5, img:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
  { id:3,  title:"The White Tiger",            author:"Aravind Adiga",          category:"Fiction",     price:349, oldPrice:499, stars:4, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80" },
  { id:4,  title:"Midnight's Children",        author:"Salman Rushdie",         category:"Fiction",     price:499, oldPrice:699, stars:5, img:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80" },
  { id:5,  title:"2 States",                   author:"Chetan Bhagat",          category:"Fiction",     price:199, oldPrice:299, stars:4, img:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80" },

  // ── SCIENCE ──
  { id:6,  title:"Wings of Fire",              author:"A.P.J. Abdul Kalam",     category:"Science",     price:199, oldPrice:350, stars:5, img:"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80" },
  { id:7,  title:"Ignited Minds",              author:"A.P.J. Abdul Kalam",     category:"Science",     price:175, oldPrice:299, stars:5, img:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80" },
  { id:8,  title:"The Aryabhata Principle",    author:"Ravi Mantha",            category:"Science",     price:299, oldPrice:450, stars:4, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id:9,  title:"India 2020",                 author:"A.P.J. Abdul Kalam",     category:"Science",     price:225, oldPrice:375, stars:4, img:"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80" },

  // ── CHILDREN ──
  { id:10, title:"Goosebumps: Indian Edition", author:"Ruskin Bond",            category:"Children",    price:149, oldPrice:249, stars:5, img:"https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&q=80" },
  { id:11, title:"Malgudi Days",               author:"R.K. Narayan",           category:"Children",    price:175, oldPrice:275, stars:5, img:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80" },
  { id:12, title:"The Room on the Roof",       author:"Ruskin Bond",            category:"Children",    price:165, oldPrice:250, stars:4, img:"https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80" },
  { id:13, title:"Panchatantra Tales",         author:"Vishnu Sharma",          category:"Children",    price:120, oldPrice:199, stars:5, img:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80" },

  // ── ROMANCE ──
  { id:14, title:"The Rozabal Line",           author:"Ashwin Sanghi",          category:"Romance",     price:299, oldPrice:450, stars:4, img:"https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&q=80" },
  { id:15, title:"Can Love Happen Twice?",     author:"Ravinder Singh",         category:"Romance",     price:199, oldPrice:299, stars:4, img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },
  { id:16, title:"I Too Had a Love Story",     author:"Ravinder Singh",         category:"Romance",     price:175, oldPrice:275, stars:5, img:"https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80" },
  { id:17, title:"Half Girlfriend",            author:"Chetan Bhagat",          category:"Romance",     price:199, oldPrice:299, stars:4, img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80" },

  // ── HISTORY ──
  { id:18, title:"The Discovery of India",     author:"Jawaharlal Nehru",       category:"History",     price:399, oldPrice:599, stars:5, img:"https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400&q=80" },
  { id:19, title:"India After Gandhi",         author:"Ramachandra Guha",       category:"History",     price:599, oldPrice:899, stars:5, img:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80" },
  { id:20, title:"The Last Mughal",            author:"William Dalrymple",      category:"History",     price:499, oldPrice:750, stars:4, img:"https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80" },
  { id:21, title:"Freedom at Midnight",        author:"Collins & Lapierre",     category:"History",     price:349, oldPrice:550, stars:5, img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80" },

  // ── SELF-HELP ──
  { id:22, title:"You Can Win",                author:"Shiv Khera",             category:"Self-Help",   price:249, oldPrice:399, stars:5, img:"https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=400&q=80" },
  { id:23, title:"The Monk Who Sold His Ferrari", author:"Robin Sharma",        category:"Self-Help",   price:299, oldPrice:450, stars:5, img:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80" },
  { id:24, title:"Rich Dad Poor Dad",          author:"Robert Kiyosaki",        category:"Self-Help",   price:349, oldPrice:550, stars:4, img:"https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80" },
  { id:25, title:"The Secret",                 author:"Rhonda Byrne",           category:"Self-Help",   price:275, oldPrice:425, stars:4, img:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" },

  // ── COMPETITIVE EXAMS ──
  { id:26, title:"UPSC Civil Services GS Paper 1", author:"M. Laxmikanth",     category:"Competitive", price:649, oldPrice:950, stars:5, img:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" },
  { id:27, title:"Indian Polity",              author:"M. Laxmikanth",          category:"Competitive", price:599, oldPrice:850, stars:5, img:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80" },
  { id:28, title:"Quantitative Aptitude",      author:"R.S. Aggarwal",          category:"Competitive", price:499, oldPrice:750, stars:5, img:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80" },
  { id:29, title:"A Modern Approach to Verbal Reasoning", author:"R.S. Aggarwal", category:"Competitive", price:449, oldPrice:650, stars:4, img:"https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80" },
  { id:30, title:"SSC CGL Complete Guide",     author:"Arihant Experts",        category:"Competitive", price:399, oldPrice:599, stars:4, img:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80" },
  { id:31, title:"IBPS Bank PO Guide",         author:"Disha Experts",          category:"Competitive", price:449, oldPrice:699, stars:4, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id:32, title:"NEET Biology Masterclass",   author:"DC Pandey",              category:"Competitive", price:549, oldPrice:799, stars:5, img:"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80" },
  { id:33, title:"JEE Main & Advanced Physics",author:"H.C. Verma",             category:"Competitive", price:599, oldPrice:899, stars:5, img:"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80" },
  { id:34, title:"CAT Preparation Guide",      author:"Arun Sharma",            category:"Competitive", price:499, oldPrice:750, stars:4, img:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80" },
  { id:35, title:"RRB NTPC Complete Study",    author:"Kiran Prakashan",        category:"Competitive", price:349, oldPrice:550, stars:4, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80" },

  // ── BIOGRAPHY ──
  { id:36, title:"My Experiments with Truth",  author:"Mahatma Gandhi",         category:"Biography",   price:199, oldPrice:350, stars:5, img:"https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400&q=80" },
  { id:37, title:"The Story of My Life",       author:"Jawaharlal Nehru",       category:"Biography",   price:299, oldPrice:450, stars:5, img:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80" },
  { id:38, title:"Playing It My Way",          author:"Sachin Tendulkar",       category:"Biography",   price:499, oldPrice:750, stars:5, img:"https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80" },
  { id:39, title:"Unbreakable",                author:"Mary Kom",               category:"Biography",   price:299, oldPrice:450, stars:4, img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80" },

  // ── RELIGION & SPIRITUALITY ──
  { id:40, title:"Bhagavad Gita As It Is",     author:"A.C. Bhaktivedanta Swami", category:"Religion",  price:299, oldPrice:499, stars:5, img:"https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&q=80" },
  { id:41, title:"The Ramayana",               author:"Valmiki (Translated)",   category:"Religion",    price:349, oldPrice:550, stars:5, img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },
  { id:42, title:"Autobiography of a Yogi",    author:"Paramahansa Yogananda",  category:"Religion",    price:399, oldPrice:599, stars:5, img:"https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80" },
  { id:43, title:"The Mahabharata",            author:"C. Rajagopalachari",     category:"Religion",    price:449, oldPrice:699, stars:5, img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80" }
];

let cart = [];
let activeFilter = 'All';
let searchQuery = '';

// ── RENDER ──
function renderBooks(filter = activeFilter, query = searchQuery) {
  let list = filter === 'All' ? books : books.filter(b => b.category === filter);
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('booksGrid');
  const noResult = document.getElementById('noResult');

  if (!list.length) {
    grid.innerHTML = '';
    noResult.style.display = 'block';
    return;
  }
  noResult.style.display = 'none';

  grid.innerHTML = list.map(b => {
    const cat = categoryColors[b.category];
    const discount = Math.round((1 - b.price / b.oldPrice) * 100);
    const titleHL  = highlight(b.title, query);
    const authorHL = highlight(b.author, query);
    return `
    <div class="book-card">
      <div style="position:relative">
        <img src="${b.img}" alt="${b.title}" loading="lazy"/>
        <span class="discount-badge">-${discount}%</span>
      </div>
      <div class="book-info">
        <span class="book-card-category" style="background:${cat.bg};color:${cat.text}">${b.category}</span>
        <h4>${titleHL}</h4>
        <p class="author">✍️ ${authorHL}</p>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)}</div>
        <span class="price">₹${b.price}</span>
        <span class="old-price">₹${b.oldPrice}</span>
        <button class="add-cart-btn" onclick="addToCart(${b.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>`;
  }).join('');
}

function highlight(text, query) {
  if (!query.trim()) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

// ── SEARCH ──
function searchBooks(val) {
  searchQuery = val;
  document.getElementById('clearBtn').style.display = val ? 'flex' : 'none';
  renderBooks(activeFilter, val);
  document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  renderBooks(activeFilter, '');
}

// ── FILTER ──
function filterBooks(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.classList.toggle('active', btn.textContent.trim() === cat || (cat === 'All' && btn.textContent.trim() === 'All'))
  );
  renderBooks(cat, searchQuery);
  document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// ── CART ──
let deliveryCharge = 49;

function addToCart(id) {
  const book = books.find(b => b.id === id);
  const existing = cart.find(c => c.id === id);
  existing ? existing.qty++ : cart.push({ ...book, qty: 1 });
  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function updateCart() {
  const count  = cart.reduce((s, c) => s + c.qty, 0);
  const sub    = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const del    = cart.length ? deliveryCharge : 0;
  const grand  = sub + del;

  document.getElementById('cartCount').textContent   = count;
  document.getElementById('cartTotal').textContent   = `₹${sub}`;
  document.getElementById('cartDelivery').textContent = del === 0 ? '₹0' : `₹${del}`;
  document.getElementById('cartGrand').textContent   = `₹${grand}`;

  document.getElementById('cartItems').innerHTML = cart.length
    ? cart.map(c => `
        <div class="cart-item">
          <img src="${c.img}" alt="${c.title}"/>
          <div class="cart-item-info">
            <h5>${c.title}</h5>
            <p>₹${c.price} × ${c.qty} = ₹${c.price * c.qty}</p>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${c.id})"><i class="fas fa-trash"></i></button>
        </div>`).join('')
    : '<p style="color:#aaa;text-align:center;margin-top:2rem">Your cart is empty</p>';
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}

function toggleCart() {
  const isOpen = document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show', isOpen);
}

function closeAll() {
  // overlay click only closes the cart sidebar
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ── CHECKOUT ──
function openCheckout() {
  if (!cart.length) return alert('Your cart is empty!');
  // close cart sidebar and overlay first
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  populateReview();
  goStep(1);
  document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function goStep(n) {
  [1,2,3,4].forEach(i => {
    document.getElementById(`checkStep${i}`).style.display = i === n ? 'block' : 'none';
    const ind = document.getElementById(`step${i}ind`);
    ind.classList.remove('active','done');
    if (i < n)  ind.classList.add('done');
    if (i === n) ind.classList.add('active');
  });
}

function populateReview() {
  const sub = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const del = deliveryCharge;
  document.getElementById('orderReviewList').innerHTML = cart.map(c => `
    <div class="review-item">
      <img src="${c.img}" alt="${c.title}"/>
      <div class="review-item-info">
        <h5>${c.title}</h5>
        <p>${c.author} &nbsp;·&nbsp; Qty: ${c.qty}</p>
      </div>
      <span class="review-item-price">₹${c.price * c.qty}</span>
    </div>`).join('');
  document.getElementById('rev-sub').textContent   = `₹${sub}`;
  document.getElementById('rev-del').textContent   = `₹${del}`;
  document.getElementById('rev-total').textContent = `₹${sub + del}`;
}

function updateDelivery(val) {
  deliveryCharge = val === 'express' ? 99 : val === 'free' ? 0 : 49;
  updateCart();
  const sub = cart.reduce((s,c) => s+c.price*c.qty, 0);
  ['pay-sub','pay-del','pay-total'].forEach(() => {});
  document.getElementById('pay-sub')   && (document.getElementById('pay-sub').textContent   = `₹${sub}`);
  document.getElementById('pay-del')   && (document.getElementById('pay-del').textContent   = `₹${deliveryCharge}`);
  document.getElementById('pay-total') && (document.getElementById('pay-total').textContent = `₹${sub + deliveryCharge}`);
}

function validateDelivery() {
  const fields = ['fname','lname','mobile','address','city','state','pincode'];
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  const pin = document.getElementById('pincode').value;
  if (pin && !/^\d{6}$/.test(pin)) {
    document.getElementById('pincode').classList.add('error');
    valid = false;
  }
  const mob = document.getElementById('mobile').value;
  if (mob && !/^[+\d]{10,13}$/.test(mob.replace(/\s/g,''))) {
    document.getElementById('mobile').classList.add('error');
    valid = false;
  }
  if (!valid) { alert('Please fill all required fields correctly.'); return; }
  const sub   = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const total = sub + deliveryCharge;

  // populate payment step
  document.getElementById('pay-sub').textContent   = `₹${sub}`;
  document.getElementById('pay-del').textContent   = `₹${deliveryCharge}`;
  document.getElementById('pay-total').textContent = `₹${total}`;
  document.getElementById('qr-amount').textContent  = `₹${total}`;
  document.getElementById('qr-amount2').textContent = `₹${total}`;

  // generate QR code via free API — encodes a UPI payment link
  const upiLink = `upi://pay?pa=7020121893@upi&pn=Yash+Enterprises+Online&am=${total}&cu=INR&tn=Book+Order`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}&color=6c3483&bgcolor=ffffff&margin=6`;
  document.getElementById('qrImg').src = qrUrl;

  goStep(3);
}

function copyUPI() {
  navigator.clipboard.writeText('7020121893@upi').then(() => {
    alert('UPI ID copied: 7020121893@upi');
  });
}

function placeOrder() {
  const name    = `${document.getElementById('fname').value} ${document.getElementById('lname').value}`;
  const mobile  = document.getElementById('mobile').value;
  const address = document.getElementById('address').value;
  const city    = document.getElementById('city').value;
  const state   = document.getElementById('state').value;
  const pin     = document.getElementById('pincode').value;
  const sub     = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const total   = sub + deliveryCharge;
  const orderId = 'YEO' + Date.now().toString().slice(-6);

  document.getElementById('confirmMsg').textContent =
    `Thank you, ${name.split(' ')[0]}! Your order #${orderId} has been placed.`;
  document.getElementById('confirmDetails').innerHTML = `
    <b>Order ID:</b> #${orderId}<br/>
    <b>Items:</b> ${cart.reduce((s,c)=>s+c.qty,0)} book(s)<br/>
    <b>Deliver to:</b> ${address}, ${city}, ${state} – ${pin}<br/>
    <b>Mobile:</b> ${mobile}<br/>
    <b>Payment:</b> UPI / QR Code<br/>
    <b>Amount Paid:</b> ₹${total}<br/>
    <b>Estimated Delivery:</b> ${deliveryCharge===99?'2–3':deliveryCharge===0?'7–10':'5–7'} business days
  `;
  goStep(4);
  cart = [];
  deliveryCharge = 49;
  updateCart();
  document.getElementById('deliveryForm').reset();
}

function submitForm(e) {
  e.preventDefault();
  alert('✅ Message sent! We will get back to you soon.\nEmail: info@yashenterprisesonline.in');
  e.target.reset();
}

renderBooks();
