document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("adminPharmacyList");

    function loadRequests() {
        const requests = JSON.parse(
            localStorage.getItem("laxido_pharmacy_requests") || "[]"
        );

        document.getElementById("totalRequests").textContent = requests.length;

        document.getElementById("pendingRequests").textContent =
            requests.filter(request => request.status === "Pending").length;

        document.getElementById("completedRequests").textContent =
            requests.filter(request => request.status === "Delivered").length;

        if (requests.length === 0) {
            container.innerHTML = "<p>No pharmacy delivery requests found yet.</p>";
            return;
        }

        container.innerHTML = "";

        requests.forEach(function (request, index) {
            const card = document.createElement("article");
            card.className = "admin-order-card";

            const title = document.createElement("h3");
            title.textContent = "Request ID: " + request.id;

            const details = document.createElement("div");
            details.className = "admin-order-details";

            [
                "Customer: " + request.name,
                "Phone: " + request.phone,
                "Medicines: " + request.medicines,
                "Address: " + request.address
            ].forEach(function (value) {
                const p = document.createElement("p");
                p.textContent = value;
                details.appendChild(p);
            });

            const statusLabel = document.createElement("label");
            statusLabel.textContent = "Delivery Status: ";

            const statusSelect = document.createElement("select");

            ["Pending", "Confirmed", "Delivered", "Cancelled"].forEach(function (status) {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });

            statusSelect.value = request.status || "Pending";

            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.textContent = "Update Status";

            saveButton.addEventListener("click", function () {
                const updatedRequests = JSON.parse(
                    localStorage.getItem("laxido_pharmacy_requests") || "[]"
                );

                updatedRequests[index].status = statusSelect.value;

                localStorage.setItem(
                    "laxido_pharmacy_requests",
                    JSON.stringify(updatedRequests)
                );

                loadRequests();
            });

            const actions = document.createElement("div");
            actions.className = "admin-order-actions";
            actions.append(statusLabel, statusSelect, saveButton);

            card.append(title, details, actions);
            container.appendChild(card);
        });
    }

    loadRequests();
});
