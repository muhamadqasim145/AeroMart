// main.js - include on all pages
const STORE_NAME = "AeroMart";
// CART utilities
const CART_KEY = "ecom_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const count = getCart().reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  // Update floating cart button count
  const floatingCartCount = document.getElementById("floating-cart-count");
  if (floatingCartCount) floatingCartCount.textContent = count;
}

function createFloatingCartButton() {
  // Only show on index, wishlist, and orders pages
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allowedPages = ['index.html', 'wishlist.html', 'orders.html'];

  if (!allowedPages.includes(currentPage)) {
    return; // Don't create button on other pages
  }

  // Check if button already exists
  if (document.getElementById("floating-cart-btn")) return;

  const cartButton = document.createElement("button");
  cartButton.id = "floating-cart-btn";
  cartButton.className = "floating-cart-btn";
  cartButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.66L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.5C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
    </svg>
    <span>View Cart</span>
    <span id="floating-cart-count" class="floating-cart-count">0</span>
  `;
  cartButton.addEventListener("click", () => location.href = "cart.html");
  document.body.appendChild(cartButton);

  // Update count on load
  updateCartCount();
}
function addToCart(item, qty = 1, color = null) {
  const cart = getCart();
  const found = cart.find(c => c.id === item.id && (!color || c.color === color));
  if (found) found.qty += qty; else cart.push({ ...item, qty, color });
  saveCart(cart);
  showAddedToCartMessage();
}
function removeFromCart(id) {
  let cart = getCart(); cart = cart.filter(i => i.id !== id); saveCart(cart);
}
function changeQty(id, qty) {
  let cart = getCart();
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty = Math.max(0, qty);
  cart = cart.filter(i => i.qty > 0);
  saveCart(cart);
}
function cartTotal() {
  const cart = getCart();
  return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}
function toast(msg) { // small toast
  let el = document.createElement("div");
  el.textContent = msg; el.style.cssText = "position:fixed;right:18px;bottom:18px;background:var(--accent);color:#000;padding:10px 14px;border-radius:8px;font-weight:700;z-index:9999";
  document.body.appendChild(el);
  setTimeout(() => el.style.opacity = 0, 1500);
  setTimeout(() => el.remove(), 2100);
}

// simple header render (logo, search, cart)
function renderHeader() {
  const root = document.getElementById("site-header");
  if (!root) return;

  // Check if current page is wishlist.html
  // Show search ONLY on index.html (products page)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  // Allow index.html and potentially root path
  const shouldShowSearch = currentPage === 'index.html' || currentPage === '' || currentPage === 'products.html';

  // Restore variables needed for template rendering
  const isWishlistPage = currentPage === 'wishlist.html';

  root.innerHTML = `
  <div class="header" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
  <div class="brand" style="flex-shrink:0">
    <div class="logo">
      <img src="AeroMart.png" alt="AeroMart Logo">
    </div>
    <div>
      <div style="font-size:14px;color:var(--muted)">${STORE_NAME}</div>
    </div>
  </div>

  <div class="search-container" style="display:${shouldShowSearch ? 'flex' : 'none'};align-items:center;justify-content:center;flex:1;margin:0 auto;max-width:700px;width:100%;position:relative">
    <div class="search" style="flex:1;position:relative">
      <input id="site-search" placeholder="Search products, categories..." />
      <button id="search-clear-btn" class="search-clear-btn" title="Clear search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <button id="search-icon-btn" class="search-icon-btn" title="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div id="search-suggestions" class="search-suggestions"></div>
    </div>
    <div style="margin-left:12px;width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);box-shadow:0 4px 12px rgba(42,82,152,0.3);display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;flex-shrink:0;transition:all 0.2s ease" title="Voice Search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    </div>
  </div>

  <div class="header-actions" style="display:flex;align-items:center;gap:8px;flex-shrink:0">
    <a href="wishlist.html" class="wishlist-link" style="display:${isWishlistPage ? 'none' : 'inline-flex'};align-items:center;gap:8px;color:white;text-decoration:none;font-weight:600;font-size:14px;height:44px;padding:0 16px;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);border:none;border-radius:10px;transition:all 0.2s ease;white-space:nowrap;box-shadow:0 4px 12px rgba(42,82,152,0.3)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="wishlist-header-icon">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Wishlist <span id="wishlist-count" style="background:#f44336;color:white;border-radius:10px;padding:2px 6px;font-size:11px;margin-left:2px">0</span>
    </a>
    <a href="orders.html" class="my-orders-link" style="display:inline-flex;align-items:center;gap:8px;color:white;text-decoration:none;font-weight:600;font-size:14px;height:44px;padding:0 16px;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);border:none;border-radius:10px;transition:all 0.2s ease;white-space:nowrap;box-shadow:0 4px 12px rgba(42,82,152,0.3)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      My Orders
    </a>
    <button class="header-icon-btn" onclick="showBuyerNotifications()" title="Notifications" style="position:relative;width:44px;height:44px;border-radius:10px;border:none;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;box-shadow:0 4px 12px rgba(42,82,152,0.3)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="notification-badge" style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:#f44336;border-radius:50%;border:2px solid #fff"></span>
    </button>
    <button class="header-icon-btn" onclick="showBuyerHelp()" title="Help" style="width:44px;height:44px;border-radius:10px;border:none;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;box-shadow:0 4px 12px rgba(42,82,152,0.3)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="user-menu" onclick="showBuyerProfileModal()" style="display:flex;align-items:center;gap:8px;cursor:pointer;height:44px;padding:0 12px;border-radius:10px;transition:all 0.2s ease;min-width:140px;flex-shrink:0;width:auto">
      <div id="buyer-avatar" class="user-avatar" style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:14px;flex-shrink:0">U</div>
      <div class="user-info" style="display:flex;flex-direction:column;min-width:100px;flex:1;width:auto;overflow:visible">
        <div id="buyer-name-display" class="user-name" style="font-size:14px;font-weight:600;color:#1e3c72;white-space:nowrap;overflow:visible;text-overflow:clip;width:auto">Buyer</div>
        <div class="user-role" style="font-size:12px;color:#546e7a;white-space:nowrap;overflow:visible;text-overflow:clip;width:auto">Buyer Account</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;color:#6b7280;margin-left:2px">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="header-icon-btn" onclick="toggleUserMenu(event)" title="Options" style="position:relative;width:38px;height:38px;border-radius:10px;border:none;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;box-shadow:0 4px 12px rgba(42,82,152,0.3);margin-left:-4px">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <!-- Dropdown Menu -->
      <div id="user-dropdown" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:white;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.1);min-width:200px;z-index:9999;border:1px solid #e1e8ed;overflow:hidden">
        <div onclick="confirmLogout(event)" style="padding:12px 16px;display:flex;align-items:center;gap:10px;color:#ef4444;font-weight:600;cursor:pointer;transition:background 0.2s;font-size:14px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Log Out
        </div>
      </div>
    </div>
  </div>
</div>
  </div>
</div>

  `;
  // Smart search with recommendations
  const searchInput = document.getElementById("site-search");
  const suggestionsContainer = document.getElementById("search-suggestions");
  const clearBtn = document.getElementById("search-clear-btn");
  const searchIconBtn = document.getElementById("search-icon-btn");

  function getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    const seen = new Set();

    // Search in products
    PRODUCTS.forEach(product => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const descMatch = product.desc.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);

      if ((titleMatch || descMatch || categoryMatch) && !seen.has(product.id)) {
        seen.add(product.id);
        suggestions.push({
          type: 'product',
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          img: product.img
        });
      }
    });

    // Search in categories
    CATEGORIES.forEach(category => {
      if (category.toLowerCase().includes(lowerQuery) && category !== 'All' && !seen.has(category)) {
        seen.add(category);
        suggestions.push({
          type: 'category',
          title: category,
          category: category
        });
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  function renderSuggestions(suggestions) {
    if (suggestions.length === 0) {
      suggestionsContainer.classList.remove('show');
      return;
    }

    suggestionsContainer.innerHTML = suggestions.map(item => {
      if (item.type === 'product') {
        return `
          <div class="search-suggestion-item" data-product-id="${item.id}">
            <img src="${item.img}" alt="${item.title}" onerror="this.style.display='none'">
            <div class="search-suggestion-item-info">
              <strong>${item.title}</strong>
              <span>${item.category} • $${item.price.toFixed(2)}</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="search-suggestion-item" data-category="${item.category}">
            <div class="search-suggestion-item-info">
              <strong>${item.category}</strong>
              <span>Category</span>
            </div>
          </div>
        `;
      }
    }).join('');

    suggestionsContainer.classList.add('show');

    // Add click handlers
    suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.dataset.productId) {
          const product = PRODUCTS.find(p => p.id === parseInt(item.dataset.productId));
          if (product) {
            openQuick(product);
            suggestionsContainer.classList.remove('show');
            searchInput.value = product.title;
            updateClearButton();
            localStorage.setItem("site_search", product.title);
            window.dispatchEvent(new CustomEvent("site:search", { detail: product.title }));
          }
        } else if (item.dataset.category) {
          localStorage.setItem("site_cat", item.dataset.category);
          window.dispatchEvent(new CustomEvent("site:cat", { detail: item.dataset.category }));
          suggestionsContainer.classList.remove('show');
          searchInput.value = item.dataset.category;
          updateClearButton();
          localStorage.setItem("site_search", item.dataset.category);
          window.dispatchEvent(new CustomEvent("site:search", { detail: item.dataset.category }));
        }
      });
    });
  }

  function updateClearButton() {
    if (searchInput.value.trim().length > 0) {
      clearBtn.classList.add('show');
    } else {
      clearBtn.classList.remove('show');
    }
  }

  function performSearch() {
    const query = searchInput.value.trim();
    localStorage.setItem("site_search", query);
    suggestionsContainer.classList.remove('show');
    window.dispatchEvent(new CustomEvent("site:search", { detail: query }));
  }

  // event wiring
  searchInput.addEventListener("input", e => {
    const query = e.target.value;
    updateClearButton();

    // Show suggestions
    if (query.length >= 2) {
      const suggestions = getSearchSuggestions(query);
      renderSuggestions(suggestions);
    } else {
      suggestionsContainer.classList.remove('show');
    }

    // trigger event for product pages
    window.dispatchEvent(new CustomEvent("site:search", { detail: query }));
  });

  // Clear button
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    updateClearButton();
    localStorage.removeItem("site_search");
    suggestionsContainer.classList.remove('show');
    window.dispatchEvent(new CustomEvent("site:search", { detail: "" }));
    searchInput.focus();
  });

  // Search icon button
  searchIconBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    performSearch();
  });

  // Enter key to search
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target) && !searchIconBtn.contains(e.target)) {
      suggestionsContainer.classList.remove('show');
    }
  });

  // init value
  const prev = localStorage.getItem("site_search") || "";
  searchInput.value = prev;
  updateClearButton();

  updateCartCount();
  updateWishlistCount();

  // Create floating cart button
  createFloatingCartButton();
}

// Star rating helper
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let html = '';
  let starsAdded = 0;

  // Add full stars
  for (let i = 0; i < fullStars && starsAdded < 5; i++) {
    html += '<span style="color:#ffa500;font-size:16px">★</span>';
    starsAdded++;
  }

  // Add half star if needed
  if (hasHalfStar && starsAdded < 5) {
    html += '<span style="color:#ffa500;font-size:16px;opacity:0.5">★</span>';
    starsAdded++;
  }

  // Add empty stars to complete 5 stars
  const emptyStars = 5 - starsAdded;
  for (let i = 0; i < emptyStars; i++) {
    html += '<span style="color:#ccc;font-size:16px">★</span>';
  }

  return html;
}

// Get seller name based on category
function getSellerByCategory(category) {
  const sellerMap = {
    'Equipment': 'Fitness Pro Store',
    'Accessories': 'FitFlex Equipment',
    'Wearables': 'TechFit Solutions',
    'Clothing': 'Active Wear Hub'
  };
  return sellerMap[category] || 'AeroMart Seller';
}

// products listing renderer
function renderProducts(list, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cursor = "pointer";
    div.innerHTML = `
      <div class="imgwrap" style="cursor:pointer;position:relative">
        ${p.modelUrl ? `<iframe src="${p.modelUrl}" style="width:100%;height:100%;border:none;pointer-events:none"></iframe>` : `<img src="${p.img}" alt="${p.title}" class="zoom">`}
      </div>
      <h3>${p.title}</h3>
      <div style="font-size:12px;color:#546e7a;margin:4px 0;display:flex;align-items:center;gap:4px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
        ${getSellerByCategory(p.category)}
      </div>
      <div class="price" style="display:flex;align-items:center;gap:4px">$${p.price.toFixed(2)}</div>
      <div class="muted" style="font-size:12px;margin:2px 0;display:flex;align-items:center;gap:4px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${p.sold || 0} sold
      </div>
      <div style="display:flex;align-items:center;gap:4px;margin:4px 0">
        ${renderStars(p.rating || 0)}
        <span style="font-size:12px;color:#666">(${p.reviews || 0})</span>
      </div>
      <div class="actions" style="margin-top:auto;padding-top:12px">
        <button class="btn add-to-cart-btn" data-id="${p.id}" style="width:100%;display:flex;align-items:center;justify-content:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Add to Cart
        </button>
      </div>
    `;
    // Make entire card clickable (except the button)
    div.addEventListener("click", (e) => {
      if (!e.target.closest(".add-to-cart-btn")) {
        openQuick(p);
      }
    });
    // Add to cart button functionality
    const addBtn = div.querySelector(".add-to-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(p, 1);
      });
    }
    container.appendChild(div);
  });
}

// quick modal with color selection and quantity
function openQuick(p) {
  let modal = document.getElementById("quick-modal");
  let selectedColor = null;
  let quantity = 1;

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "quick-modal";
    modal.innerHTML = `
      <div class="quick-view-modal" style="position:relative">
        <button class="modal-close-btn">×</button>
        <div class="quick-view-left">
          <div class="image-zoom-container">
          <img id="qm-img">
          </div>
        </div>
        <div class="quick-view-right">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <h2 id="qm-title" style="margin-top:8px;flex:1"></h2>
            <button id="qm-wishlist-btn" onclick="toggleWishlistFromModal()" style="background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="qm-wishlist-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div id="qm-seller-info" style="margin:8px 0;padding:14px;background:rgba(42,82,152,0.05);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div style="display:flex;align-items:center;gap:12px;flex:1">
              <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:16px;flex-shrink:0;box-shadow:0 2px 8px rgba(42,82,152,0.3)" id="qm-seller-avatar">S</div>
              <div>
                <div style="font-size:15px;font-weight:700;color:#1e3c72;margin-bottom:2px" id="qm-seller-name">Seller</div>
                <div style="font-size:12px;color:#546e7a;display:flex;align-items:center;gap:4px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Verified Seller
                </div>
              </div>
            </div>
            <button id="qm-start-chat-btn" onclick="openChatModalFromQuickView()" style="padding:12px 20px;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s ease;box-shadow:0 4px 12px rgba(42,82,152,0.3);white-space:nowrap;flex-shrink:0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Start a Chat
            </button>
          </div>
          <div id="qm-cat" class="small muted" style="margin:4px 0;display:flex;align-items:center;gap:4px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
            <span class="price" id="qm-price" style="display:flex;align-items:center;gap:4px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span style="font-size:12px;color:#666">|</span>
            <span style="font-size:12px;color:#666;display:flex;align-items:center;gap:4px" id="qm-sold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;margin:8px 0" id="qm-rating"></div>
          <div style="margin:10px 0">
            <div style="font-weight:600;margin-bottom:6px;color:#1e3c72;font-size:13px;display:flex;align-items:center;gap:6px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Description:
            </div>
            <p id="qm-desc" style="margin:0;line-height:1.6;color:#2c3e50;font-size:13px;text-align:left"></p>
          </div>
          <div style="margin:10px 0">
            <div style="font-weight:600;margin-bottom:6px;color:#1e3c72;font-size:13px;display:flex;align-items:center;gap:6px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 2v20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Color:
            </div>
            <div id="qm-colors" class="color-options"></div>
          </div>
          <div style="margin:10px 0">
            <div style="font-weight:600;margin-bottom:6px;color:#1e3c72;font-size:13px;display:flex;align-items:center;gap:6px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Quantity:
            </div>
            <div class="qty-selector" style="display:flex;align-items:center;gap:12px">
              <button class="btn btn-ghost" id="qm-qty-dec" style="width:40px;height:40px;padding:0;display:flex;align-items:center;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <input type="number" id="qm-qty" value="1" min="1" style="width:60px;text-align:center;padding:8px;border:2px solid #ddd;border-radius:8px;font-size:16px">
              <button class="btn btn-ghost" id="qm-qty-inc" style="width:40px;height:40px;padding:0;display:flex;align-items:center;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:12px">
            <button class="btn" id="qm-buy-now" style="flex:1;height:40px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:6px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Buy Now
            </button>
            <button class="btn btn-ghost" id="qm-add" style="flex:1;height:40px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:6px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Add to Cart
            </button>
          </div>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e1e8ed;width:100%;margin-left:0;padding-left:0">
            <div id="qm-reviews-header" style="font-weight:600;margin-bottom:12px;color:#1e3c72;font-size:15px;display:flex;align-items:center;gap:6px;padding-left:0;margin-left:0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Customer Reviews (${p.reviewList && Array.isArray(p.reviewList) ? p.reviewList.length : 0})
            </div>
            <div id="qm-reviews" style="display:flex;flex-direction:column;gap:12px;width:100%;padding:0;margin:0;margin-left:0;padding-left:0"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close button
    const closeBtn = modal.querySelector(".modal-close-btn");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.classList.remove("open");
      selectedColor = null;
      quantity = 1;
      // Reset zoom when closing
      const imgEl = modal.querySelector("#qm-img");
      if (imgEl) {
        imgEl.style.transform = "scale(1)";
        const container = modal.querySelector(".image-zoom-container");
        if (container) {
          container.style.overflow = "hidden";
        }
      }
    });

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        selectedColor = null;
        quantity = 1;
        // Reset zoom when closing
        const imgEl = modal.querySelector("#qm-img");
        if (imgEl) {
          imgEl.style.transform = "scale(1)";
          const container = modal.querySelector(".image-zoom-container");
          if (container) {
            container.style.overflow = "hidden";
          }
        }
      }
    });

    // Prevent closing when clicking inside modal content
    const modalContent = modal.querySelector(".quick-view-modal");
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Quantity controls
    modal.querySelector("#qm-qty-dec").addEventListener("click", (e) => {
      e.stopPropagation();
      if (quantity > 1) {
        quantity--;
        modal.querySelector("#qm-qty").value = quantity;
      }
    });
    modal.querySelector("#qm-qty-inc").addEventListener("click", (e) => {
      e.stopPropagation();
      quantity++;
      modal.querySelector("#qm-qty").value = quantity;
    });
    modal.querySelector("#qm-qty").addEventListener("input", (e) => {
      e.stopPropagation();
      quantity = Math.max(1, parseInt(e.target.value) || 1);
      e.target.value = quantity;
    });

    // Buy Now - goes directly to checkout
    modal.querySelector("#qm-buy-now").addEventListener("click", (e) => {
      e.stopPropagation();
      // Clear cart and add only this item for Buy Now
      const cart = [];
      cart.push({ ...p, qty: quantity, color: selectedColor });
      saveCart(cart);
      modal.classList.remove("open");
      selectedColor = null;
      quantity = 1;
      setTimeout(() => location.href = "checkout.html", 500);
    });

    // Add to Cart
    modal.querySelector("#qm-add").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p, quantity, selectedColor);
      modal.classList.remove("open");
      selectedColor = null;
      quantity = 1;
    });
  }

  // Update modal content
  const zoomContainer = modal.querySelector(".image-zoom-container");
  let imgElement = null;

  if (p.modelUrl) {
    zoomContainer.innerHTML = `<iframe src="${p.modelUrl}" style="width:100%;height:100%;border:none;min-height:500px"></iframe>`;
  } else {
    if (!zoomContainer.querySelector("#qm-img")) {
      zoomContainer.innerHTML = `<img id="qm-img">`;
    }
    imgElement = modal.querySelector("#qm-img");
    if (imgElement) imgElement.src = p.img;
  }

  modal.querySelector("#qm-title").textContent = p.title;

  // Hover to Zoom functionality
  if (zoomContainer && !p.modelUrl && imgElement) {
    zoomContainer.addEventListener("mousemove", (e) => {
      e.stopPropagation();
      const rect = zoomContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      imgElement.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      imgElement.style.transform = "scale(2)"; // 2x magnification
    });

    zoomContainer.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      imgElement.style.transform = "scale(1)";
      imgElement.style.transformOrigin = "center center";
    });
  }

  // Reset zoom when closing modal (handled in close button handler above)
  // Truncate description to first 250 characters for more detail
  const shortDesc = (p.desc || "").length > 250 ? (p.desc.substring(0, 250) + "...") : (p.desc || "");
  modal.querySelector("#qm-desc").textContent = shortDesc;
  // Update seller info based on category
  const sellerName = getSellerByCategory(p.category);
  const sellerInitial = sellerName.charAt(0).toUpperCase();
  modal.querySelector("#qm-seller-name").textContent = sellerName;
  modal.querySelector("#qm-seller-avatar").textContent = sellerInitial;
  const startChatBtn = modal.querySelector("#qm-start-chat-btn");
  if (startChatBtn) {
    startChatBtn.setAttribute('data-product-id', p.id);
    startChatBtn.setAttribute('data-seller-name', sellerName);
    startChatBtn.setAttribute('data-product-title', p.title);
    // Add hover effect
    startChatBtn.addEventListener('mouseenter', function () {
      this.style.background = 'linear-gradient(135deg, #37e8eb 0%, #2a5298 100%)';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 16px rgba(55, 232, 235, 0.4)';
    });
    startChatBtn.addEventListener('mouseleave', function () {
      this.style.background = 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 12px rgba(42,82,152,0.3)';
    });
  }

  modal.querySelector("#qm-cat").textContent = p.category;
  // Fix price display - preserve SVG icon and add price text with space
  const priceElement = modal.querySelector("#qm-price");
  const priceText = document.createTextNode(` ${p.price.toFixed(2)}`);
  // Clear existing text but keep SVG
  const svg = priceElement.querySelector("svg");
  priceElement.innerHTML = "";
  if (svg) priceElement.appendChild(svg);
  priceElement.appendChild(priceText);
  modal.querySelector("#qm-sold").textContent = `${p.sold || 0} sold`;
  modal.querySelector("#qm-rating").innerHTML = renderStars(p.rating || 0) + ` <span style="font-size:11px;color:#666">(${p.reviews || 0})</span>`;

  // Update wishlist button state
  updateWishlistButtonState(p.id);

  // Display reviews - comfortable and clean design
  const reviewsContainer = modal.querySelector("#qm-reviews");
  const reviewsHeader = modal.querySelector("#qm-reviews-header");

  if (reviewsContainer && p.reviewList && p.reviewList.length > 0) {
    // Update the review count in the header to match actual reviews
    const actualReviewCount = p.reviewList.length;
    if (reviewsHeader) {
      reviewsHeader.textContent = `Customer Reviews (${actualReviewCount})`;
    }

    reviewsContainer.innerHTML = p.reviewList.map(review => `
      <div style="background:#ffffff;border-radius:12px;padding:20px;width:100%;box-sizing:border-box;margin:0;margin-left:0;margin-bottom:16px;border:1px solid #e5e7eb">
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-weight:700;color:#1e3c72;font-size:18px;margin:0">${review.name}</div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:6px">
                ${renderStars(review.rating)}
              </div>
              <div style="display:flex;align-items:center;gap:6px;color:#6b7280;font-size:14px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                ${review.date}
              </div>
            </div>
          </div>
          <div style="color:#374151;font-size:16px;line-height:1.7;margin-top:4px">${review.comment}</div>
        </div>
      </div>
    `).join('');
  } else if (reviewsContainer) {
    // Update header to show 0 reviews
    if (reviewsHeader) {
      reviewsHeader.textContent = `Customer Reviews (0)`;
    }
    reviewsContainer.innerHTML = '<div style="text-align:center;color:#6b7280;padding:40px;font-size:16px;width:100%">No reviews yet</div>';
  }

  // Color options
  const colors = ["Red", "Blue", "White", "Green", "Black"];
  const colorMap = {
    "Red": "#ff0000",
    "Blue": "#0000ff",
    "White": "#ffffff",
    "Green": "#00ff00",
    "Black": "#000000"
  };
  const colorsContainer = modal.querySelector("#qm-colors");
  colorsContainer.innerHTML = "";
  colors.forEach(color => {
    const btn = document.createElement("button");
    btn.className = "color-option";
    btn.style.cssText = `width:45px;height:45px;border-radius:50%;border:3px solid #ccc;background:${colorMap[color]} !important;cursor:pointer;transition:all 0.3s;box-shadow:none !important`;
    btn.dataset.color = color;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedColor = color;
      colorsContainer.querySelectorAll(".color-option").forEach(b => {
        b.classList.remove("selected");
        b.style.borderColor = "#ccc";
        b.style.borderWidth = "3px";
        b.style.boxShadow = "none";
      });
      btn.classList.add("selected");
      btn.style.borderColor = "#1e3c72";
      btn.style.borderWidth = "4px";
      btn.style.boxShadow = "0 0 0 3px rgba(30, 60, 114, 0.2)";
    });
    colorsContainer.appendChild(btn);
  });

  // Reset quantity
  quantity = 1;
  modal.querySelector("#qm-qty").value = 1;
  selectedColor = null;
  colorsContainer.querySelectorAll(".color-option").forEach(b => {
    b.classList.remove("selected");
    b.style.borderColor = "#ccc";
    b.style.borderWidth = "3px";
    b.style.boxShadow = "none";
  });

  modal.classList.add("open");
}

function showAddedToCartMessage() {
  // Remove existing message if any
  const existing = document.getElementById("added-to-cart-msg");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.id = "added-to-cart-msg";
  msg.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(30,60,114,0.95);color:white;padding:16px 28px;border-radius:12px;z-index:10000;display:flex;align-items:center;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,0.4);backdrop-filter:blur(10px)";
  msg.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
    </svg>
    <span style="font-size:15px;font-weight:600">Added to cart successfully!</span>
    <button onclick="location.href='cart.html'" style="background:white;color:#1e3c72;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px;transition:all 0.2s">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
      </svg>
      View Cart
    </button>
  `;
  document.body.appendChild(msg);
  setTimeout(() => {
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    msg.style.transform = "translateX(-50%) scale(0.9)";
    setTimeout(() => msg.remove(), 300);
  }, 2500);
}

// search/filter wiring (pages can listen to "site:search" event)
function wireFilters(catSelector, listRendererSelector) {
  const catWrap = document.querySelector(catSelector);
  if (!catWrap) return;

  const catIcons = {
    "All": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    "Equipment": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="4" height="12" rx="1"></rect><rect x="18" y="6" width="4" height="12" rx="1"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>`,
    "Accessories": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    "Wearables": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="12" height="10" rx="2"></rect><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path><path d="M9 17v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3"></path></svg>`,
    "Clothing": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>`
  };

  catWrap.innerHTML = CATEGORIES.map(c => {
    const icon = catIcons[c] || "";
    return `<button class="btn btn-ghost cat" data-cat="${c}" style="display:inline-flex;align-items:center;gap:6px">${icon} ${c}</button>`
  }).join(" ");
  catWrap.querySelectorAll(".cat").forEach(b => {
    b.addEventListener("click", () => {
      const cat = b.dataset.cat;
      localStorage.setItem("site_cat", cat);
      window.dispatchEvent(new CustomEvent("site:cat", { detail: cat }));
    });
  });
  // handle global search event
  window.addEventListener("site:search", e => {
    applyFilters(listRendererSelector);
  });
  window.addEventListener("site:cat", e => {
    applyFilters(listRendererSelector);
  });

  // Handle price sort event
  window.addEventListener("price:sort", e => {
    applyFilters(listRendererSelector);
  });
}

function applyFilters(renderSelector) {
  const q = (localStorage.getItem("site_search") || "").toLowerCase();
  const cat = (localStorage.getItem("site_cat") || "All");
  const priceSort = localStorage.getItem("price_sort") || "none";

  let filtered = PRODUCTS.filter(p => {
    if (cat !== "All" && p.category !== cat) return false;
    if (q && !(p.title + p.desc + p.category).toLowerCase().includes(q)) return false;
    return true;
  });

  // Apply price sorting
  if (priceSort === "lowest") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (priceSort === "highest") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered, renderSelector);

  // Update sort select if it exists
  const sortSelect = document.getElementById("sort-by-select");
  if (sortSelect) {
    sortSelect.value = priceSort;
  }
}

function togglePriceSort() {
  const currentSort = localStorage.getItem("price_sort") || "none";
  let newSort;

  if (currentSort === "none") {
    newSort = "lowest";
  } else if (currentSort === "lowest") {
    newSort = "highest";
  } else {
    newSort = "none";
  }

  localStorage.setItem("price_sort", newSort);
  window.dispatchEvent(new CustomEvent("price:sort", { detail: newSort }));
  applyFilters("#product-grid");
}

function updatePriceFilterButton() {
  const btn = document.getElementById("price-filter-btn");
  const text = document.getElementById("price-filter-text");
  if (!btn || !text) return;

  const currentSort = localStorage.getItem("price_sort") || "none";

  if (currentSort === "lowest") {
    text.textContent = "Price: Low to High";
    btn.style.background = "linear-gradient(135deg, #37e8eb 0%, #2a5298 100%)";
    btn.title = "Currently sorted: Lowest to Highest. Click to sort: Highest to Lowest";
  } else if (currentSort === "highest") {
    text.textContent = "Price: High to Low";
    btn.style.background = "linear-gradient(135deg, #37e8eb 0%, #2a5298 100%)";
    btn.title = "Currently sorted: Highest to Lowest. Click to remove sort";
  } else {
    text.textContent = "Price";
    btn.style.background = "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)";
    btn.title = "Sort by Price: Lowest to Highest";
  }
}

// CART PAGE helpers
function renderCartTable(tableSelector, subtotalSelector) {
  const container = document.querySelector(tableSelector);
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-message">
        <h3>🛒 Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="index.html" class="btn" style="text-decoration:none">Start Shopping</a>
      </div>
    `;
    if (subtotalSelector) document.querySelector(subtotalSelector).textContent = "$0.00";
    return;
  }
  let html = `<table class="table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead><tbody>`;
  cart.forEach(i => {
    html += `<tr>
      <td><div style="display:flex;gap:12px;align-items:center"><img src="${i.img}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;border:2px solid #e5e7eb"><div><strong style="color:#1e3c72;font-size:16px">${i.title}</strong><div class="small muted" style="margin-top:4px">${i.category}</div></div></div></td>
      <td><div class="qty" style="display:flex;align-items:center;gap:8px;justify-content:center"><button class="btn btn-ghost dec" data-id="${i.id}" style="min-width:32px;padding:6px">-</button><div style="min-width:40px;text-align:center;font-weight:600;color:#1e3c72">${i.qty}</div><button class="btn btn-ghost inc" data-id="${i.id}" style="min-width:32px;padding:6px">+</button></div></td>
      <td style="font-weight:600;color:#1e3c72">$${i.price.toFixed(2)}</td>
      <td style="font-weight:700;color:#1e3c72;font-size:16px">$${(i.price * i.qty).toFixed(2)}</td>
      <td><button class="btn btn-ghost rem" data-id="${i.id}" style="color:#dc2626;background:#fee2e2;padding:8px 16px;border-radius:8px">Remove</button></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
  if (subtotalSelector) document.querySelector(subtotalSelector).textContent = "$" + cartTotal().toFixed(2);

  container.querySelectorAll(".inc").forEach(b => b.addEventListener("click", () => { changeQty(Number(b.dataset.id), findQty(b.dataset.id) + 1); renderCartTable(tableSelector, subtotalSelector); updateCartCount(); if (typeof updateCartSummary === 'function') updateCartSummary(); }));
  container.querySelectorAll(".dec").forEach(b => b.addEventListener("click", () => { changeQty(Number(b.dataset.id), Math.max(1, findQty(b.dataset.id) - 1)); renderCartTable(tableSelector, subtotalSelector); updateCartCount(); if (typeof updateCartSummary === 'function') updateCartSummary(); }));
  container.querySelectorAll(".rem").forEach(b => b.addEventListener("click", () => { if (confirm('Remove this item from your cart?')) { removeFromCart(Number(b.dataset.id)); renderCartTable(tableSelector, subtotalSelector); updateCartCount(); if (typeof updateCartSummary === 'function') updateCartSummary(); } }));
}
function findQty(id) {
  const cart = getCart(); const it = cart.find(c => c.id === Number(id)); return it ? it.qty : 0;
}

// product details page
function renderProductDetails(id, targetSelector) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) { document.querySelector(targetSelector).innerHTML = "<div>Product not found</div>"; return; }
  document.querySelector(targetSelector).innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div><img src="${p.img}" style="width:100%;height:420px;object-fit:cover;border-radius:12px" class="zoom"></div>
      <div>
        <h2>${p.title}</h2>
        <div class="muted">${p.category}</div>
        <h3 style="margin-top:8px" class="price">$${p.price.toFixed(2)}</h3>
        <p class="small" style="margin-top:12px">${p.desc}</p>
        <div style="margin-top:14px" class="row">
          <button class="btn" id="pd-add">Add to cart</button>
          <a class="btn btn-ghost" href="cart.html">Go to cart</a>
        </div>
      </div>
    </div>
  `;
  document.getElementById("pd-add").addEventListener("click", () => addToCart(p, 1));
}

// Buyer Profile Functions
function showBuyerProfileModal() {
  let buyerInfo = JSON.parse(localStorage.getItem('buyerInfo') || '{}');

  let modal = document.getElementById('buyer-profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'buyer-profile-modal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:0;max-width:700px;width:90%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:24px 32px;border-bottom:2px solid #e5e7eb">
        <h2 style="font-size:24px;font-weight:700;color:#1e3c72;margin:0">Buyer Profile Information</h2>
        <button onclick="closeBuyerModal()" style="background:none;border:none;cursor:pointer;color:#6b7280;padding:8px;border-radius:8px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <form id="buyer-profile-form" onsubmit="saveBuyerProfile(event);return false" style="padding:32px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Full Name</label>
            <input type="text" id="buyer-name" value="${buyerInfo.name || ''}" required style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Email</label>
            <input type="email" id="buyer-email" value="${buyerInfo.email || ''}" required style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Mobile Number</label>
            <input type="tel" id="buyer-mobile" value="${buyerInfo.mobile || ''}" required style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">City</label>
            <input type="text" id="buyer-city" value="${buyerInfo.city || ''}" required style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px;grid-column:1/-1">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Address</label>
            <textarea id="buyer-address" required style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box;min-height:100px;resize:vertical;font-family:inherit">${buyerInfo.address || ''}</textarea>
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">State/Province</label>
            <input type="text" id="buyer-state" value="${buyerInfo.state || ''}" style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Postal Code</label>
            <input type="text" id="buyer-postal" value="${buyerInfo.postal || ''}" style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-weight:600;color:#1e3c72;font-size:14px;margin-bottom:8px">Country</label>
            <input type="text" id="buyer-country" value="${buyerInfo.country || ''}" style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:15px;color:#1e3c72 !important;background:#ffffff !important;box-sizing:border-box">
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:24px">
          <button type="submit" style="flex:1;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;border:none;padding:14px 24px;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease">Save Profile</button>
          <button type="button" onclick="closeBuyerModal()" style="background:#f3f4f6;color:#1e3c72;border:none;padding:14px 24px;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease">Cancel</button>
        </div>
      </form>
    </div>
  `;

  modal.style.display = 'flex';
}

function saveBuyerProfile(event) {
  if (event) event.preventDefault();
  const buyerInfo = {
    name: document.getElementById('buyer-name').value,
    email: document.getElementById('buyer-email').value,
    mobile: document.getElementById('buyer-mobile').value,
    city: document.getElementById('buyer-city').value,
    address: document.getElementById('buyer-address').value,
    state: document.getElementById('buyer-state').value,
    postal: document.getElementById('buyer-postal').value,
    country: document.getElementById('buyer-country').value
  };

  localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));
  updateBuyerDisplay();
  closeBuyerModal();
  showBuyerNotification('Profile saved successfully!', 'success', 2000);
}

function updateBuyerDisplay() {
  const buyerInfo = JSON.parse(localStorage.getItem('buyerInfo') || '{}');
  const buyerNameEl = document.getElementById('buyer-name-display');
  const buyerAvatarEl = document.getElementById('buyer-avatar');

  if (buyerNameEl && buyerInfo.name) {
    buyerNameEl.textContent = buyerInfo.name;
  } else if (buyerNameEl && !buyerInfo.name) {
    buyerNameEl.textContent = 'Buyer';
  }
  if (buyerAvatarEl && buyerInfo.name) {
    buyerAvatarEl.textContent = buyerInfo.name.charAt(0).toUpperCase();
  } else if (buyerAvatarEl && !buyerInfo.name) {
    buyerAvatarEl.textContent = 'U';
  }
}

function closeBuyerModal() {
  const modal = document.getElementById('buyer-profile-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Notification System for buyer pages
function showBuyerNotification(message, type = 'success', duration = 2000) {
  let overlay = document.getElementById('notification-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'notification-overlay';
    overlay.className = 'notification-overlay';
    overlay.innerHTML = `
      <div class="notification-box">
        <div class="notification-content" id="notification-content">
          <div class="notification-icon" id="notification-icon"></div>
          <p class="notification-text" id="notification-text"></p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const content = document.getElementById('notification-content');
  const icon = document.getElementById('notification-icon');
  const text = document.getElementById('notification-text');

  if (!content || !icon || !text) return;

  // Set icon type
  icon.className = 'notification-icon';
  if (type === 'error') {
    icon.classList.add('error');
  } else if (type === 'warning') {
    icon.classList.add('warning');
  }

  // Set message
  text.textContent = message;

  // Show notification
  overlay.classList.add('show');

  // Auto-hide after duration
  setTimeout(() => {
    overlay.classList.remove('show');
  }, duration);
}

function showBuyerNotifications() {
  showBuyerNotification('You have 5 new notifications:\n- 3 order updates\n- 2 delivery status changes', 'warning', 3000);
}

function showBuyerHelp() {
  showBuyerNotification('Help Center\n\nFor assistance, please contact:\nEmail: support@aeromart.com\nPhone: 1-800-AEROMART', 'warning', 4000);
}

// Wishlist Functions
const WISHLIST_KEY = 'ecom_wishlist_v1';

function getWishlist() {
  let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

  // Clean wishlist: remove duplicates and invalid entries
  const seenIds = new Set();
  const cleaned = wishlist.filter(item => {
    // Remove invalid entries
    if (!item || !item.id) return false;

    // Remove duplicates
    if (seenIds.has(item.id)) return false;

    seenIds.add(item.id);
    return true;
  });

  // Save cleaned wishlist if duplicates were found
  if (cleaned.length !== wishlist.length) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(cleaned));
  }

  return cleaned;
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function isProductInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

function addToWishlist(product) {
  if (!product || !product.id) return false;

  let wishlist = getWishlist();

  // Remove any existing entry with same ID (prevent duplicates)
  wishlist = wishlist.filter(item => item && item.id !== product.id);

  // Add new item
  wishlist.push({
    id: product.id,
    title: product.title,
    price: product.price,
    img: product.img,
    category: product.category,
    addedDate: new Date().toISOString()
  });

  saveWishlist(wishlist);
  updateWishlistCount();
  showBuyerNotification('Added to Wishlist ❤️', 'success', 2000);
  return true;
}

function removeFromWishlist(productId) {
  if (!productId) return;

  let wishlist = getWishlist();
  // Remove all instances of this product (in case of duplicates)
  const filtered = wishlist.filter(item => item && item.id !== productId);
  saveWishlist(filtered);
  updateWishlistCount();
  showBuyerNotification('Removed from Wishlist', 'success', 2000);
}

function toggleWishlist(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (isProductInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(product);
  }

  // Update heart icon on product card
  updateProductCardWishlistIcon(productId);

  // Update modal wishlist button if modal is open
  updateWishlistButtonState(productId);
}

function toggleWishlistFromModal() {
  const modal = document.getElementById('quick-modal');
  if (!modal) return;

  const title = modal.querySelector('#qm-title').textContent;
  const product = PRODUCTS.find(p => p.title === title);
  if (!product) return;

  toggleWishlist(product.id);
}

function updateWishlistButtonState(productId) {
  const modal = document.getElementById('quick-modal');
  if (!modal) return;

  const btn = modal.querySelector('#qm-wishlist-btn');
  const icon = modal.querySelector('#qm-wishlist-icon');
  if (!btn || !icon) return;

  const isInWishlist = isProductInWishlist(productId);
  icon.setAttribute('fill', isInWishlist ? '#f44336' : 'none');
  icon.setAttribute('stroke', isInWishlist ? '#f44336' : 'currentColor');
  btn.style.color = isInWishlist ? '#f44336' : 'currentColor';
}

function updateProductCardWishlistIcon(productId) {
  // No longer needed since wishlist icon is only in modal
  // This function is kept for compatibility but does nothing
}

function updateWishlistCount() {
  // getWishlist() now always returns cleaned list, so just use it directly
  const wishlist = getWishlist();
  const actualCount = wishlist.length;

  // Update count display
  const countEl = document.getElementById('wishlist-count');
  if (countEl) {
    countEl.textContent = actualCount;
    countEl.style.display = actualCount > 0 ? 'inline-block' : 'none';
  }

  // Update header icon fill - show filled red heart when items exist
  const headerIcon = document.getElementById('wishlist-header-icon');
  if (headerIcon) {
    if (actualCount > 0) {
      headerIcon.setAttribute('fill', '#f44336');
      headerIcon.setAttribute('stroke', '#f44336');
    } else {
      headerIcon.setAttribute('fill', 'none');
      headerIcon.setAttribute('stroke', 'white');
    }
  }
}

// Chat Modal Functions - Get current product from quick view modal
function openChatModalFromQuickView() {
  const modal = document.getElementById("quick-modal");
  if (!modal) return;

  const productId = parseInt(modal.querySelector("#qm-start-chat-btn").getAttribute('data-product-id'));
  const sellerName = modal.querySelector("#qm-start-chat-btn").getAttribute('data-seller-name') || 'Seller';
  const productTitle = modal.querySelector("#qm-start-chat-btn").getAttribute('data-product-title') || '';

  openChatModal(productId, sellerName, productTitle);
}

function openChatModal(productId, sellerName, productTitle) {
  let modal = document.getElementById("chat-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "chat-modal";
    modal.className = "modal-overlay";
    modal.style.cssText = "display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:0;max-width:500px;width:90%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:2px solid #e5e7eb;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);border-radius:16px 16px 0 0">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:16px">${sellerName.charAt(0).toUpperCase()}</div>
          <div>
            <h3 style="margin:0;color:white;font-size:16px;font-weight:600">${sellerName}</h3>
            <p style="margin:0;color:rgba(255,255,255,0.9);font-size:12px">${productTitle}</p>
          </div>
        </div>
        <button onclick="closeChatModal()" style="background:none;border:none;cursor:pointer;color:white;padding:8px;border-radius:8px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div id="chat-messages" style="flex:1;padding:20px;overflow-y:auto;min-height:200px;max-height:400px;background:#f9fafb">
      </div>
      <div style="padding:16px 20px;border-top:2px solid #e5e7eb;background:white;border-radius:0 0 16px 16px">
        <div style="display:flex;gap:8px;align-items:flex-end">
          <textarea id="chat-message-input" placeholder="Type your message..." style="flex:1;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:14px;font-family:inherit;resize:none;min-height:44px;max-height:120px;color:#1e3c72" rows="1"></textarea>
          <button onclick="sendMessage(${productId}, '${sellerName.replace(/'/g, "\\'")}', '${productTitle.replace(/'/g, "\\'")}')" style="padding:12px 20px;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:6px;min-width:80px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  // Load message history
  loadChatHistory(productId, sellerName);

  // Auto-resize textarea
  const textarea = document.getElementById("chat-message-input");
  if (textarea) {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(productId, sellerName, productTitle);
      }
    });
  }
}

function loadChatHistory(productId, sellerName) {
  const messagesContainer = document.getElementById("chat-messages");
  if (!messagesContainer) return;

  const chatKey = `chat_${productId}_${sellerName}`;
  const history = JSON.parse(localStorage.getItem(chatKey) || '[]');

  if (history.length === 0) {
    messagesContainer.innerHTML = `
      <div style="text-align:center;color:#8b9dc3;font-size:14px;padding:20px">
        Start a conversation with ${sellerName}
      </div>
    `;
    return;
  }

  messagesContainer.innerHTML = history.map(msg => {
    const isBuyer = msg.sender === 'buyer';
    return `
      <div style="display:flex;justify-content:${isBuyer ? 'flex-end' : 'flex-start'};margin-bottom:12px">
        <div style="max-width:70%;background:${isBuyer ? 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)' : '#ffffff'};color:${isBuyer ? 'white' : '#1e3c72'};padding:12px 16px;border-radius:${isBuyer ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};font-size:14px;line-height:1.5;word-wrap:break-word;border:${isBuyer ? 'none' : '1px solid #e5e7eb'};box-shadow:${isBuyer ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'}">
          ${msg.text.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }).join('');

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage(productId, sellerName, productTitle) {
  const input = document.getElementById("chat-message-input");
  const messagesContainer = document.getElementById("chat-messages");

  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  const chatKey = `chat_${productId}_${sellerName}`;

  // Load existing history
  const history = JSON.parse(localStorage.getItem(chatKey) || '[]');

  // Add new message to history
  const newMessage = {
    sender: 'buyer',
    text: message,
    timestamp: new Date().toISOString()
  };
  history.push(newMessage);

  // Save to localStorage
  localStorage.setItem(chatKey, JSON.stringify(history));

  // Add buyer message to chat UI
  const messageDiv = document.createElement("div");
  messageDiv.style.cssText = "display:flex;justify-content:flex-end;margin-bottom:12px";
  messageDiv.innerHTML = `
    <div style="max-width:70%;background:linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);color:white;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:14px;line-height:1.5;word-wrap:break-word">
      ${message.replace(/\n/g, '<br>')}
    </div>
  `;

  // Remove "Start a conversation" message if it exists
  const startMsg = messagesContainer.querySelector('div[style*="text-align:center"]');
  if (startMsg) startMsg.remove();

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Clear input
  input.value = "";
  input.style.height = "auto";

  // Show "Message sent" confirmation
  setTimeout(() => {
    const sentDiv = document.createElement("div");
    sentDiv.style.cssText = "text-align:center;color:#37e8eb;font-size:12px;font-weight:600;padding:8px;margin-top:8px;background:rgba(55,232,235,0.1);border-radius:8px";
    sentDiv.innerHTML = "✓ Message sent successfully!";
    messagesContainer.appendChild(sentDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Remove confirmation after 3 seconds
    setTimeout(() => {
      sentDiv.remove();
    }, 3000);
  }, 500);
}

function closeChatModal() {
  const modal = document.getElementById("chat-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modal on outside click
document.addEventListener("click", function (e) {
  const modal = document.getElementById("chat-modal");
  if (modal && e.target === modal) {
    closeChatModal();
  }
});
// Toggle user menu dropdown
function toggleUserMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    const isVisible = dropdown.style.display === "block";
    // Close other dropdowns if any (not implemented but good practice)
    dropdown.style.display = isVisible ? "none" : "block";

    // Add click outside listener if opening
    if (!isVisible) {
      document.addEventListener('click', closeUserMenuOutside);
    }
  }
}

function closeUserMenuOutside(e) {
  const dropdown = document.getElementById("user-dropdown");
  const userMenu = document.querySelector(".user-menu");
  if (dropdown && userMenu && !userMenu.contains(e.target)) {
    dropdown.style.display = "none";
    document.removeEventListener('click', closeUserMenuOutside);
  }
}

// Confirm and logout
function confirmLogout(e) {
  e.stopPropagation();
  if (confirm("Are you sure you want to log out?")) {
    // Perform logout
    alert("You have been logged out successfully.");
    // Redirect to login page
    location.href = "login.html";
  }
}


// on load
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  updateCartCount();
  createFloatingCartButton();
  updateBuyerDisplay();
});

