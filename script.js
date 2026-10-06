document.addEventListener("DOMContentLoaded", function () {

    /* ===================================================
       HOME SLIDESHOW
    =================================================== */
    var slides = document.querySelectorAll(".home-slide");
    var dots = document.querySelectorAll(".dot");
    var currentSlide = 0;
    var slideInterval;

    function showSlide(index) {
        if (!slides.length) return;
        slides.forEach(function (s) { s.classList.remove("active"); });
        dots.forEach(function (d) { d.classList.remove("active"); });
        slides[index].classList.add("active");
        if (dots[index]) dots[index].classList.add("active");
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
            var idx = parseInt(this.getAttribute("data-slide"));
            clearInterval(slideInterval);
            showSlide(idx);
            startSlideshow();
        });
    });

    if (slides.length > 0) {
        startSlideshow();
    }


    /* ===================================================
       MENU CATEGORY FILTERING & SLIDER
    =================================================== */
    var catButtons = document.querySelectorAll(".cat-btn");
    var productBoxes = document.querySelectorAll(".product-box");
    var slider = document.getElementById("products-slider");
    var prevBtn = document.getElementById("prev-btn");
    var nextBtn = document.getElementById("next-btn");

    function filterMenuCategory(category) {
        catButtons.forEach(function (btn) {
            if (btn.getAttribute("data-category") === category) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        productBoxes.forEach(function (box) {
            var itemCat = box.getAttribute("data-category");
            if (category === "all" || itemCat === category) {
                box.classList.remove("hide");
            } else {
                box.classList.add("hide");
            }
        });

        if (slider) {
            slider.scrollLeft = 0;
        }
    }

    catButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var cat = this.getAttribute("data-category");
            filterMenuCategory(cat);
        });
    });

    if (slider && prevBtn && nextBtn) {
        var scrollAmt = function () {
            var visibleBox = slider.querySelector(".product-box:not(.hide)");
            return visibleBox ? (visibleBox.offsetWidth + 22) * 2 : 320;
        };

        nextBtn.addEventListener("click", function () {
            slider.scrollBy({ left: scrollAmt(), behavior: "smooth" });
        });

        prevBtn.addEventListener("click", function () {
            slider.scrollBy({ left: -scrollAmt(), behavior: "smooth" });
        });
    }


    /* ===================================================
       NOOK QUICK-SELECT HELPER
    =================================================== */
    window.selectNookOption = function (nookName) {
        var nookSelect = document.getElementById("nook-select");
        if (nookSelect) {
            for (var i = 0; i < nookSelect.options.length; i++) {
                if (nookSelect.options[i].value === nookName || nookSelect.options[i].text.indexOf(nookName) !== -1) {
                    nookSelect.selectedIndex = i;
                    break;
                }
            }
        }
    };


    /* ===================================================
       ADD TO CART & CART SIDEBAR
    =================================================== */
    var cart = [];

    function getCartItem(name) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) return cart[i];
        }
        return null;
    }

    function renderCart() {
        var cartItems = document.getElementById("cart-items");
        var cartCount = document.getElementById("cart-count");
        var cartTotalSection = document.getElementById("cart-total-section");
        var cartTotalPrice = document.getElementById("cart-total-price");

        if (!cartItems) return;

        var total = 0;
        var totalQty = 0;
        cart.forEach(function (item) {
            total += item.price * item.qty;
            totalQty += item.qty;
        });

        if (cartCount) cartCount.textContent = totalQty;

        if (cart.length === 0) {
            cartItems.innerHTML = "<p class=\"cart-empty\">Your cart is empty. Tap 'Add to Cart' on any dish to order!</p>";
            if (cartTotalSection) cartTotalSection.style.display = "none";
            return;
        }

        if (cartTotalSection) cartTotalSection.style.display = "block";
        if (cartTotalPrice) cartTotalPrice.textContent = "\u20B9" + total;

        cartItems.innerHTML = "";
        cart.forEach(function (item) {
            var div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML =
                "<div class=\"cart-item-info\">" +
                    "<h4>" + item.name + "</h4>" +
                    "<span>\u20B9" + (item.price * item.qty) + "</span>" +
                "</div>" +
                "<div class=\"cart-item-controls\">" +
                    "<button class=\"cart-qty-btn\" data-action=\"minus\" data-name=\"" + item.name + "\" aria-label=\"Decrease quantity\">-</button>" +
                    "<span class=\"cart-qty\">" + item.qty + "</span>" +
                    "<button class=\"cart-qty-btn\" data-action=\"plus\" data-name=\"" + item.name + "\" aria-label=\"Increase quantity\">+</button>" +
                "</div>";
            cartItems.appendChild(div);
        });

        cartItems.querySelectorAll(".cart-qty-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var name = this.getAttribute("data-name");
                var action = this.getAttribute("data-action");
                var item = getCartItem(name);
                if (!item) return;
                if (action === "plus") {
                    item.qty++;
                } else {
                    item.qty--;
                    if (item.qty <= 0) {
                        cart = cart.filter(function (c) { return c.name !== name; });
                    }
                }
                renderCart();
            });
        });
    }

    document.querySelectorAll(".add-cart-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var name = this.getAttribute("data-name");
            var price = parseInt(this.getAttribute("data-price"));
            var existing = getCartItem(name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name: name, price: price, qty: 1 });
            }
            renderCart();
            openCart();

            // Button feedback
            var orig = this.innerHTML;
            this.innerHTML = "<i class='bx bx-check'></i> Added!";
            this.style.background = "#2e7d32";
            var self = this;
            setTimeout(function () {
                self.innerHTML = orig;
                self.style.background = "";
            }, 1000);
        });
    });

    // Confirm order button
    var orderBtn = document.querySelector(".cart-order-btn");
    if (orderBtn) {
        orderBtn.addEventListener("click", function () {
            if (cart.length === 0) return;
            alert("Order placed successfully! Your order is being freshly prepared in the kitchen. Please collect hot at the counter. Thank you!");
            cart = [];
            renderCart();
            closeCart();
        });
    }

    function openCart() {
        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");
        if (sidebar) sidebar.classList.add("open");
        if (overlay) overlay.classList.add("active");
    }

    function closeCart() {
        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("active");
    }

    var openCartBtn = document.getElementById("open-cart");
    if (openCartBtn) {
        openCartBtn.addEventListener("click", openCart);
    }

    var cartCloseBtn = document.getElementById("cart-close");
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener("click", closeCart);
    }

    var cartOverlay = document.getElementById("cart-overlay");
    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }


    /* ===================================================
       LOGIN / SIGNUP MODAL
    =================================================== */
    var modal = document.getElementById("auth-modal");
    var loginPanel = document.getElementById("login-panel");
    var signupPanel = document.getElementById("signup-panel");

    function openModal() {
        if (modal) modal.classList.add("active");
    }

    function closeModal() {
        if (modal) modal.classList.remove("active");
    }

    function showLogin() {
        if (loginPanel) loginPanel.classList.remove("hidden");
        if (signupPanel) signupPanel.classList.add("hidden");
    }

    function showSignup() {
        if (signupPanel) signupPanel.classList.remove("hidden");
        if (loginPanel) loginPanel.classList.add("hidden");
    }

    var openLoginBtn = document.getElementById("open-login");
    if (openLoginBtn) {
        openLoginBtn.addEventListener("click", function () {
            showLogin();
            openModal();
        });
    }

    var modalClose1 = document.getElementById("modal-close-btn");
    if (modalClose1) modalClose1.addEventListener("click", closeModal);

    var modalClose2 = document.getElementById("modal-close-btn2");
    if (modalClose2) modalClose2.addEventListener("click", closeModal);

    var goSignup = document.getElementById("go-signup");
    if (goSignup) {
        goSignup.addEventListener("click", function (e) {
            e.preventDefault();
            showSignup();
        });
    }

    var goLogin = document.getElementById("go-login");
    if (goLogin) {
        goLogin.addEventListener("click", function (e) {
            e.preventDefault();
            showLogin();
        });
    }

    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });
    }

    var loginSubmit = loginPanel ? loginPanel.querySelector(".modal-submit-btn") : null;
    if (loginSubmit) {
        loginSubmit.addEventListener("click", function () {
            alert("Welcome back to Chai & Chapter! You are now logged in.");
            closeModal();
        });
    }

    var signupSubmit = signupPanel ? signupPanel.querySelector(".modal-submit-btn") : null;
    if (signupSubmit) {
        signupSubmit.addEventListener("click", function () {
            alert("Welcome to Chai & Chapter! Your account has been created.");
            closeModal();
        });
    }


    /* ===================================================
       RESERVATION FORM
    =================================================== */
    var reservationForm = document.getElementById("reservation-form");

    if (reservationForm) {
        reservationForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = document.getElementById("guest-name").value;
            var nook = document.getElementById("nook-select").value;
            var date = document.getElementById("reservation-date").value;
            alert("Thank you " + name + "! Your " + nook + " reservation for " + date + " is confirmed. We will keep your table ready!");
            reservationForm.reset();
        });
    }


    /* ===================================================
       NEWSLETTER FORM
    =================================================== */
    var newsletterForm = document.getElementById("newsletter-form");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Welcome to The Chapter Club! You are successfully subscribed to our monthly book & chai letters.");
            newsletterForm.reset();
        });
    }


    /* ===================================================
       EVENT RSVP BUTTONS
    =================================================== */
    var eventButtons = document.querySelectorAll(".event-btn");

    eventButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var eventName = this.getAttribute("data-event");
            alert("Your RSVP for \"" + eventName + "\" has been registered! We look forward to seeing you.");
        });
    });

});
