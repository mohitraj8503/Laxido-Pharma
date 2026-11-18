document.addEventListener("DOMContentLoaded", function () {
    const ordersContainer = document.getElementById("adminOrdersList");
    const searchInput = document.getElementById("orderSearch");
    const statusFilter = document.getElementById("orderStatusFilter");

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem("laxido_orders") || "[]");

        document.getElementById("totalOrders").textContent = orders.length;

        document.getElementById("pendingOrders").textContent =
            orders.filter(order => order.status === "Pending" || order.status === "Placed").length;

        document.getElementById("completedOrders").textContent =
            orders.filter(order => order.status === "Delivered").length;

        if (orders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders found yet.</p>";
            return;
        }

        ordersContainer.innerHTML = "";

        const searchText = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;

        const filteredOrders = orders
            .map((order, index) => ({ order, index }))
            .filter(function (entry) {
                const order = entry.order;

                const matchesSearch =
                    (order.orderId || "").toLowerCase().includes(searchText) ||
                    (order.customerName || "").toLowerCase().includes(searchText);

                const matchesStatus =
                    selectedStatus === "all" ||
                    (order.status || "Placed") === selectedStatus;

                return matchesSearch && matchesStatus;
            });

        if (filteredOrders.length === 0) {
            ordersContainer.innerHTML = "<p>No matching orders found.</p>";
            return;
        }

        filteredOrders.forEach(function (entry) {
            const order = entry.order;
            const index = entry.index;
            const card = document.createElement("article");
            card.className = "admin-order-card";

            const title = document.createElement("h3");
            title.textContent = "Order ID: " + order.orderId;

            const details = document.createElement("div");
            details.className = "admin-order-details";

            const customer = document.createElement("p");
            customer.textContent = "Customer: " + order.customerName;

            const phone = document.createElement("p");
            phone.textContent = "Phone: " + order.phone;

            const email = document.createElement("p");
            email.textContent = "Email: " + order.email;

            const address = document.createElement("p");
            address.textContent = "Address: " + order.address;

            details.append(customer, phone, email, address);

            const items = document.createElement("div");
            items.className = "admin-order-items";

            const itemsHeading = document.createElement("strong");
            itemsHeading.textContent = "Ordered Products";

            const itemList = document.createElement("ul");

            order.items.forEach(function (item) {
                const listItem = document.createElement("li");
                listItem.textContent =
                    item.name + " × " + item.quantity + " — ₹" +
                    (Number(item.price) * Number(item.quantity));
                itemList.appendChild(listItem);
            });

            items.append(itemsHeading, itemList);

            const total = document.createElement("p");
            total.className = "admin-order-total";
            total.textContent = "Total: ₹" + order.total;

            const statusLabel = document.createElement("label");
            statusLabel.textContent = "Order Status: ";

            const statusSelect = document.createElement("select");

            ["Placed", "Pending", "Confirmed", "Delivered", "Cancelled"].forEach(function (status) {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });

            statusSelect.value = order.status || "Placed";

            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.textContent = "Update Status";

            saveButton.addEventListener("click", function () {
                const updatedOrders = JSON.parse(localStorage.getItem("laxido_orders") || "[]");

                updatedOrders[index].status = statusSelect.value;

                localStorage.setItem("laxido_orders", JSON.stringify(updatedOrders));

                loadOrders();
            });

            const actions = document.createElement("div");
            actions.className = "admin-order-actions";
            actions.append(statusLabel, statusSelect, saveButton);

            card.append(title, details, items, total, actions);
            ordersContainer.appendChild(card);
        });
    }

    searchInput.addEventListener("input", loadOrders);
    statusFilter.addEventListener("change", loadOrders);

    loadOrders();
});
