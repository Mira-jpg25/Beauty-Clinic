/* =================================
   Beauty Clinic - JavaScript
================================= */


/* Services and Doctors Data */

const servicesData = {
    "Facial Care": {
        price: 800,
        doctors: ["Dr. Sara Ibrahim", "Dr. Mona Ahmed"]
    },

    "Body Care": {
        price: 1000,
        doctors: ["Dr. Mona Ahmed"]
    },

    "Hair Care": {
        price: 700,
        doctors: ["Dr. Sara Ibrahim"]
    },

    "Laser Treatment": {
        price: 1200,
        doctors: ["Dr. Ahmed Hassan", "Dr. Mona Ahmed"]
    },

    "Skin Treatment": {
        price: 900,
        doctors: ["Dr. Sara Ibrahim", "Dr. Ahmed Hassan"]
    }
};


/* Get Saved Bookings */

function getBookings() {
    return JSON.parse(localStorage.getItem("clinicBookings")) || [];
}


/* Save Bookings */

function saveBookings(bookings) {
    localStorage.setItem(
        "clinicBookings",
        JSON.stringify(bookings)
    );
}


/* =================================
   Booking Page
================================= */

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const stepOne = document.getElementById("stepOne");
    const stepTwo = document.getElementById("stepTwo");

    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    const serviceInput = document.getElementById("service");
    const doctorInput = document.getElementById("doctor");

    const priceInput = document.getElementById("price");
    const dateInput = document.getElementById("date");

    const message = document.getElementById("message");


    /* Set Minimum Date */

    const today = new Date();

    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    );

    dateInput.min = localToday.toISOString().split("T")[0];


    /* Check First Step */

    nextBtn.addEventListener("click", function () {

        const firstStepInputs = stepOne.querySelectorAll(
            "input, select"
        );

        let valid = true;

        message.textContent = "";

        firstStepInputs.forEach(function (input) {

            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }

        });

        if (!valid) {
            return;
        }

        if (Number(document.getElementById("age").value) < 1) {
            message.textContent = "Please enter a valid age.";
            return;
        }

        if (document.getElementById("phone").value.length !== 11) {
            message.textContent = "Phone number must be 11 digits.";
            return;
        }

        stepOne.classList.add("hidden");
        stepTwo.classList.remove("hidden");

        message.textContent = "";

    });


    /* Back Button */

    backBtn.addEventListener("click", function () {

        stepTwo.classList.add("hidden");
        stepOne.classList.remove("hidden");

        message.textContent = "";

    });


    /* Select Service */

    serviceInput.addEventListener("change", function () {

        const selectedService = serviceInput.value;

        doctorInput.innerHTML =
            '<option value="">Select Doctor</option>';

        priceInput.value = "";

        if (selectedService === "") {
            return;
        }

        const serviceInfo = servicesData[selectedService];

        // Show Service Price
        priceInput.value = serviceInfo.price + " EGP";

        // Add Available Doctors
        serviceInfo.doctors.forEach(function (doctor) {

            const option = document.createElement("option");

            option.value = doctor;
            option.textContent = doctor;

            doctorInput.appendChild(option);

        });

    });


    /* Confirm Booking */

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const age = document.getElementById("age").value;
        const email = document.getElementById("email").value.trim().toLowerCase();
        const phone = document.getElementById("phone").value;

        const service = serviceInput.value;
        const doctor = doctorInput.value;
        const date = dateInput.value;
        const time = document.getElementById("time").value;

        // Check Required Data

        if (!name || !age || !email || !phone ||
            !service || !doctor || !date || !time) {

            message.textContent = "Please complete all fields.";
            return;
        }

        if (!/^[0-9]{11}$/.test(phone) ||
            !phone.startsWith("01")) {

            message.textContent = "Enter a valid Egyptian phone number.";
            return;
        }

        // Check Doctor Availability for Service

        if (!servicesData[service].doctors.includes(doctor)) {

            message.textContent = "Please choose a valid doctor.";
            return;
        }

        // Check Date

        const selectedDate = new Date(date + "T00:00:00");
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {

            message.textContent = "Please choose a future date.";
            return;
        }

        // Get Existing Bookings

        const bookings = getBookings();

        // Check Same Doctor, Date and Time

        const isBooked = bookings.some(function (booking) {

            return booking.doctor === doctor &&
                booking.date === date &&
                booking.time === time &&
                booking.status !== "Cancelled";

        });

        if (isBooked) {

            message.textContent =
                "This appointment is already booked. Choose another time.";

            return;
        }


        // Create New Booking

        const newBooking = {

            id: Date.now(),

            name: name,
            age: age,
            email: email,
            phone: phone,

            service: service,
            doctor: doctor,

            price: servicesData[service].price,

            date: date,
            time: time,

            payment: "Cash at Clinic",

            status: "Pending"

        };


        // Save Booking

        bookings.push(newBooking);

        saveBookings(bookings);


        // Success Message

        message.textContent = "Booking completed successfully!";

        alert("Your appointment has been booked successfully!");

        // Go to My Appointments

        window.location.href = "appointments.html";

    });

}


/* =================================
   My Appointments Page
================================= */

const appointmentsTable =
    document.getElementById("appointmentsTable");

if (appointmentsTable) {

    const searchEmail = document.getElementById("searchEmail");

    const searchBtn = document.getElementById("searchBtn");

    const appointmentsMessage =
        document.getElementById("appointmentsMessage");


    /* Display Appointments */

    function displayAppointments(email) {

        const bookings = getBookings();

        appointmentsTable.innerHTML = "";

        const customerBookings = bookings.filter(function (booking) {

            return booking.email === email;

        });


        // No Bookings Found

        if (customerBookings.length === 0) {

            appointmentsMessage.textContent =
                "No appointments found for this email.";

            return;
        }


        appointmentsMessage.textContent =
            "Your appointments are displayed below.";


        // Create Table Rows

        customerBookings.forEach(function (booking, index) {

            const row = document.createElement("tr");

            const statusClass =
                booking.status === "Cancelled"
                    ? "cancelled"
                    : booking.status === "Confirmed"
                        ? "confirmed"
                        : "pending";


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>${booking.service}</td>

                <td>${booking.doctor}</td>

                <td>${booking.date}</td>

                <td>${booking.time}</td>

                <td>${booking.price} EGP</td>

                <td>
                    <span class="status ${statusClass}">
                        ${booking.status}
                    </span>
                </td>

                <td>
                    <button
                        class="cancel-btn"
                        data-id="${booking.id}"
                        ${booking.status === "Cancelled" ? "disabled" : ""}
                    >
                        ${booking.status === "Cancelled" ? "Cancelled" : "Cancel"}
                    </button>
                </td>

            `;

            appointmentsTable.appendChild(row);

        });

    }


    /* Search Button */

    searchBtn.addEventListener("click", function () {

        const email = searchEmail.value.trim().toLowerCase();

        if (email === "") {

            appointmentsMessage.textContent =
                "Please enter your email.";

            appointmentsTable.innerHTML = "";

            return;
        }

        if (!searchEmail.checkValidity()) {

            searchEmail.reportValidity();
            return;
        }

        displayAppointments(email);

    });


    /* Cancel Appointment */

    appointmentsTable.addEventListener("click", function (event) {

        if (!event.target.classList.contains("cancel-btn")) {
            return;
        }

        const bookingId = Number(event.target.dataset.id);

        const confirmCancel = confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        const bookings = getBookings();

        const booking = bookings.find(function (item) {

            return item.id === bookingId;

        });

        if (booking && booking.status !== "Cancelled") {

            booking.status = "Cancelled";

            saveBookings(bookings);

            displayAppointments(
                searchEmail.value.trim().toLowerCase()
            );

        }

    });

}