const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\megha\\Documents\\GitHub\\C-C';
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'style.css');
const jsPath = path.join(rootDir, 'script.js');

// ==========================================
// 1. UPDATE index.html
// ==========================================
let html = fs.readFileSync(indexPath, 'utf8');

// Insert the catalog modal overlay right after #cafe-toast
const modalMarkup = `
<!-- ========== VIEW MORE / CATALOG POPUP MODAL ========== -->
<div class="modal-overlay catalog-modal-overlay" id="catalog-modal">
    <div class="modal-box catalog-modal-box">
        <div class="catalog-modal-header">
            <div class="catalog-modal-brand">
                <div class="catalog-modal-badge" id="catalog-modal-badge">
                    <i class='bx bx-book-open'></i>
                </div>
                <div class="catalog-modal-titles">
                    <span class="catalog-modal-subtitle" id="catalog-modal-subtitle">CHAI &amp; CHAPTER SANCTUARY</span>
                    <h2 class="catalog-modal-title" id="catalog-modal-title">Complete Café Library</h2>
                </div>
            </div>
            <button class="catalog-close-btn" id="catalog-modal-close" onclick="closeCatalogModal()" aria-label="Close modal">&times;</button>
        </div>

        <!-- Controls Toolbar (Search + Category Filter Pills) -->
        <div class="catalog-modal-toolbar">
            <div class="catalog-search-box">
                <i class='bx bx-search'></i>
                <input type="text" id="catalog-search-input" placeholder="Search books, dishes, ingredients..." oninput="filterCatalogModalItems()">
                <button class="catalog-clear-search" id="catalog-clear-search" onclick="clearCatalogSearch()">&times;</button>
            </div>
            <div class="catalog-filter-pills" id="catalog-filter-pills">
                <!-- Injected dynamically based on books or menu mode -->
            </div>
        </div>

        <!-- Item Count Indicator -->
        <div class="catalog-modal-meta">
            <span id="catalog-items-count-text">Showing all items</span>
            <span class="catalog-modal-hint" id="catalog-modal-hint">
                <i class='bx bx-info-circle'></i> Free in-house reading sanctuary
            </span>
        </div>

        <!-- Grid Container for Items -->
        <div class="catalog-modal-body" id="catalog-modal-body">
            <div class="catalog-grid" id="catalog-grid">
                <!-- Dynamically populated card items -->
            </div>
            <div class="catalog-empty-state" id="catalog-empty-state" style="display:none;">
                <i class='bx bx-search-alt'></i>
                <h3>No Matching Items Found</h3>
                <p>Try searching with another keyword or pick a different category above.</p>
                <button class="btn catalog-reset-btn" onclick="resetCatalogFilters()">Reset All Filters</button>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="catalog-modal-footer">
            <div class="catalog-footer-info" id="catalog-footer-info">
                <i class='bx bx-coffee-togo'></i>
                <span>Chai &amp; Chapter &bull; Banjara Hills, Hyderabad</span>
            </div>
            <div class="catalog-footer-actions">
                <button class="btn catalog-footer-action-btn" id="catalog-footer-btn" onclick="handleCatalogFooterAction()">
                    <i class='bx bx-bookmark-heart'></i> Reserve a Reading Nook
                </button>
            </div>
        </div>
    </div>
</div>
`;

if (!html.includes('id="catalog-modal"')) {
    html = html.replace('<!-- ========== CART SIDEBAR ==========', modalMarkup + '\n<!-- ========== CART SIDEBAR ==========');
}

// Update View All Books button
html = html.replace(/<button class="view-all-btn" id="books-view-all-btn"[\s\S]*?<\/button>/, `<button class="view-all-btn" id="books-view-all-btn" onclick="openCatalogModal('books')">
            <i class='bx bx-grid-alt'></i>
            <span>View More / All 18 Books</span>
            <i class='bx bx-expand-alt'></i>
        </button>`);

// Update View All Menu button
html = html.replace(/<button class="view-all-btn" id="menu-view-all-btn"[\s\S]*?<\/button>/, `<button class="view-all-btn" id="menu-view-all-btn" onclick="openCatalogModal('menu')">
            <i class='bx bx-grid-alt'></i>
            <span>View More / All 71 Menu Items</span>
            <i class='bx bx-expand-alt'></i>
        </button>`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html with catalog popup modal.');


// ==========================================
// 2. UPDATE style.css
// ==========================================
let css = fs.readFileSync(cssPath, 'utf8');

const catalogCSS = `
/* ===================== VIEW MORE / CATALOG POPUP MODAL ===================== */
.catalog-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(36, 21, 14, 0.78);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 12000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.35s ease;
}

.catalog-modal-overlay.active {
    display: flex;
    opacity: 1;
}

.catalog-modal-box {
    background: #fffdf9;
    border: 1.5px solid #d9c2b0;
    box-shadow: 0 25px 70px rgba(43, 24, 14, 0.45);
    border-radius: 22px;
    max-width: 1240px;
    width: 100%;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px) scale(0.97);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
}

.catalog-modal-overlay.active .catalog-modal-box {
    transform: translateY(0) scale(1);
}

/* Modal Header */
.catalog-modal-header {
    background: linear-gradient(135deg, #fdf7f0 0%, #faeee1 100%);
    border-bottom: 1.5px solid #ebd9cb;
    padding: 22px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: relative;
}

.catalog-modal-brand {
    display: flex;
    align-items: center;
    gap: 16px;
}

.catalog-modal-badge {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6f3d24 0%, #8b4822 100%);
    color: #f7e6d2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.7rem;
    box-shadow: 0 6px 18px rgba(111, 61, 36, 0.25);
    flex-shrink: 0;
}

.catalog-modal-titles {
    display: flex;
    flex-direction: column;
}

.catalog-modal-subtitle {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: #8b5032;
    text-transform: uppercase;
    margin-bottom: 2px;
}

.catalog-modal-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    color: #3b2418;
    line-height: 1.1;
    font-weight: 700;
    margin: 0;
}

.catalog-close-btn {
    background: #f4e8dc;
    color: #5c3520;
    border: 1px solid #d9c2b0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.catalog-close-btn:hover {
    background: #6f3d24;
    color: #ffffff;
    border-color: #6f3d24;
    transform: rotate(90deg);
}

/* Modal Toolbar (Search & Filter Pills) */
.catalog-modal-toolbar {
    background: #ffffff;
    border-bottom: 1px solid #ebd9cb;
    padding: 14px 28px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.catalog-search-box {
    position: relative;
    flex: 1;
    min-width: 260px;
    max-width: 420px;
}

.catalog-search-box i.bx-search {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: #9a7865;
    pointer-events: none;
}

.catalog-search-box input {
    width: 100%;
    padding: 10px 38px 10px 42px;
    background: #fbf6f0;
    border: 1.5px solid #dfcfc2;
    border-radius: 30px;
    font-family: inherit;
    font-size: 0.88rem;
    color: #3b2418;
    outline: none;
    transition: all 0.25s ease;
}

.catalog-search-box input:focus {
    background: #ffffff;
    border-color: #6f3d24;
    box-shadow: 0 0 0 4px rgba(111, 61, 36, 0.1);
}

.catalog-clear-search {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #9a7865;
    cursor: pointer;
    display: none;
    line-height: 1;
}

.catalog-clear-search:hover {
    color: #3b2418;
}

.catalog-filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    max-width: 100%;
    padding-bottom: 2px;
    scrollbar-width: thin;
}

.catalog-pill-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #d9c2b0;
    background: #fff8f0;
    color: #6f3d24;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.catalog-pill-btn:hover {
    background: #faeee1;
    border-color: #6f3d24;
}

.catalog-pill-btn.active {
    background: #6f3d24;
    color: #ffffff;
    border-color: #6f3d24;
    box-shadow: 0 3px 10px rgba(111, 61, 36, 0.25);
}

.catalog-pill-count {
    font-size: 0.75rem;
    opacity: 0.85;
    font-weight: 700;
}

/* Meta Bar */
.catalog-modal-meta {
    padding: 8px 28px;
    background: #faf4ed;
    border-bottom: 1px solid #ebd9cb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    color: #7d5e4d;
    font-weight: 500;
}

.catalog-modal-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #8b5032;
    font-weight: 600;
}

/* Modal Body & Grid */
.catalog-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
    background: #fffdfa;
    scrollbar-width: thin;
    scrollbar-color: #c7a58e #f5ece2;
}

.catalog-modal-body::-webkit-scrollbar {
    width: 8px;
}

.catalog-modal-body::-webkit-scrollbar-track {
    background: #f5ece2;
}

.catalog-modal-body::-webkit-scrollbar-thumb {
    background: #c7a58e;
    border-radius: 4px;
}

.catalog-modal-body::-webkit-scrollbar-thumb:hover {
    background: #6f3d24;
}

.catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 22px;
}

/* Modal Item Card */
.catalog-card {
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #ebd9cb;
    box-shadow: 0 4px 15px rgba(59, 36, 24, 0.06);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: fadeInCard 0.3s ease backwards;
}

@keyframes fadeInCard {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.catalog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(59, 36, 24, 0.12);
    border-color: #cfb19a;
}

.catalog-card-img-wrap {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: #f2e7dc;
}

.catalog-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.catalog-card:hover .catalog-card-img-wrap img {
    transform: scale(1.06);
}

.catalog-card-tag {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(111, 61, 36, 0.92);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.catalog-card-category-badge {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.95);
    color: #6f3d24;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.catalog-card-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.catalog-card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #d48b28;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.catalog-card-rating i {
    font-size: 0.95rem;
}

.catalog-card-rating span.review-count {
    color: #8c7161;
    font-weight: 400;
    font-size: 0.75rem;
}

.catalog-card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #3b2418;
    line-height: 1.2;
    margin-bottom: 4px;
}

.catalog-card-author {
    font-size: 0.78rem;
    font-weight: 600;
    color: #8b5032;
    margin-bottom: 8px;
}

.catalog-card-desc {
    font-size: 0.8rem;
    line-height: 1.5;
    color: #6d5445;
    margin-bottom: 14px;
    flex: 1;
}

.catalog-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px dashed #ebd9cb;
}

.catalog-card-price {
    font-size: 1.15rem;
    font-weight: 800;
    color: #6f3d24;
}

.catalog-free-read-tag {
    font-size: 0.72rem;
    font-weight: 700;
    color: #2e7d32;
    background: #e8f5e9;
    padding: 4px 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.catalog-card-btn {
    padding: 8px 14px;
    font-size: 0.82rem;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
}

/* Empty State */
.catalog-empty-state {
    text-align: center;
    padding: 50px 20px;
    color: #745849;
}

.catalog-empty-state i {
    font-size: 3.5rem;
    color: #c7a58e;
    margin-bottom: 12px;
    display: block;
}

.catalog-empty-state h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.8rem;
    color: #3b2418;
    margin-bottom: 8px;
}

.catalog-empty-state p {
    font-size: 0.9rem;
    margin-bottom: 18px;
}

.catalog-reset-btn {
    padding: 9px 22px;
    font-size: 0.85rem;
    border-radius: 25px;
}

/* Modal Footer */
.catalog-modal-footer {
    background: #faf4ed;
    border-top: 1.5px solid #ebd9cb;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
}

.catalog-footer-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: #6d5445;
}

.catalog-footer-info i {
    font-size: 1.2rem;
    color: #8b5032;
}

.catalog-footer-action-btn {
    padding: 10px 22px;
    font-size: 0.88rem;
    border-radius: 25px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
    .catalog-modal-box {
        max-height: 96vh;
        border-radius: 16px;
    }

    .catalog-modal-header {
        padding: 16px 18px;
    }

    .catalog-modal-title {
        font-size: 1.5rem;
    }

    .catalog-modal-toolbar {
        padding: 12px 18px;
    }

    .catalog-search-box {
        max-width: 100%;
    }

    .catalog-modal-meta {
        padding: 6px 18px;
    }

    .catalog-modal-body {
        padding: 16px 18px;
    }

    .catalog-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .catalog-modal-footer {
        padding: 14px 18px;
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    .catalog-footer-info {
        justify-content: center;
    }
}
`;

if (!css.includes('.catalog-modal-overlay')) {
    css += '\n' + catalogCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Appended catalog modal styles to style.css');
}

// ==========================================
// 3. UPDATE script.js
// ==========================================
let js = fs.readFileSync(jsPath, 'utf8');

const catalogJS = `
    /* ==========================================================
       VIEW MORE / CATALOG POPUP MODAL SYSTEM
       ========================================================== */
    var catalogModal = document.getElementById("catalog-modal");
    var catalogSearchInput = document.getElementById("catalog-search-input");
    var catalogClearSearch = document.getElementById("catalog-clear-search");
    var catalogFilterPills = document.getElementById("catalog-filter-pills");
    var catalogGrid = document.getElementById("catalog-grid");
    var catalogEmptyState = document.getElementById("catalog-empty-state");
    var catalogCountText = document.getElementById("catalog-items-count-text");
    var currentCatalogType = "books"; // 'books' or 'menu'
    var currentCatalogCategory = "all";

    // Extract all books from DOM
    function getAllBooksData() {
        var bookCards = document.querySelectorAll("#books-slider .book-box");
        var books = [];
        bookCards.forEach(function (box) {
            var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
            var genre = box.getAttribute("data-genre") || "classics";
            var genrePill = box.querySelector(".book-genre-pill") ? box.querySelector(".book-genre-pill").textContent.trim() : "";
            var tag = box.querySelector(".book-tag") ? box.querySelector(".book-tag").textContent.trim() : "";
            var ratingNum = box.querySelector(".book-rating-num") ? box.querySelector(".book-rating-num").textContent.trim() : "4.9";
            var ratingCount = box.querySelector(".book-rating-count") ? box.querySelector(".book-rating-count").textContent.trim() : "(100+)";
            var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
            var author = box.querySelector(".book-author") ? box.querySelector(".book-author").textContent.trim() : "";
            var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";

            books.push({
                type: "book",
                id: title,
                category: genre,
                categoryLabel: genrePill,
                tag: tag,
                rating: ratingNum,
                reviewCount: ratingCount,
                title: title,
                subtitle: author,
                desc: desc,
                img: img,
                isFree: true
            });
        });
        return books;
    }

    // Extract all menu items from DOM
    function getAllMenuData() {
        var menuCards = document.querySelectorAll("#products-slider .product-box");
        var menu = [];
        menuCards.forEach(function (box) {
            var img = box.querySelector("img") ? box.querySelector("img").getAttribute("src") : "";
            var category = box.getAttribute("data-category") || "pizzas";
            var tag = box.querySelector(".item-tag") ? box.querySelector(".item-tag").textContent.trim() : "Chef's Special";
            var title = box.querySelector("h3") ? box.querySelector("h3").textContent.trim() : "";
            var desc = box.querySelector("p") ? box.querySelector("p").textContent.trim() : "";
            var price = box.querySelector("strong") ? box.querySelector("strong").textContent.trim() : "₹200";
            var addBtn = box.querySelector(".add-cart-btn");
            var rawPrice = addBtn ? addBtn.getAttribute("data-price") : 200;

            var catLabelMap = {
                "pizzas": "🍕 Pizzas",
                "chai-coffee": "☕ Chai & Coffee",
                "sandwiches": "🥪 Sandwiches & Bites",
                "bakes": "🍰 Bakes & Desserts",
                "milkshakes": "🥤 Milkshakes",
                "pasta": "🍝 Pasta & Mains"
            };

            menu.push({
                type: "menu",
                id: title,
                category: category,
                categoryLabel: catLabelMap[category] || "Menu Item",
                tag: tag,
                rating: "4.8",
                reviewCount: "(150+)",
                title: title,
                subtitle: "",
                desc: desc,
                img: img,
                price: price,
                rawPrice: rawPrice,
                isFree: false
            });
        });
        return menu;
    }

    window.openCatalogModal = function (type) {
        if (!catalogModal) return;
        currentCatalogType = type === "menu" ? "menu" : "books";
        currentCatalogCategory = "all";
        if (catalogSearchInput) catalogSearchInput.value = "";
        if (catalogClearSearch) catalogClearSearch.style.display = "none";

        var badge = document.getElementById("catalog-modal-badge");
        var title = document.getElementById("catalog-modal-title");
        var sub = document.getElementById("catalog-modal-subtitle");
        var hint = document.getElementById("catalog-modal-hint");
        var footerBtn = document.getElementById("catalog-footer-btn");

        if (currentCatalogType === "books") {
            if (badge) badge.innerHTML = "<i class='bx bx-book-open'></i>";
            if (title) title.textContent = "Complete Sanctuary Library (18 Books)";
            if (sub) sub.textContent = "CHAI & CHAPTER CURATION";
            if (hint) hint.innerHTML = "<i class='bx bx-book-heart'></i> All 18 books are 100% free to read in-house";
            if (footerBtn) footerBtn.innerHTML = "<i class='bx bx-calendar-check'></i> Reserve a Nook to Read";
            renderBookPills();
        } else {
            if (badge) badge.innerHTML = "<i class='bx bx-dish'></i>";
            if (title) title.textContent = "Complete Artisan Café Menu (71 Items)";
            if (sub) sub.textContent = "HANDCRAFTED IN-STORE FLAVORS";
            if (hint) hint.innerHTML = "<i class='bx bx-store-alt'></i> Scan & add to cart &bull; Collect at counter";
            if (footerBtn) footerBtn.innerHTML = "<i class='bx bx-cart'></i> View In-Store Cart";
            renderMenuPills();
        }

        renderCatalogCards();
        catalogModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    window.closeCatalogModal = function () {
        if (!catalogModal) return;
        catalogModal.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    // Close on backdrop click
    if (catalogModal) {
        catalogModal.addEventListener("click", function (e) {
            if (e.target === catalogModal) {
                closeCatalogModal();
            }
        });
    }

    // Close on ESC key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && catalogModal && catalogModal.classList.contains("active")) {
            closeCatalogModal();
        }
    });

    // Render category pills for books
    function renderBookPills() {
        var books = getAllBooksData();
        var counts = { all: books.length, "classics": 0, "mystery-history": 0, "romance": 0 };
        books.forEach(function (b) {
            if (counts[b.category] !== undefined) counts[b.category]++;
        });

        catalogFilterPills.innerHTML = 
            '<button class="catalog-pill-btn active" data-cat="all" onclick="setCatalogCategory(\\'all\\')">' +
                '<i class=\\'bx bx-grid-alt\\'></i> All Books <span class="catalog-pill-count">(' + counts.all + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="classics" onclick="setCatalogCategory(\\'classics\\')">' +
                '✨ Classics & Fiction <span class="catalog-pill-count">(' + counts.classics + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="mystery-history" onclick="setCatalogCategory(\\'mystery-history\\')">' +
                '🔍 Mystery & History <span class="catalog-pill-count">(' + counts["mystery-history"] + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="romance" onclick="setCatalogCategory(\\'romance\\')">' +
                '💖 Romance & Heartfelt <span class="catalog-pill-count">(' + counts.romance + ')</span>' +
            '</button>';
    }

    // Render category pills for menu
    function renderMenuPills() {
        var menu = getAllMenuData();
        var counts = { all: menu.length, pizzas: 0, "chai-coffee": 0, sandwiches: 0, bakes: 0, milkshakes: 0, pasta: 0 };
        menu.forEach(function (m) {
            if (counts[m.category] !== undefined) counts[m.category]++;
        });

        catalogFilterPills.innerHTML = 
            '<button class="catalog-pill-btn active" data-cat="all" onclick="setCatalogCategory(\\'all\\')">' +
                '<i class=\\'bx bx-grid-alt\\'></i> All Items <span class="catalog-pill-count">(' + counts.all + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="pizzas" onclick="setCatalogCategory(\\'pizzas\\')">' +
                '🍕 Pizzas <span class="catalog-pill-count">(' + counts.pizzas + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="chai-coffee" onclick="setCatalogCategory(\\'chai-coffee\\')">' +
                '☕ Chai & Coffee <span class="catalog-pill-count">(' + counts["chai-coffee"] + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="sandwiches" onclick="setCatalogCategory(\\'sandwiches\\')">' +
                '🥪 Sandwiches <span class="catalog-pill-count">(' + counts.sandwiches + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="bakes" onclick="setCatalogCategory(\\'bakes\\')">' +
                '🍰 Bakes <span class="catalog-pill-count">(' + counts.bakes + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="milkshakes" onclick="setCatalogCategory(\\'milkshakes\\')">' +
                '🥤 Shakes <span class="catalog-pill-count">(' + counts.milkshakes + ')</span>' +
            '</button>' +
            '<button class="catalog-pill-btn" data-cat="pasta" onclick="setCatalogCategory(\\'pasta\\')">' +
                '🍝 Pasta & Mains <span class="catalog-pill-count">(' + counts.pasta + ')</span>' +
            '</button>';
    }

    window.setCatalogCategory = function (cat) {
        currentCatalogCategory = cat;
        var pills = catalogFilterPills.querySelectorAll(".catalog-pill-btn");
        pills.forEach(function (p) {
            if (p.getAttribute("data-cat") === cat) {
                p.classList.add("active");
            } else {
                p.classList.remove("active");
            }
        });
        renderCatalogCards();
    };

    window.filterCatalogModalItems = function () {
        var val = catalogSearchInput.value.trim();
        if (catalogClearSearch) {
            catalogClearSearch.style.display = val.length > 0 ? "block" : "none";
        }
        renderCatalogCards();
    };

    window.clearCatalogSearch = function () {
        if (catalogSearchInput) {
            catalogSearchInput.value = "";
            catalogClearSearch.style.display = "none";
            renderCatalogCards();
        }
    };

    window.resetCatalogFilters = function () {
        currentCatalogCategory = "all";
        if (catalogSearchInput) catalogSearchInput.value = "";
        if (catalogClearSearch) catalogClearSearch.style.display = "none";
        var pills = catalogFilterPills.querySelectorAll(".catalog-pill-btn");
        pills.forEach(function (p) {
            if (p.getAttribute("data-cat") === "all") p.classList.add("active");
            else p.classList.remove("active");
        });
        renderCatalogCards();
    };

    function renderCatalogCards() {
        var items = currentCatalogType === "books" ? getAllBooksData() : getAllMenuData();
        var query = catalogSearchInput ? catalogSearchInput.value.toLowerCase().trim() : "";

        var filtered = items.filter(function (item) {
            var matchCategory = (currentCatalogCategory === "all" || item.category === currentCatalogCategory);
            var matchQuery = !query || 
                item.title.toLowerCase().includes(query) || 
                (item.subtitle && item.subtitle.toLowerCase().includes(query)) || 
                item.desc.toLowerCase().includes(query) ||
                (item.tag && item.tag.toLowerCase().includes(query));
            return matchCategory && matchQuery;
        });

        if (catalogCountText) {
            catalogCountText.textContent = "Showing " + filtered.length + " of " + items.length + " " + (currentCatalogType === "books" ? "books" : "menu items");
        }

        if (filtered.length === 0) {
            catalogGrid.innerHTML = "";
            if (catalogEmptyState) catalogEmptyState.style.display = "block";
            return;
        }

        if (catalogEmptyState) catalogEmptyState.style.display = "none";

        var html = "";
        filtered.forEach(function (item) {
            if (item.type === "book") {
                html += 
                '<div class="catalog-card">' +
                    '<div class="catalog-card-img-wrap">' +
                        '<img src="' + item.img + '" alt="' + item.title + '" loading="lazy">' +
                        (item.tag ? '<span class="catalog-card-tag">' + item.tag + '</span>' : '') +
                        '<span class="catalog-card-category-badge">' + item.categoryLabel + '</span>' +
                    '</div>' +
                    '<div class="catalog-card-body">' +
                        '<div class="catalog-card-rating">' +
                            '<i class=\\'bx bxs-star\\'></i> <span>' + item.rating + '</span>' +
                            '<span class="review-count">' + item.reviewCount + '</span>' +
                        '</div>' +
                        '<h3 class="catalog-card-title">' + item.title + '</h3>' +
                        (item.subtitle ? '<span class="catalog-card-author">by ' + item.subtitle + '</span>' : '') +
                        '<p class="catalog-card-desc">' + item.desc + '</p>' +
                        '<div class="catalog-card-footer">' +
                            '<span class="catalog-free-read-tag"><i class=\\'bx bx-book-open\\'></i> Free In-House</span>' +
                            '<button class="btn catalog-card-btn" onclick="handleCatalogBookReserve(\\'' + item.title.replace(/'/g, "\\\\'") + '\\')">' +
                                '<i class=\\'bx bx-bookmark\\'></i> Read in Nook' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            } else {
                html += 
                '<div class="catalog-card">' +
                    '<div class="catalog-card-img-wrap">' +
                        '<img src="' + item.img + '" alt="' + item.title + '" loading="lazy">' +
                        (item.tag ? '<span class="catalog-card-tag">' + item.tag + '</span>' : '') +
                        '<span class="catalog-card-category-badge">' + item.categoryLabel + '</span>' +
                    '</div>' +
                    '<div class="catalog-card-body">' +
                        '<div class="catalog-card-rating">' +
                            '<i class=\\'bx bxs-star\\'></i> <span>' + item.rating + '</span>' +
                            '<span class="review-count">' + item.reviewCount + '</span>' +
                        '</div>' +
                        '<h3 class="catalog-card-title">' + item.title + '</h3>' +
                        '<p class="catalog-card-desc">' + item.desc + '</p>' +
                        '<div class="catalog-card-footer">' +
                            '<span class="catalog-card-price">' + item.price + '</span>' +
                            '<button class="btn catalog-card-btn" onclick="handleCatalogAddCart(\\'' + item.title.replace(/'/g, "\\\\'") + '\\', ' + item.rawPrice + ', this)">' +
                                '<i class=\\'bx bx-cart-add\\'></i> Add to Cart' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }
        });

        catalogGrid.innerHTML = html;
    }

    window.handleCatalogBookReserve = function (bookTitle) {
        closeCatalogModal();
        reserveBookForNook(bookTitle);
    };

    window.handleCatalogAddCart = function (title, price, btn) {
        var existing = getCartItem(title);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name: title, price: price, qty: 1 });
        }
        renderCart();
        showCafeToast('Added "' + title + '" (₹' + price + ') to your in-store order!');

        var origText = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-check'></i> Added!";
        btn.style.background = "#2e7d32";
        setTimeout(function () {
            btn.innerHTML = origText;
            btn.style.background = "";
        }, 1500);
    };

    window.handleCatalogFooterAction = function () {
        closeCatalogModal();
        if (currentCatalogType === "books") {
            var resSection = document.getElementById("reservation");
            if (resSection) resSection.scrollIntoView({ behavior: "smooth" });
        } else {
            openCart();
        }
    };

    // Alias toggleViewAll to openCatalogModal for full compatibility
    window.toggleViewAll = function (type) {
        openCatalogModal(type);
    };
`;

// Insert the popup catalog logic before the closing of DOMContentLoaded in script.js
if (!js.includes('VIEW MORE / CATALOG POPUP MODAL SYSTEM')) {
    js = js.replace(/\s*\}\);\s*$/, '\n' + catalogJS + '\n});\n');
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('Appended catalog popup system to script.js');
}

console.log('Successfully installed complete View More Popup Modal system!');
