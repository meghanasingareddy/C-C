document.addEventListener("DOMContentLoaded", function () {

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

        if (dots[index]) {
            dots[index].classList.add("active");
        }

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

    if (slides.length > 0) {
        startSlideshow();
    }


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

            if (category === "all" || itemCategory === category) {
                box.classList.remove("hide");
            } else {
                box.classList.add("hide");
            }
        });

        if (slider) {
            slider.scrollLeft = 0;
        }
    }

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

            if (visibleBox) {
                return (visibleBox.offsetWidth + 22) * 2;
            }

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


    /* NOOK QUICK SELECT */

    window.selectNookOption = function (nookName) {

        var nookSelect = document.getElementById("nook-select");

        if (!nookSelect) return;

        for (var i = 0; i < nookSelect.options.length; i++) {

            if (
                nookSelect.options[i].value === nookName ||
                nookSelect.options[i].text.indexOf(nookName) !== -1
            ) {
                nookSelect.selectedIndex = i;
                break;
            }
        }
    };


    /* CART */

    var cart = [];

    function getCartItem(name) {

        for (var i = 0; i < cart.length; i++) {

            if (cart[i].name === name) {
                return cart[i];
            }
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
        var totalQuantity = 0;

        cart.forEach(function (item) {

            total += item.price * item.qty;
            totalQuantity += item.qty;

        });

        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }

        if (cart.length === 0) {

            cartItems.innerHTML =
                "<p class=\"cart-empty\">Your cart is empty. Add some items!</p>";

            if (cartTotalSection) {
                cartTotalSection.style.display = "none";
            }

            return;
        }

        if (cartTotalSection) {
            cartTotalSection.style.display = "block";
        }

        if (cartTotalPrice) {
            cartTotalPrice.textContent = "₹" + total;
        }

        cartItems.innerHTML = "";

        cart.forEach(function (item) {

            var div = document.createElement("div");

            div.className = "cart-item";

            div.innerHTML =
                "<div class=\"cart-item-info\">" +
                    "<h4>" + item.name + "</h4>" +
                    "<span>₹" + (item.price * item.qty) + "</span>" +
                "</div>" +

                "<div class=\"cart-item-controls\">" +

                    "<button class=\"cart-qty-btn\" " +
                    "data-action=\"minus\" " +
                    "data-name=\"" + item.name + "\">-</button>" +

                    "<span class=\"cart-qty\">" +
                    item.qty +
                    "</span>" +

                    "<button class=\"cart-qty-btn\" " +
                    "data-action=\"plus\" " +
                    "data-name=\"" + item.name + "\">+</button>" +

                "</div>";

            cartItems.appendChild(div);
        });

        cartItems.querySelectorAll(".cart-qty-btn").forEach(function (button) {

            button.addEventListener("click", function () {

                var name = this.getAttribute("data-name");
                var action = this.getAttribute("data-action");

                var item = getCartItem(name);

                if (!item) return;

                if (action === "plus") {

                    item.qty++;

                } else {

                    item.qty--;

                    if (item.qty <= 0) {

                        cart = cart.filter(function (cartItem) {
                            return cartItem.name !== name;
                        });

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

            if (existingItem) {

                existingItem.qty++;

            } else {

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


    /* CART ORDER */

    var orderButton = document.querySelector(".cart-order-btn");

    if (orderButton) {

        orderButton.addEventListener("click", function () {

            if (cart.length === 0) return;

            alert(
                "Order placed successfully! " +
                "Your order is being freshly prepared in the kitchen. " +
                "Please collect hot at the counter. Thank you!"
            );

            cart = [];

            renderCart();
            closeCart();
        });
    }


    /* OPEN CART */

    function openCart() {

        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("active");
        }
    }


    /* CLOSE CART */

    function closeCart() {

        var sidebar = document.getElementById("cart-sidebar");
        var overlay = document.getElementById("cart-overlay");

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }
    }


    var openCartButton = document.getElementById("open-cart");

    if (openCartButton) {
        openCartButton.addEventListener("click", openCart);
    }


    var cartCloseButton = document.getElementById("cart-close");

    if (cartCloseButton) {
        cartCloseButton.addEventListener("click", closeCart);
    }


    var cartOverlay = document.getElementById("cart-overlay");

    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }


    /* LOGIN / SIGNUP */

    var modal = document.getElementById("auth-modal");
    var loginPanel = document.getElementById("login-panel");
    var signupPanel = document.getElementById("signup-panel");


    function openModal() {

        if (modal) {
            modal.classList.add("active");
        }
    }


    function closeModal() {

        if (modal) {
            modal.classList.remove("active");
        }
    }


    function showLogin() {

        if (loginPanel) {
            loginPanel.classList.remove("hidden");
        }

        if (signupPanel) {
            signupPanel.classList.add("hidden");
        }
    }


    function showSignup() {

        if (signupPanel) {
            signupPanel.classList.remove("hidden");
        }

        if (loginPanel) {
            loginPanel.classList.add("hidden");
        }
    }


    var openLoginButton = document.getElementById("open-login");

    if (openLoginButton) {

        openLoginButton.addEventListener("click", function () {

            showLogin();
            openModal();

        });
    }


    var modalCloseButton = document.getElementById("modal-close-btn");

    if (modalCloseButton) {
        modalCloseButton.addEventListener("click", closeModal);
    }


    var modalCloseButton2 = document.getElementById("modal-close-btn2");

    if (modalCloseButton2) {
        modalCloseButton2.addEventListener("click", closeModal);
    }


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

            if (event.target === modal) {
                closeModal();
            }

        });
    }


    /* LOGIN BUTTON */

    var loginSubmit = loginPanel
        ? loginPanel.querySelector(".modal-submit-btn")
        : null;

    if (loginSubmit) {

        loginSubmit.addEventListener("click", function () {

            alert(
                "Welcome back to Chai & Chapter! " +
                "You are now logged in."
            );

            closeModal();

        });
    }


    /* SIGNUP BUTTON */

    var signupSubmit = signupPanel
        ? signupPanel.querySelector(".modal-submit-btn")
        : null;

    if (signupSubmit) {

        signupSubmit.addEventListener("click", function () {

            alert(
                "Welcome to Chai & Chapter! " +
                "Your account has been created."
            );

            closeModal();

        });
    }


    /* RESERVATION */

    var reservationForm =
        document.getElementById("reservation-form");

    if (reservationForm) {

        reservationForm.addEventListener("submit", function (event) {

            event.preventDefault();

            var name =
                document.getElementById("guest-name").value;

            var nook =
                document.getElementById("nook-select").value;

            var date =
                document.getElementById("reservation-date").value;

            alert(
                "Thank you " +
                name +
                "! Your " +
                nook +
                " reservation for " +
                date +
                " is confirmed."
            );

            reservationForm.reset();

        });
    }


    /* NEWSLETTER */

    var newsletterForm =
        document.getElementById("newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert(
                "Welcome to The Chapter Club! " +
                "You are successfully subscribed to our monthly book & chai letters."
            );

            newsletterForm.reset();

        });
    }


    /* EVENT RSVP */

    var eventButtons =
        document.querySelectorAll(".event-btn");

    eventButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            var eventName =
                this.getAttribute("data-event");

            alert(
                "Your RSVP for \"" +
                eventName +
                "\" has been registered! " +
                "We look forward to seeing you."
            );

        });
    });

});