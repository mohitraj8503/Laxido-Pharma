document.addEventListener("DOMContentLoaded", function () {
    const bookingList = document.getElementById("adminBookingList");

    const bookings = JSON.parse(
        localStorage.getItem("laxido_diagnostic_bookings") || "[]"
    );

    if (bookings.length === 0) {
        bookingList.innerHTML = "<p>No diagnostic bookings found.</p>";
        return;
    }

    bookingList.innerHTML = "";

    bookings.forEach(function (booking) {
        const card = document.createElement("div");
        card.className = "diagnostic-test-card";

        const title = document.createElement("h3");
        title.textContent = booking.test;

        const name = document.createElement("p");
        name.textContent = "Patient: " + booking.name;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + booking.phone;

        const date = document.createElement("p");
        date.textContent = "Preferred Date: " + booking.date;

        const status = document.createElement("p");
        status.textContent = "Status: " + booking.status;

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.className = "appointment-confirm-btn";
        confirmBtn.disabled = booking.status === "Confirmed";
        confirmBtn.addEventListener("click", function () {
            updateDiagnosticStatus(booking.id, "Confirmed");
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "appointment-cancel-btn";
        cancelBtn.disabled = booking.status === "Cancelled";
        cancelBtn.addEventListener("click", function () {
            updateDiagnosticStatus(booking.id, "Cancelled");
        });

        card.append(title, name, phone, date, status, confirmBtn, cancelBtn);
        bookingList.appendChild(card);
    });
});

// ===== DOCTOR APPOINTMENT BOOKINGS =====
document.addEventListener("DOMContentLoaded", function () {
    const appointmentList = document.getElementById("adminAppointmentList");

    if (!appointmentList) return;

    const bookings = JSON.parse(
        localStorage.getItem("laxido_appointment_bookings") || "[]"
    );

    if (bookings.length === 0) {
        appointmentList.innerHTML = "<p>No doctor appointments found.</p>";
        return;
    }

    appointmentList.innerHTML = "";

    bookings.forEach(function (booking) {
        const card = document.createElement("div");
        card.className = "diagnostic-test-card";

        const title = document.createElement("h3");
        title.textContent = booking.doctor;

        const name = document.createElement("p");
        name.textContent = "Patient: " + booking.patientName;

        const email = document.createElement("p");
        email.textContent = "Email: " + booking.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + booking.phone;

        const date = document.createElement("p");
        date.textContent = "Appointment Date: " + booking.date;

        const time = document.createElement("p");
        time.textContent = "Appointment Time: " + booking.time;

        const status = document.createElement("p");
        status.textContent = "Status: " + booking.status;

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.className = "appointment-confirm-btn";
        confirmBtn.disabled = booking.status === "Confirmed";
        confirmBtn.addEventListener("click", function () {
            updateAppointmentStatus(booking.id, "Confirmed");
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "appointment-cancel-btn";
        cancelBtn.disabled = booking.status === "Cancelled";
        cancelBtn.addEventListener("click", function () {
            updateAppointmentStatus(booking.id, "Cancelled");
        });

        card.append(title, name, email, phone, date, time, status, confirmBtn, cancelBtn);
        appointmentList.appendChild(card);
    });
});


// Update doctor appointment status
function updateAppointmentStatus(bookingId, newStatus) {
    const bookings = JSON.parse(
        localStorage.getItem("laxido_appointment_bookings") || "[]"
    );

    const updatedBookings = bookings.map(function (booking) {
        if (booking.id === bookingId) {
            booking.status = newStatus;
        }
        return booking;
    });

    localStorage.setItem(
        "laxido_appointment_bookings",
        JSON.stringify(updatedBookings)
    );

    location.reload();
}


function updateDiagnosticStatus(bookingId, newStatus) {
    const bookings = JSON.parse(
        localStorage.getItem("laxido_diagnostic_bookings") || "[]"
    );

    const updatedBookings = bookings.map(function (booking) {
        if (booking.id === bookingId) {
            booking.status = newStatus;
        }
        return booking;
    });

    localStorage.setItem(
        "laxido_diagnostic_bookings",
        JSON.stringify(updatedBookings)
    );

    location.reload();
}
