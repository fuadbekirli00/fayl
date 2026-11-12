const container = document.getElementById("favorites-container");

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Əgər favorit yoxdursa
if (favorites.length === 0) {

    container.innerHTML = `
        <div class="empty-favorites">
            <i class="fa-solid fa-heart-crack"></i>
            <h2>Favorilər boşdur</h2>
            <p>Bəyəndiyiniz oyunları ürək işarəsinə basaraq əlavə edin.</p>
            <a href="games.html" class="back-btn">Oyunlara bax</a>
        </div>
    `;

} else {

    favorites.forEach(game => {

        container.innerHTML += `

        <div class="game-card">

            <div class="favorite-btn active">
                <i class="fa-solid fa-heart"></i>
            </div>

            <img src="${game.image}" alt="${game.name}">

            <div class="game-info">

                <span>${game.platform}</span>

                <h3>${game.name}</h3>

                <p>${game.price}</p>

                <button class="add-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    Səbətə əlavə et
                </button>

            </div>

        </div>

        `;

    });

}

// Silmə funksiyası
document.addEventListener("click", function(e){

    const button = e.target.closest(".favorite-btn");

    if(!button) return;

    const card = button.closest(".game-card");

    const name = card.querySelector("h3").innerText;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(game => game.name !== name);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    card.style.transform = "scale(.8)";
    card.style.opacity = "0";

    setTimeout(()=>{

        card.remove();

        if(favorites.length===0){

            location.reload();

        }

    },300);

});

// ===============================
// FAVORITES -> CART
// ===============================

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".game-card");

        const name = card.querySelector("h3").innerText;

        const price = parseFloat(
            card.querySelector("p").innerText.replace("₼", "")
        );

        const image = card.querySelector("img").src;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.name === name);

        if (existing) {

            existing.quantity++;

        } else {

            cart.push({
                name,
                price,
                image,
                quantity: 1
            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Səbət sayını yenilə
        const count = document.getElementById("cart-count");

        if (count) {

            count.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

        }

        // Toast
        const toast = document.getElementById("toast");

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