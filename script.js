/* ==========================================================
   CLEAN CATALOG POPUP MODAL SYSTEM
   ========================================================== */
var catalogModal = document.getElementById("catalog-modal");
var catalogGrid = document.getElementById("catalog-grid");
var currentCatalogType = "books"; 
// Extract books from DOM
function getModalBooksData() {
    var bookCards = document.querySelectorAll("#books-slider .book-box");
    var books = [];
    bookCards.forEach(function (box) {
        var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
        var tag = box.querySelector(".book-tag") ? box.querySelector(".book-tag").textContent.trim() : "";
        var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
        var author = box.querySelector(".book-author") ? box.querySelector(".book-author").textContent.trim() : "";
        var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";
        books.push({ type: "book", tag: tag, title: title, author: author, desc: desc, img: img });
    });
    return books;
}
// Extract menu from DOM
function getModalMenuData() {
    var menuCards = document.querySelectorAll("#products-slider .product-box");
    var items = [];
    menuCards.forEach(function (box) {
        var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
        var tag = box.querySelector(".item-tag") ? box.querySelector(".item-tag").textContent.trim() : "";
        var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
        var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";
        var price = box.querySelector("strong") ? box.querySelector("strong").textContent.trim() : "";
        var addBtn = box.querySelector(".add-cart-btn");
        var rawPrice = addBtn ? addBtn.getAttribute("data-price") : 200;
        items.push({ type: "menu", tag: tag, title: title, desc: desc, img: img, price: price, rawPrice: rawPrice });
    });
    return items;
}
window.openCatalogModal = function (type) {
    if (!catalogModal) catalogModal = document.getElementById("catalog-modal");
    if (!catalogGrid) catalogGrid = document.getElementById("catalog-grid");
    if (!catalogModal) return;
    currentCatalogType = type === "menu" ? "menu" : "books";
    var titleEl = document.getElementById("catalog-modal-title");
    var items = [];
    if (currentCatalogType === "books") {
        if (titleEl) titleEl.textContent = "Complete Library";
        items = getModalBooksData();
    } else {
        if (titleEl) titleEl.textContent = "Complete Menu";
        items = getModalMenuData();
    }
    renderModalCards(items);
    catalogModal.classList.add("active");
    document.body.style.overflow = "hidden";
};
window.closeCatalogModal = function () {
    if (!catalogModal) return;
    catalogModal.classList.remove("active");
    document.body.style.overflow = "auto";
};
// Close on backdrop click
document.addEventListener("click", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("catalog-modal-overlay")) {
        closeCatalogModal();
    }
});
// Close on ESC key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCatalogModal();
});
function renderModalCards(items) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = items.map(item => `
        <div class="catalog-card">
            <div class="catalog-card-img-wrap">
                <img src="${item.img}" alt="${item.title}">${item.tag ? `<span class="catalog-card-tag">${item.tag}</span>` : ''}
            </div>
            <div class="catalog-card-body">
                <h3 class="catalog-card-title">${item.title}</h3>
                ${item.type === 'book' && item.author ? `<span class="catalog-card-subtitle">by ${item.author}</span>` : ''}
                <p class="catalog-card-desc">${item.desc}</p>
                <div class="catalog-card-footer">
                    ${item.type === 'book' 
                        ? `<span class="catalog-free-read-tag"><i class="bx bx-book-open"></i> Free Read</span><button class="catalog-card-btn" onclick="modalBookReserve('${item.title.replace(/'/g, "\\'")}')"><i class="bx bx-bookmark"></i> Read in Nook</button>`
                        : `<span class="catalog-card-price">${item.price}</span><button class="catalog-card-btn" onclick="modalAddCart('${item.title.replace(/'/g, "\\'")}', ${item.rawPrice}, this)"><i class="bx bx-cart-add"></i> Add to Cart</button>`}
                </div>
            </div>
        </div>`).join('');
}
window.modalBookReserve = function (title) {
    closeCatalogModal();
    if (typeof reserveBookForNook === "function") reserveBookForNook(title);
};
window.modalAddCart = function (title, price, btn) {
    var existing = typeof getCartItem === "function" ? getCartItem(title) : null;
    if (existing) { existing.qty++; } else {
        if (typeof cart !== "undefined") cart.push({ name: title, price: price, qty: 1 });
    }
    if (typeof renderCart === "function") renderCart();
    if (typeof showCafeToast === "function") showCafeToast('Added "' + title + '" to your order!');
    var origHTML = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-check'></i> Added";
    btn.style.background = "#2e7d32";
    btn.style.color = "#fff";
    btn.style.borderColor = "#2e7d32";
    setTimeout(function () {
        btn.innerHTML = origHTML;
        btn.style.background = "";
        btn.style.color = "";
        btn.style.borderColor = "";
    }, 1200);
};
document.addEventListener("DOMContentLoaded", function () {
    /* NOOKS SLIDER CONTROLS */
    var nooksSlider = document.getElementById("nooks-slider");
    var nooksPrevBtn = document.getElementById("nooks-prev-btn");
    var nooksNextBtn = document.getElementById("nooks-next-btn");
    if (nooksSlider && nooksPrevBtn && nooksNextBtn) {
        nooksPrevBtn.addEventListener("click", function () {
            var scrollAmount = window.innerWidth < 768 ? 300 : 350;
            nooksSlider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
        nooksNextBtn.addEventListener("click", function () {
            var scrollAmount = window.innerWidth < 768 ? 300 : 350;
            nooksSlider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    }
    /* HOME SLIDESHOW */
    var slides = document.querySelectorAll(".home-slide");
    var dots = document.querySelectorAll(".dot");
    var currentSlide = 0;
    var slideInterval;
    function showSlide(index) {
        if (!slides.length) return;
        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });
        dots.forEach(function (dot) {
            dot.classList.remove("active");
        });
        slides[index].classList.add("active");
        if (dots[index]) { dots[index].classList.add("active"); }
        currentSlide = index;
    }
    function nextSlide() {
        var next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 4500);
    }
    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = parseInt(this.getAttribute("data-slide"));
            clearInterval(slideInterval);
            showSlide(index);
            startSlideshow();
        });
    });
    if (slides.length > 0) { startSlideshow(); }
    /* MENU CATEGORY FILTER */
    var catButtons = document.querySelectorAll(".cat-btn");
    var productBoxes = document.querySelectorAll(".product-box");
    var slider = document.getElementById("products-slider");
    var prevBtn = document.getElementById("prev-btn");
    var nextBtn = document.getElementById("next-btn");
    function filterMenuCategory(category) {
        catButtons.forEach(function (button) {
            if (button.getAttribute("data-category") === category) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
        productBoxes.forEach(function (box) {
            var itemCategory = box.getAttribute("data-category");
            if (category === "all" || itemCategory === category) { box.classList.remove("hide"); } else {
                box.classList.add("hide");
            }
        });
        if (slider) { slider.scrollLeft = 0; }
    }
    function updateCategoryCounts() {
        catButtons.forEach(function (button) {
            var cat = button.getAttribute("data-category");
            var countSpan = button.querySelector(".cat-count");
            if (countSpan) {
                if (cat === "all") { countSpan.textContent = productBoxes.length; } else {
                    var count = document.querySelectorAll('.product-box[data-category="' + cat + '"]').length;
                    countSpan.textContent = count;
  }
}
        });
    }
    updateCategoryCounts();
    catButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var category = this.getAttribute("data-category");
            filterMenuCategory(category);
        });
    });
    /* MENU SLIDER */
    if (slider && prevBtn && nextBtn) {
        function getScrollAmount() {
            var visibleBox = slider.querySelector(".product-box:not(.hide)");
            if (visibleBox) { return (visibleBox.offsetWidth + 22) * 2; }
            return 320;
        }
        nextBtn.addEventListener("click", function () {
            slider.scrollBy({
                left: getScrollAmount(),
                behavior: "smooth"
            });
        });
        prevBtn.addEventListener("click", function () {
            slider.scrollBy({
                left: -getScrollAmount(),
                behavior: "smooth"
            });
        });
    }
    /* CURATED CAFÉ LIBRARY (BOOKS) */
    var bookCatButtons = document.querySelectorAll(".book-cat-btn");
    var bookBoxes = document.querySelectorAll(".book-box");
    var booksSlider = document.getElementById("books-slider");
    var booksPrevBtn = document.getElementById("books-prev-btn");
    var booksNextBtn = document.getElementById("books-next-btn");
    function filterBookGenre(genre) {
        bookCatButtons.forEach(function (button) {
            if (button.getAttribute("data-genre") === genre) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
        bookBoxes.forEach(function (box) {
            var itemGenre = box.getAttribute("data-genre");
            if (genre === "all" || itemGenre === genre) { box.classList.remove("hide"); } else {
                box.classList.add("hide");
            }
        });
        if (booksSlider) { booksSlider.scrollTo({
                left: 0,
                behavior: "smooth"
            }); }
    }
    function updateBookCategoryCounts() {
        bookCatButtons.forEach(function (button) {
            var g = button.getAttribute("data-genre");
            var countSpan = button.querySelector(".book-cat-count");
            if (countSpan) {
                if (g === "all") { countSpan.textContent = bookBoxes.length; } else {
                    var count = document.querySelectorAll('.book-box[data-genre="' + g + '"]').length;
                    countSpan.textContent = count;
  }
}
        });
    }
    updateBookCategoryCounts();
    bookCatButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var genre = this.getAttribute("data-genre");
            filterBookGenre(genre);
        });
    });
    if (booksSlider && booksPrevBtn && booksNextBtn) {
        function getBookScrollAmount() {
            var visibleBox = booksSlider.querySelector(".book-box:not(.hide)");
            if (visibleBox) { return (visibleBox.offsetWidth + 24) * 2; }
            return 300 * 2;
        }
        booksNextBtn.addEventListener("click", function () {
            booksSlider.scrollBy({
                left: getBookScrollAmount(),
                behavior: "smooth"
            });
        });
        booksPrevBtn.addEventListener("click", function () {
            booksSlider.scrollBy({
                left: -getBookScrollAmount(),
                behavior: "smooth"
            });
        });
    }
    window.scrollBooksToStart = function () {
        if (booksSlider) { booksSlider.scrollTo({
                left: 0,
                behavior: "smooth"
            }); }
    };
    window.scrollBooksNext = function () {
        if (booksSlider) {
            var visibleBox = booksSlider.querySelector(".book-box:not(.hide)");
            var amt = visibleBox ? (visibleBox.offsetWidth + 24) * 2 : 600;
            booksSlider.scrollBy({
                left: amt,
                behavior: "smooth"
            });
        }
    };
    window.reserveBookForNook = function (bookTitle) {
        var resSection = document.getElementById("reservation");
        if (resSection) { resSection.scrollIntoView({ behavior: "smooth" }); }
        var nookSelect = document.getElementById("nook-select");
        if (nookSelect && (!nookSelect.value || nookSelect.value === "")) {
            nookSelect.selectedIndex = 2; // Library Bookshelf Corner by default
        }
        var bookSelect = document.getElementById("book-select");
        if (bookSelect && bookTitle) {
            var found = false;
            for (var i = 0; i < bookSelect.options.length; i++) {
                if (bookSelect.options[i].value.toLowerCase().includes(bookTitle.toLowerCase()) || 
                    bookTitle.toLowerCase().includes(bookSelect.options[i].value.toLowerCase())) {
                    bookSelect.selectedIndex = i;
                    found = true;
                    break;
  }
}
            if (!found) {
                // If not found in preset options, create and select it
                var newOpt = document.createElement("option");
                newOpt.value = bookTitle;
                newOpt.textContent = bookTitle + " (Selected Book)";
                bookSelect.appendChild(newOpt);
                bookSelect.value = bookTitle;
  }
}
        var form = document.getElementById("reservation-form");
        if (form) {
            form.classList.add("form-highlight");
            setTimeout(function() {
                form.classList.remove("form-highlight");
            }, 1800);
        }
        if (typeof showCafeToast === "function") { showCafeToast('Selected "' + bookTitle + '" for your reading nook!'); }
    };
    /* VIEW ALL TOGGLE */
    var menuExpanded = false;
    var booksExpanded = false;
    window.toggleViewAll = function (section) {
        if (section === "menu") {
            menuExpanded = !menuExpanded;
            var slider      = document.getElementById("products-slider");
            var prevBtn     = document.getElementById("prev-btn");
            var nextBtn     = document.getElementById("next-btn");
            var btn         = document.getElementById("menu-view-all-btn");
            var spanEl      = btn ? btn.querySelector("span") : null;
            if (menuExpanded) {
                slider.classList.add("grid-expanded");
                prevBtn.classList.add("hidden-when-expanded");
                nextBtn.classList.add("hidden-when-expanded");
                btn.classList.add("active");
                if (spanEl) spanEl.textContent = "Show Less";
            } else {
                slider.classList.remove("grid-expanded");
                prevBtn.classList.remove("hidden-when-expanded");
                nextBtn.classList.remove("hidden-when-expanded");
                btn.classList.remove("active");
                // Restore label with current active category count
                var activeCat = document.querySelector(".cat-btn.active");
                var catLabel = activeCat ? activeCat.textContent.trim().replace(/\s+/g, " ") : "All Items";
                if (spanEl) spanEl.textContent = "View All Menu Items";
                // Scroll back to start
                slider.scrollTo({ left: 0, behavior: "smooth" });
            }
        } else if (section === "books") {
            booksExpanded = !booksExpanded;
            var bSlider    = document.getElementById("books-slider");
            var bPrevBtn   = document.getElementById("books-prev-btn");
            var bNextBtn   = document.getElementById("books-next-btn");
            var bBtn       = document.getElementById("books-view-all-btn");
            var bSpanEl    = bBtn ? bBtn.querySelector("span") : null;
            // Count currently visible books
            var visibleCount = bSlider ? bSlider.querySelectorAll(".book-box:not(.hide)").length : 18;
            if (booksExpanded) {
                bSlider.classList.add("grid-expanded");
                bPrevBtn.classList.add("hidden-when-expanded");
                bNextBtn.classList.add("hidden-when-expanded");
                bBtn.classList.add("active");
                if (bSpanEl) bSpanEl.textContent = "Show Less";
            } else {
                bSlider.classList.remove("grid-expanded");
                bPrevBtn.classList.remove("hidden-when-expanded");
                bNextBtn.classList.remove("hidden-when-expanded");
                bBtn.classList.remove("active");
                if (bSpanEl) bSpanEl.textContent = "View All " + visibleCount + " Books";
                bSlider.scrollTo({ left: 0, behavior: "smooth" });
  }
}
    };
    // Sync View All label when book category filter changes
    var _origFilterBookGenre = window.filterBookGenre;
    bookCatButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // After filter, update books view-all label
            setTimeout(function () {
                var bBtn = document.getElementById("books-view-all-btn");
                var bSpanEl = bBtn ? bBtn.querySelector("span") : null;
                if (bSpanEl && !booksExpanded) {
                    var bSlider = document.getElementById("books-slider");
                    var visibleCount = bSlider ? bSlider.querySelectorAll(".book-box:not(.hide)").length : 18;
                    bSpanEl.textContent = "View All " + visibleCount + " Books";
                }
            }, 50);
        });
    });
    /* NOOK QUICK SELECT */
    /* NOOK QUICK SELECT */
    window.selectNookOption = function (nookName) {
        var nookSelect = document.getElementById("nook-select");
        if (nookSelect) {
            var found = false;
            for (var i = 0; i < nookSelect.options.length; i++) {
                if (
                    nookSelect.options[i].value === nookName ||
                    nookSelect.options[i].text.indexOf(nookName) !== -1 ||
                    nookName.indexOf(nookSelect.options[i].value) !== -1
                ) {
                    nookSelect.selectedIndex = i;
                    found = true;
                    break;
  }
}
            // Add subtle focus glow
            nookSelect.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";
            nookSelect.style.borderColor = "#8b5032";
            nookSelect.style.boxShadow = "0 0 12px rgba(139, 80, 50, 0.4)";
            setTimeout(function() {
                nookSelect.style.borderColor = "";
                nookSelect.style.boxShadow = "";
            }, 1800);
        }
        var resSection = document.getElementById("reservation");
        if (resSection) { resSection.scrollIntoView({ behavior: "smooth" }); }
        if (typeof showToast === "function") { showToast("Selected " + nookName + " for reservation!"); }
    };
    /* CART */
    var cart = [];
    function getCartItem(name) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) { return cart[i]; }
        }
        return null;
    }
    function renderCart() {
        var cartItems = document.getElementById("cart-items");
        var cartCount = document.getElementById("cart-count");
        var cartTotalSection = document.getElementById("cart-total-section");
        var cartTotalPrice = document.getElementById("cart-total-amount");
        if (!cartItems) return;
        var total = 0;
        var totalQuantity = 0;
        cart.forEach(function (item) {
            total += item.price * item.qty;
            totalQuantity += item.qty;
        });
        if (cartCount) { cartCount.textContent = totalQuantity; }
        if (cart.length === 0) {
            cartItems.innerHTML =
                "<p class=\"cart-empty\">Your cart is empty. Add some items!</p>";
            if (cartTotalSection) { cartTotalSection.style.display = "none"; }
            return;
        }
        if (cartTotalSection) { cartTotalSection.style.display = "block"; }
        if (cartTotalPrice) { cartTotalPrice.textContent = "₹" + total; }
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info"><h4>${item.name}</h4><span>₹${item.price * item.qty}</span></div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" data-action="minus" data-name="${item.name}">-</button>
                    <span class="cart-qty">${item.qty}</span>
                    <button class="cart-qty-btn" data-action="plus" data-name="${item.name}">+</button>
                </div>
            </div>`).join('');
        cartItems.querySelectorAll(".cart-qty-btn").forEach(function (button) {
            button.addEventListener("click", function () {
                var name = this.getAttribute("data-name");
                var action = this.getAttribute("data-action");
                var item = getCartItem(name);
                if (!item) return;
                if (action === "plus") { item.qty++; } else {
                    item.qty--;
                    if (item.qty <= 0) {
                        cart = cart.filter(function (cartItem) { return cartItem.name !== name; });
  }
}
                renderCart();
            });
        });
    }
    /* ADD TO CART */
    document.querySelectorAll(".add-cart-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            var name = this.getAttribute("data-name");
            var price = parseInt(this.getAttribute("data-price"));
            var existingItem = getCartItem(name);
            if (existingItem) { existingItem.qty++; } else {
                cart.push({
                    name: name,
                    price: price,
                    qty: 1
                });
            }
            renderCart();
            openCart();
            var originalText = this.innerHTML;
            this.innerHTML = "<i class='bx bx-check'></i> Added!";
            this.style.background = "#2e7d32";
            var button = this;
            setTimeout(function () {
                button.innerHTML = originalText;
                button.style.background = "";
            }, 1000);
        });
    });
    /* CAFÉ POPUP & TOAST NOTIFICATION SYSTEM */
    var cafeToast = document.getElementById("cafe-toast");
    var toastTimer = null;
    window.showCafeToast = function (message, icon) {
        if (!cafeToast) return;
        var msgEl = document.getElementById("toast-msg");
        var iconEl = document.getElementById("toast-icon");
        if (msgEl) msgEl.textContent = message;
        if (iconEl) iconEl.className = "bx " + (icon || "bx-check-circle");
        cafeToast.classList.add("show");
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            cafeToast.classList.remove("show");
        }, 3000);
    };
    var cafePopupModal = document.getElementById("cafe-popup-modal");
    var cafePopupClose = document.getElementById("cafe-popup-close");
    var cafePopupBtn = document.getElementById("cafe-popup-btn");
    var cafePopupConfirmCallback = null;
    window.showCafePopup = function (opts) {
        if (!cafePopupModal) return;
        var titleEl = document.getElementById("cafe-popup-title");
        var labelEl = document.getElementById("cafe-popup-label");
        var descEl = document.getElementById("cafe-popup-desc");
        var iconEl = document.getElementById("cafe-popup-icon");
        var cardEl = document.getElementById("cafe-popup-card");
        var btnEl = document.getElementById("cafe-popup-btn");
        if (titleEl && opts.title) titleEl.innerHTML = opts.title;
        if (labelEl && opts.label) labelEl.textContent = opts.label;
        if (descEl && opts.desc) descEl.innerHTML = opts.desc;
        if (iconEl && opts.icon) iconEl.className = "bx " + opts.icon;
        if (cardEl) {
            if (opts.cardHtml) {
                cardEl.innerHTML = opts.cardHtml;
                cardEl.style.display = "block";
            } else {
                cardEl.style.display = "none";
  }
}
        if (btnEl && opts.btnText) { btnEl.textContent = opts.btnText; } else if (btnEl) { btnEl.textContent = "Lovely, Thank You!"; }
        cafePopupConfirmCallback = opts.onConfirm || null;
        cafePopupModal.classList.add("active");
    };
    function closeCafePopup() {
        if (cafePopupModal) { cafePopupModal.classList.remove("active"); }
        if (typeof cafePopupConfirmCallback === "function") {
            cafePopupConfirmCallback();
            cafePopupConfirmCallback = null;
  }
}
    if (cafePopupClose) cafePopupClose.addEventListener("click", closeCafePopup);
    if (cafePopupBtn) cafePopupBtn.addEventListener("click", closeCafePopup);
    if (cafePopupModal) {
        cafePopupModal.addEventListener("click", function (e) {
            if (e.target === cafePopupModal) closeCafePopup();
        });
    }
    /* CART ORDER */
    var orderButton = document.getElementById("cart-checkout-btn");
    if (orderButton) {
        orderButton.addEventListener("click", function () {
            if (cart.length === 0) return;
            var total = 0;
            var count = 0;
            var itemsList = "";
            cart.forEach(function (item) {
                total += item.price * item.qty;
                count += item.qty;
                itemsList += "<div style='display:flex;justify-content:space-between;margin-bottom:5px;font-size:0.88rem;'><span>" + item.name + " &times; " + item.qty + "</span><strong>&#8377;" + (item.price * item.qty) + "</strong></div>";
            });
            showCafePopup({
                icon: "bxs-dish",
                label: "IN-STORE KITCHEN TICKET",
                title: "Brewing &amp; Baking Fresh!",
                desc: "Your order has been sent to our barista and kitchen. Please relax at your nook — we will call your order hot when ready!",
                cardHtml: itemsList + "<div style='border-top:1px dashed #d7a77c;margin-top:8px;padding-top:6px;display:flex;justify-content:space-between;font-weight:700;'><span>Total (" + count + " items)</span><span style='color:#8b4822;'>&#8377;" + total + "</span></div>",
                btnText: "Dine-in at My Nook"
            });
            cart = [];
            renderCart();
            closeCart();
        });
    }
    /* OPEN CART */
    function openCart() {
        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");
        if (sidebar) { sidebar.classList.add("open"); }
        if (overlay) { overlay.classList.add("active"); }
    }
    /* CLOSE CART */
    function closeCart() {
        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");
        if (sidebar) { sidebar.classList.remove("open"); }
        if (overlay) { overlay.classList.remove("active"); }
    }
    var openCartButton = document.getElementById("open-cart");
    if (openCartButton) { openCartButton.addEventListener("click", openCart); }
    var cartCloseButton = document.getElementById("cart-close");
    if (cartCloseButton) { cartCloseButton.addEventListener("click", closeCart); }
    var cartOverlay = document.getElementById("cart-overlay");
    if (cartOverlay) { cartOverlay.addEventListener("click", closeCart); }
 /* LOGIN / SIGNUP */
    var modal = document.getElementById("auth-modal");
    var loginPanel = document.getElementById("login-panel");
    var signupPanel = document.getElementById("signup-panel");
    function openModal() {
        if (modal) { modal.classList.add("active"); }
    }
    function closeModal() {
        if (modal) { modal.classList.remove("active"); }
    }
    function showLogin() {
        if (loginPanel) { loginPanel.classList.remove("hidden"); }
        if (signupPanel) { signupPanel.classList.add("hidden"); }
    }
    function showSignup() {
        if (signupPanel) { signupPanel.classList.remove("hidden"); }
        if (loginPanel) { loginPanel.classList.add("hidden"); }
    }
    var openLoginButton = document.getElementById("open-login");
    if (openLoginButton) {
        openLoginButton.addEventListener("click", function () {
            showLogin();
            openModal();
        });
    }
    var modalCloseButton = document.getElementById("modal-close-btn");
    if (modalCloseButton) { modalCloseButton.addEventListener("click", closeModal); }
    var modalCloseButton2 = document.getElementById("modal-close-btn2");
    if (modalCloseButton2) { modalCloseButton2.addEventListener("click", closeModal); }
    var signupLink = document.getElementById("go-signup");
    if (signupLink) {
        signupLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSignup();
        });
    }
    var loginLink = document.getElementById("go-login");
    if (loginLink) {
        loginLink.addEventListener("click", function (event) {
            event.preventDefault();
            showLogin();
        });
    }
    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) { closeModal(); }
        });
    }
    /* LOGIN BUTTON */
    var loginSubmit = loginPanel
        ? loginPanel.querySelector(".modal-submit-btn")
        : null;
    if (loginSubmit) {
        loginSubmit.addEventListener("click", function (e) {
            e.preventDefault();
            var emailInput = loginPanel.querySelector("input[type='email']");
            var email = emailInput && emailInput.value ? emailInput.value.split("@")[0] : "Reader";
            closeModal();
            showCafePopup({
                icon: "bxs-book-reader",
                label: "SANCTUARY PASS ACTIVATED",
                title: "Welcome Home, " + (email.charAt(0).toUpperCase() + email.slice(1)) + "!",
                desc: "You are logged in to Chai &amp; Chapter. Your reading lists, reserved nooks, and café perks are synchronized.",
                cardHtml: "<p><i class='bx bxs-coffee-bean' style='color:#b8860b;'></i> <strong>Perk:</strong> 10% off your next brew &bull; High-speed library Wi-Fi</p>",
                btnText: "Explore Books &amp; Menu"
            });
            if (openLoginButton) { openLoginButton.innerHTML = "<i class='bx bxs-user-check'></i> <span>" + (email.charAt(0).toUpperCase() + email.slice(1)) + "</span>"; }
        });
    }
    /* SIGNUP BUTTON */
    var signupSubmit = signupPanel
        ? signupPanel.querySelector(".modal-submit-btn")
        : null;
    if (signupSubmit) {
        signupSubmit.addEventListener("click", function (e) {
            e.preventDefault();
            var nameInput = signupPanel.querySelector("input[type='text']");
            var name = nameInput && nameInput.value ? nameInput.value : "Dear Reader";
            closeModal();
            showCafePopup({
                icon: "bxs-badge-check",
                label: "LIFETIME MEMBERSHIP GRANTED",
                title: "Welcome to Chai &amp; Chapter!",
                desc: "Greetings, <strong>" + name + "</strong>. Your member pass is ready. Enjoy free library borrowing, early access to literary circles, and nook reservations.",
                cardHtml: "<p style='color:#3b2418;'><i class='bx bx-party' style='color:#b8860b;'></i> Member Pass ID: <strong>#CC-" + Math.floor(1000 + Math.random() * 9000) + "</strong></p><p style='color:#745849;font-size:0.82rem;margin-top:4px;'>Show this at the counter for your complimentary welcome cookie!</p>",
                btnText: "Step Inside"
            });
            if (openLoginButton) { openLoginButton.innerHTML = "<i class='bx bxs-user-check'></i> <span>" + name.split(" ")[0] + "</span>"; }
        });
    }
    /* RESERVATION */
    var reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
        reservationForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var name = document.getElementById("guest-name").value || "Valued Guest";
            var nook = document.getElementById("nook-select").value || "Reading Corner";
            var date = document.getElementById("reservation-date").value || "Upcoming Visit";
            var bookSelect = document.getElementById("book-select");
            var book = (bookSelect && bookSelect.value) ? bookSelect.value : "Browse shelves in person";
            showCafePopup({
                icon: "bx-bookmark-heart",
                label: "NOOK & BOOK RESERVED",
                title: "Your Sanctuary Awaits!",
                desc: "We have reserved your quiet corner and prepared your reading selection at Chai &amp; Chapter.",
                cardHtml: "<p><strong>Guest:</strong> " + name + "</p>" +
                          "<p><strong>Space:</strong> " + nook + "</p>" +
                          "<p><strong>Date:</strong> " + date + "</p>" +
                          "<p><strong>Book to Read:</strong> <span style='color:#b8860b;font-weight:600;'>" + book + "</span> (100% Free)</p>" +
                          "<p style='color:#8b5032;margin-top:8px;font-size:0.88rem;'><i class='bx bxs-hot'></i> Complimentary fresh kulhad chai will be brewed upon your arrival.</p>",
                btnText: "Wonderful, See You Soon!"
            });
            reservationForm.reset();
        });
    }
    /* NEWSLETTER */
    var newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var emailInput = newsletterForm.querySelector("input[type='email']");
            var emailVal = emailInput ? emailInput.value : "";
            showCafePopup({
                icon: "bxs-envelope",
                label: "THE CHAPTER CLUB",
                title: "You're In The Story!",
                desc: "Welcome to The Chapter Club! We've subscribed <strong>" + (emailVal || "you") + "</strong> to our monthly dispatches.",
                cardHtml: "<p><i class='bx bx-book-open' style='color:#b8860b;'></i> Monthly curated reading lists &bull; Invitations to candlelit poetry nights &bull; Secret barista specials</p>",
                btnText: "Happy Reading!"
            });
            newsletterForm.reset();
        });
    }
    /* EVENT RSVP */
    var eventButtons = document.querySelectorAll(".event-btn");
    eventButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var eventName = this.getAttribute("data-event") || "Community Event";
            showCafePopup({
                icon: "bxs-calendar-heart",
                label: "SEAT RESERVED • FREE ENTRY",
                title: "RSVP Confirmed!",
                desc: "Your seat for <strong>\"" + eventName + "\"</strong> is held at Chai &amp; Chapter. We can't wait to share stories with you.",
                cardHtml: "<p><i class='bx bx-map-pin' style='color:#b8860b;'></i> <strong>Venue:</strong> Chai &amp; Chapter Main Hall, Banjara Hills</p><p style='margin-top:4px;'><i class='bx bx-coffee'></i> Complimentary chai will be served during the session.</p>",
                btnText: "Add to My Schedule"
            });
        });
    });
    /* ==========================================================
       INLINE EXPAND-ALL SYSTEM (replaces popup modal)
       ========================================================== */
    var expandState = { books: { open: false, category: "all" }, menu: { open: false, category: "all" } };
    // Build book data from DOM
    function getExpandBooksData() {
        var bookCards = document.querySelectorAll("#books-slider .book-box");
        var books = [];
        bookCards.forEach(function (box) {
            var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
            var genre = box.getAttribute("data-genre") || "classics";
            var tag = box.querySelector(".book-tag") ? box.querySelector(".book-tag").textContent.trim() : "";
            var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
            var author = box.querySelector(".book-author") ? box.querySelector(".book-author").textContent.trim() : "";
            var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";
            books.push({ type: "book", category: genre, tag: tag, title: title, author: author, desc: desc, img: img });
        });
        return books;
    }
    // Build menu data from DOM
    function getExpandMenuData() {
        var menuCards = document.querySelectorAll("#products-slider .product-box");
        var items = [];
        menuCards.forEach(function (box) {
            var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
            var category = box.getAttribute("data-category") || "pizzas";
            var tag = box.querySelector(".item-tag") ? box.querySelector(".item-tag").textContent.trim() : "";
            var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
            var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";
            var price = box.querySelector("strong") ? box.querySelector("strong").textContent.trim() : "";
            var addBtn = box.querySelector(".add-cart-btn");
            var rawPrice = addBtn ? addBtn.getAttribute("data-price") : 200;
            items.push({ type: "menu", category: category, tag: tag, title: title, desc: desc, img: img, price: price, rawPrice: rawPrice });
        });
        return items;
    }
    window.toggleExpandAll = function (type) {
        var container = document.getElementById(type + "-expand-container");
        var btn = document.getElementById(type === "books" ? "books-view-all-btn" : "menu-view-all-btn");
        var icon = document.getElementById(type + "-expand-icon");
        if (!container) return;
        expandState[type].open = !expandState[type].open;
        if (expandState[type].open) {
            container.style.display = "block";
            if (btn) btn.classList.add("expanded");
            if (btn) {
                var spanEl = btn.querySelector("span");
                if (spanEl) spanEl.textContent = type === "books" ? "Collapse Library" : "Collapse Menu";
            }
            expandState[type].category = "all";
            renderExpandGrid(type);
            // Smooth scroll to container
            setTimeout(function () {
                container.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else {
            container.style.display = "none";
            if (btn) btn.classList.remove("expanded");
            if (btn) {
                var spanEl = btn.querySelector("span");
                if (spanEl) spanEl.textContent = type === "books" ? "View All 18 Books" : "View All 71 Menu Items";
  }
}
    };
    window.setExpandCategory = function (type, cat) {
        expandState[type].category = cat;
        var pillsContainer = document.getElementById(type + "-expand-pills");
        if (pillsContainer) {
            pillsContainer.querySelectorAll(".expand-pill").forEach(function (p) {
                if (p.getAttribute("data-cat") === cat) p.classList.add("active");
                else p.classList.remove("active");
            });
        }
        renderExpandGrid(type);
    };
    window.filterExpandItems = function (type) {
        renderExpandGrid(type);
    };
    function renderExpandGrid(type) {
        var items = type === "books" ? getExpandBooksData() : getExpandMenuData();
        var searchInput = document.getElementById(type + "-expand-search");
        var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        var cat = expandState[type].category;
        var filtered = items.filter(function (item) {
            var matchCat = (cat === "all" || item.category === cat);
            var matchQ = !query ||
                item.title.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query) ||
                (item.author && item.author.toLowerCase().includes(query)) ||
                (item.tag && item.tag.toLowerCase().includes(query));
            return matchCat && matchQ;
        });
        var countEl = document.getElementById(type + "-expand-count");
        if (countEl) { countEl.textContent = "Showing " + filtered.length + " of " + items.length + (type === "books" ? " books" : " menu items"); }
        var grid = document.getElementById(type + "-expand-grid");
        if (!grid) return;
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#7d5e4d;"><h3 style="font-family:Cormorant Garamond,serif;color:#3b2418;margin-bottom:6px;">No matches found</h3><p style="font-size:0.85rem;">Try a different keyword or category.</p></div>';
            return;
        }
        grid.innerHTML = filtered.map((item, i) => `
        <div class="expand-card" style="animation-delay:${i * 0.04}s">
            <div class="expand-card-img">
                <img src="${item.img}" alt="${item.title}">${item.tag ? `<span class="expand-card-tag">${item.tag}</span>` : ''}
            </div>
            <div class="expand-card-body">
                <h3>${item.title}</h3>
                ${item.type === 'book' && item.author ? `<span class="expand-card-author">by ${item.author}</span>` : ''}
                <p>${item.desc}</p>
                <div class="expand-card-footer">
                    ${item.type === 'book'
                        ? `<span class="expand-free-tag"><i class="bx bx-book-open"></i> Free In-House</span><button class="btn expand-card-btn" onclick="expandBookReserve('${item.title.replace(/'/g, "\\'")}')"><i class="bx bx-bookmark"></i> Read in Nook</button>`
                        : `<span class="expand-card-price">${item.price}</span><button class="btn expand-card-btn" onclick="expandAddCart('${item.title.replace(/'/g, "\\'")}', ${item.rawPrice}, this)"><i class="bx bx-cart-add"></i> Add to Cart</button>`}
                </div>
            </div>
        </div>`).join('');
    }
    window.expandBookReserve = function (title) {
        if (typeof reserveBookForNook === "function") reserveBookForNook(title);
    };
    window.expandAddCart = function (title, price, btn) {
        var existing = getCartItem(title);
        if (existing) { existing.qty++; } else {
            cart.push({ name: title, price: price, qty: 1 });
        }
        renderCart();
        if (typeof showCafeToast === "function") showCafeToast('Added "' + title + '" to your order!');
        var origHTML = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-check'></i> Added!";
        btn.style.background = "#2e7d32";
        setTimeout(function () {
            btn.innerHTML = origHTML;
            btn.style.background = "";
        }, 1200);
    };
});
    /* ===================== HOMEPAGE UNIQUE FEATURES ROTATOR ===================== */
    (function initUniqueShowcase() {
        var showcase = document.getElementById("unique-showcase");
        if (!showcase) return;
        var slides = showcase.querySelectorAll(".unique-slide-card");
        var tabs = showcase.querySelectorAll(".unique-tab-btn");
        var dotsContainer = document.getElementById("unique-dots");
        var prevBtn = document.getElementById("unique-prev-btn");
        var nextBtn = document.getElementById("unique-next-btn");
        var progressBar = document.getElementById("unique-progress-bar");
        if (!slides.length) return;
        var currentIndex = 0;
        var totalSlides = slides.length;
        var intervalTime = 4800; // ms
        var timer = null;
        var progressTimer = null;
        var progressStartTime = 0;
        var isPaused = false;
        // Build dots
        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            for (var i = 0; i < totalSlides; i++) {
                var dot = document.createElement("span");
                dot.className = "unique-dot" + (i === 0 ? " active" : "");
                dot.setAttribute("data-slide", i);
                (function(idx) {
                    dot.addEventListener("click", function() {
                        goToSlide(idx);
                        resetAutoplay();
                    });
                })(i);
                dotsContainer.appendChild(dot);
  }
}
        function updateSlideUI() {
            slides.forEach(function(slide, idx) {
                if (idx === currentIndex) { slide.classList.add("active"); } else {
                    slide.classList.remove("active");
                }
            });
            tabs.forEach(function(tab, idx) {
                if (idx === currentIndex) {
                    tab.classList.add("active");
                    // Scroll active tab into view smoothly on mobile
                    // tab.scrollIntoView removed to prevent page jump bug
                } else {
                    tab.classList.remove("active");
                }
            });
            if (dotsContainer) {
                var dots = dotsContainer.querySelectorAll(".unique-dot");
                dots.forEach(function(dot, idx) {
                    if (idx === currentIndex) { dot.classList.add("active"); } else {
                        dot.classList.remove("active");
                    }
                });
  }
}
        function goToSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            updateSlideUI();
            startProgress();
        }
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        function startProgress() {
            clearInterval(progressTimer);
            if (!progressBar) return;
            progressBar.style.width = "0%";
            progressStartTime = Date.now();
            progressTimer = setInterval(function() {
                if (isPaused) return;
                var elapsed = Date.now() - progressStartTime;
                var pct = Math.min(100, (elapsed / intervalTime) * 100);
                progressBar.style.width = pct + "%";
                if (pct >= 100) { clearInterval(progressTimer); }
            }, 50);
        }
        function startAutoplay() {
            clearInterval(timer);
            startProgress();
            timer = setInterval(function() {
                if (!isPaused) { nextSlide(); }
            }, intervalTime);
        }
        function resetAutoplay() {
            startAutoplay();
        }
        // Tab click listeners
        tabs.forEach(function(tab) {
            tab.addEventListener("click", function() {
                var slideIdx = parseInt(this.getAttribute("data-slide"), 10);
                goToSlide(slideIdx);
                resetAutoplay();
            });
        });
        if (nextBtn) {
            nextBtn.addEventListener("click", function() {
                nextSlide();
                resetAutoplay();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener("click", function() {
                prevSlide();
                resetAutoplay();
            });
        }
        // Pause on hover
        showcase.addEventListener("mouseenter", function() { isPaused = true; });
        showcase.addEventListener("mouseleave", function() { 
            isPaused = false; 
            progressStartTime = Date.now() - ((parseFloat(progressBar.style.width) || 0) / 100 * intervalTime);
        });
        // Initialize
        updateSlideUI();
        startAutoplay();
    })();
