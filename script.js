const favoriteButtons = document.querySelectorAll(".favorite-btn");
const toast = document.getElementById("toast");

favoriteButtons.forEach((button) => {

    const card = button.closest(".game-card");

    if (!card) return;

    const title = card.querySelector("h3");
    const price = card.querySelector("p");
    const platform = card.querySelector("span");
    const image = card.querySelector("img");
    const icon = button.querySelector("i");

    if (!title || !price || !platform || !image || !icon) return;

    const game = {
        name: title.innerText,
        price: price.innerText,
        platform: platform.innerText,
        image: image.getAttribute("src")
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.some(item => item.name === game.name)) {
        button.classList.add("active");
        icon.classList.replace("fa-regular", "fa-solid");
    }

    button.addEventListener("click", function (e) {

        e.stopPropagation();

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const index = favorites.findIndex(item => item.name === game.name);

        if (index === -1) {

            favorites.push(game);

            button.classList.add("active");
            icon.classList.replace("fa-regular", "fa-solid");

            if (toast) {

                toast.querySelector("i").className = "fa-solid fa-heart";
                toast.querySelector("span").innerText = "Favorilərə əlavə edildi ❤️";

                toast.classList.add("show");

                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2500);

            }

        } else {

            favorites.splice(index, 1);

            button.classList.remove("active");
            icon.classList.replace("fa-solid", "fa-regular");

            if (toast) {

                toast.querySelector("i").className = "fa-solid fa-heart";
                toast.querySelector("span").innerText = "Favorilərdən silindi 💔";

                toast.classList.add("show");

                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2500);

            }

        }

        localStorage.setItem("favorites", JSON.stringify(favorites));

    });

});

// ================= NEWS MODAL =================

const newsCards = document.querySelectorAll(".news-card");
const modal = document.getElementById("newsModal");

if(modal){

const modalTitle=document.getElementById("modalTitle");
const modalImage=document.getElementById("modalImage");
const modalText=document.getElementById("modalText");
const closeModal=document.querySelector(".close-modal");

newsCards.forEach(card=>{

card.querySelector("button").addEventListener("click",()=>{

modal.classList.add("show");

modalTitle.innerText=card.dataset.title;
modalImage.src=card.querySelector("img").src;
modalText.innerText=card.dataset.text;

});

});

closeModal.addEventListener("click",()=>{

modal.classList.remove("show");

});

modal.addEventListener("click",(e)=>{

if(e.target===modal){

modal.classList.remove("show");

}

});

}

// ===============================
// CART SYSTEM
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addButtons = document.querySelectorAll(".add-cart, .cart-btn");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".game-card, .console-card, .package-card");

        if (!card) return;

        const name = card.querySelector("h3").innerText;

        let price = 0;

        if (card.querySelector(".package-price")) {

            price = parseFloat(
                card.querySelector(".package-price").innerText.replace("₼", "")
            );

        } else if (card.querySelector("h4")) {

            price = parseFloat(
                card.querySelector("h4").innerText.replace("₼", "")
            );

        } else if (card.querySelector("p")) {

            price = parseFloat(
                card.querySelector("p").innerText.replace("₼", "")
            );

        }

        const image = card.querySelector("img").src;

        const existing = cart.find(item => item.name === name);

        if (existing) {

            existing.quantity++;

        } else {

            cart.push({

                name: name,
                price: price,
                image: image,
                quantity: 1

            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        if (toast) {

            toast.querySelector("i").className = "fa-solid fa-cart-shopping";

            toast.querySelector("span").innerText = "Səbətə əlavə edildi 🛒";

            toast.classList.add("show");

            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);

        }

    });

});

function updateCartCount() {

    const count = document.getElementById("cart-count");

    if (!count) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    count.innerText = total;

}

updateCartCount();

// ===============================
// CART PAGE
// ===============================

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const whatsappBtn = document.getElementById("whatsapp-order");

if (cartItems) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    renderCart();

    function saveCart() {

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

    }

    function renderCart() {

        cartItems.innerHTML = "";

        let total = 0;

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <h2 style="text-align:center;">Səbət boşdur.</h2>
            `;

            cartTotal.innerText = "0 ₼";

            saveCart();

            return;

        }

        cart.forEach((item, index) => {

            total += item.price * item.quantity;

            cartItems.innerHTML += `

            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p>${item.price} ₼</p>

                </div>

                <div class="cart-actions">

                    <button class="minus" data-index="${index}">
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <span>${item.quantity}</span>

                    <button class="plus" data-index="${index}">
                        <i class="fa-solid fa-plus"></i>
                    </button>

                    <button class="remove" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

            `;

        });

        cartTotal.innerText = total + " ₼";

        saveCart();

        addEvents();

    }

    function addEvents() {

        document.querySelectorAll(".plus").forEach(btn => {

            btn.onclick = () => {

                const index = Number(btn.dataset.index);

                cart[index].quantity++;

                saveCart();

                renderCart();

            };

        });

        document.querySelectorAll(".minus").forEach(btn => {

            btn.onclick = () => {

                const index = Number(btn.dataset.index);

                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                }

                saveCart();

                renderCart();

            };

        });

        document.querySelectorAll(".remove").forEach(btn => {

            btn.onclick = () => {

                const index = Number(btn.dataset.index);

                cart.splice(index, 1);

                saveCart();

                renderCart();

            };

        });

    }

    if (whatsappBtn) {

        whatsappBtn.onclick = () => {

            if (cart.length === 0) {

                alert("Səbət boşdur.");

                return;

            }

            let message = "🎮 Salam GameVerse.%0A%0ASifariş etmək istəyirəm:%0A%0A";

            cart.forEach(item => {

                message += `• ${item.name}%0A`;
                message += `Say: ${item.quantity}%0A`;
                message += `Qiymət: ${item.price} ₼%0A%0A`;

            });

            message += `💰 Ümumi məbləğ: ${cartTotal.innerText}`;

            window.open(
                `https://wa.me/994XXXXXXXXX?text=${message}`,
                "_blank"
            );

        };

    }

}



// ===============================
// SEARCH MODAL
// ===============================

const searchBtn = document.getElementById("search-btn");
const searchModal = document.getElementById("search-modal");
const closeSearch = document.getElementById("close-search");
const searchInput = document.getElementById("search-input");

if (searchBtn && searchModal) {

    searchBtn.addEventListener("click", function (e) {

        e.preventDefault();

        searchModal.classList.add("active");

        setTimeout(() => {

            searchInput.focus();

        }, 250);

    });

    closeSearch.addEventListener("click", () => {

        searchModal.classList.remove("active");

        searchInput.value = "";

    });

    searchModal.addEventListener("click", function (e) {

        if (e.target === searchModal) {

            searchModal.classList.remove("active");

            searchInput.value = "";

        }

    });

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            searchModal.classList.remove("active");

            searchInput.value = "";

        }

    });

}