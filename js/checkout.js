document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("laxido_cart") || "[]");

    const itemsContainer = document.getElementById("checkoutItems");
    const subtotalElement = document.getElementById("checkoutSubtotal");
    const totalElement = document.getElementById("checkoutTotal");
    const form = document.getElementById("checkoutForm");
    const message = document.getElementById("checkoutMessage");

    let subtotal = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty. <a href='pharmacy-delivery.html'>Continue shopping</a></p>";
        form.querySelector("button").disabled = true;
        return;
    }

    cart.forEach(function (item) {
        const itemTotal = Number(item.price) * Number(item.quantity);
        subtotal += itemTotal;

        const itemRow = document.createElement("div");
        itemRow.className = "checkout-item";

        const name = document.createElement("span");
        name.textContent = item.name + " × " + item.quantity;

        const price = document.createElement("strong");
        price.textContent = "₹" + itemTotal;

        itemRow.append(name, price);
        itemsContainer.appendChild(itemRow);
    });

    subtotalElement.textContent = "₹" + subtotal;
    totalElement.textContent = "₹" + subtotal;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const address = document.getElementById("customerAddress").value.trim();

        if (!name || !address) {
            message.textContent = "Please enter your full name and delivery address.";
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            message.textContent = "Please enter a valid 10-digit mobile number.";
            return;
        }

        if (!document.getElementById("customerEmail").checkValidity()) {
            message.textContent = "Please enter a valid email address.";
            return;
        }

        const order = {
            orderId: "LAX" + Date.now(),
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            email: document.getElementById("customerEmail").value.trim(),
            address: document.getElementById("customerAddress").value.trim(),
            items: cart,
            subtotal: subtotal,
            delivery: 0,
            total: subtotal,
            status: "Placed",
            createdAt: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem("laxido_orders") || "[]");
        orders.push(order);

        localStorage.setItem("laxido_orders", JSON.stringify(orders));
        localStorage.removeItem("laxido_cart");

        message.textContent = "Order placed successfully! Order ID: " + order.orderId;
        form.reset();
        form.querySelector("button").disabled = true;
    });
});
