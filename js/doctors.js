document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("appointmentForm");
    const message = document.getElementById("appointmentMessage");
    const dateInput = document.getElementById("appointmentDate");

    if (!form) return;

    // Prevent booking dates in the past
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localToday;

    const doctorSelect = document.getElementById("doctorName");
    const timeSelect = document.getElementById("appointmentTime");

    // Update available appointment slots
    function updateAvailableSlots() {
        const doctor = doctorSelect.value;
        const date = dateInput.value;

        const bookings = JSON.parse(
            localStorage.getItem("laxido_appointment_bookings") || "[]"
        );

        Array.from(timeSelect.options).forEach(function (option) {
            if (!option.value) return;

            const booked = bookings.some(function (booking) {
                return (
                    booking.doctor === doctor &&
                    booking.date === date &&
                    booking.time === option.value
                );
            });

            option.disabled = booked;
            option.textContent = booked
                ? option.value + " (Booked)"
                : option.value;
        });

        if (timeSelect.selectedOptions[0]?.disabled) {
            timeSelect.value = "";
        }
    }

    doctorSelect.addEventListener("change", updateAvailableSlots);
    dateInput.addEventListener("change", updateAvailableSlots);

    // Automatically select doctor when a doctor card is clicked
    document.querySelectorAll(".doctor-book-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const doctorCard = button.closest(".doctor-card");
            const doctorHeading = doctorCard.querySelector("h3");
            const doctorSelect = document.getElementById("doctorName");

            if (doctorHeading && doctorSelect) {
                doctorSelect.value = doctorHeading.textContent.trim();
                updateAvailableSlots();
            }
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const booking = {
            id: Date.now(),
            patientName: document.getElementById("patientName").value.trim(),
            email: document.getElementById("patientEmail").value.trim(),
            phone: document.getElementById("patientPhone").value.trim(),
            doctor: document.getElementById("doctorName").value,
            date: dateInput.value,
            time: document.getElementById("appointmentTime").value,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        if (booking.date < localToday) {
            message.textContent = "Please select a future appointment date.";
            return;
        }

        const bookings = JSON.parse(
            localStorage.getItem("laxido_appointment_bookings") || "[]"
        );

        const slotAlreadyBooked = bookings.some(function (existingBooking) {
            return (
                existingBooking.doctor === booking.doctor &&
                existingBooking.date === booking.date &&
                existingBooking.time === booking.time
            );
        });

        if (slotAlreadyBooked) {
            message.textContent =
                "This appointment slot is already booked. Please choose another time.";
            return;
        }

        bookings.push(booking);

        localStorage.setItem(
            "laxido_appointment_bookings",
            JSON.stringify(bookings)
        );

        message.textContent =
            "Appointment request submitted successfully! Your booking is Pending.";

        form.reset();
        dateInput.min = localToday;
        updateAvailableSlots();
    });
});
