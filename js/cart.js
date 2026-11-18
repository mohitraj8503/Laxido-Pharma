document.addEventListener("DOMContentLoaded", function () {

    const cartItemsContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("cartSubtotal");
    const deliveryElement = document.getElementById("cartDelivery");
    const totalElement = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    let cart = JSON.parse(localStorage.getItem("laxido_cart")) || [];

    function renderCart() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add healthcare products to get started.</p>
                    <a href="pharmacy-delivery.html">Explore Pharmacy Services</a>
                </div>
            `;

            subtotalElement.textContent = "₹0";
            deliveryElement.textContent = "₹0";
            totalElement.textContent = "₹0";
            checkoutButton.disabled = true;
            return;
        }

        let subtotal = 0;

        cart.forEach(function (item, index) {
            const price = Number(item.price) || 0;
            const quantity = Math.max(1, Number(item.quantity) || 1);
            subtotal += price * quantity;

            const itemCard = document.createElement("div");
            itemCard.className = "cart-item";

            const name = document.createElement("h3");
            name.textContent = item.name || "Healthcare Product";

            const priceText = document.createElement("p");
            priceText.textContent = `₹${price} each`;

            const quantityControls = document.createElement("div");
            quantityControls.className = "quantity-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "−";
            decreaseButton.type = "button";
            decreaseButton.addEventListener("click", function () {
                if (quantity > 1) {
                    cart[index].quantity = quantity - 1;
                    saveCart();
                }
            });

            const quantityText = document.createElement("span");
            quantityText.textContent = quantity;

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.type = "button";
            increaseButton.addEventListener("click", function () {
                cart[index].quantity = quantity + 1;
                saveCart();
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.type = "button";
            removeButton.className = "remove-item";
            removeButton.addEventListener("click", function () {
                cart.splice(index, 1);
                saveCart();
            });

            quantityControls.append(
                decreaseButton,
                quantityText,
                increaseButton,
                removeButton
            );

            itemCard.append(name, priceText, quantityControls);
            cartItemsContainer.appendChild(itemCard);
        });

        const delivery = 0;

        subtotalElement.textContent = `₹${subtotal}`;
        deliveryElement.textContent = `₹${delivery}`;
        totalElement.textContent = `₹${subtotal + delivery}`;
        checkoutButton.disabled = false;
    }

    function saveCart() {
        localStorage.setItem("laxido_cart", JSON.stringify(cart));
        renderCart();
    }

    checkoutButton.addEventListener("click", function () {
        if (cart.length > 0) {
            window.location.href = "checkout.html";
        }
    });

    renderCart();
});
