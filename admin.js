/* =========================
   1. Initial Data
========================= */

// Read data from LocalStorage
// If there is no data, use default data

let doctors = JSON.parse(localStorage.getItem("doctors")) || [
    {id: 1, name: "Dr. Ahmed Ali", specialty: "Dermatologist"},
    {id: 2, name: "Dr. Sara Mohamed", specialty: "Skin Specialist"},
    {id: 3, name: "Dr. Karim Hassan", specialty: "Laser Specialist"},
    {id: 4, name: "Dr. Mona Ibrahim", specialty: "Cosmetic Doctor"},
    {id: 5, name: "Dr. Youssef Kamal", specialty: "Plastic Surgeon"},
    {id: 6, name: "Dr. Nada Mostafa", specialty: "Dermatologist"},
    {id: 7, name: "Dr. Omar Fathy", specialty: "Aesthetic Doctor"},
    {id: 8, name: "Dr. Dalia Sameh", specialty: "Skin Specialist"},
    {id: 9, name: "Dr. Tarek Mahmoud", specialty: "Cosmetic Doctor"},
    {id: 10, name: "Dr. Heba Ali", specialty: "Laser Specialist"}
];


let services = JSON.parse(localStorage.getItem("services")) || [
    {id: 1, name: "Skin Care", price: 500, doctorId: 2},
    {id: 2, name: "Laser Treatment", price: 800, doctorId: 3},
    {id: 3, name: "Hair Treatment", price: 600, doctorId: 1},
    {id: 4, name: "Facial Care", price: 400, doctorId: 6},
    {id: 5, name: "Botox", price: 1500, doctorId: 4}
];


let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];


// Save all data
function saveData() {

    localStorage.setItem("doctors", JSON.stringify(doctors));

    localStorage.setItem("services", JSON.stringify(services));

    localStorage.setItem("appointments", JSON.stringify(appointments));

}


// Save initial data if not saved before
saveData();


/* =========================
   2. Login System
========================= */

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let username = document.getElementById("username").value;

        let password = document.getElementById("password").value;

        if (username === "admin" && password === "12345") {

            sessionStorage.setItem("adminLoggedIn", "true");

            window.location.href = "admin.html";

        } else {

            document.getElementById("loginMessage").textContent =
                "Invalid username or password!";

        }

    });

}


// Check admin login
if (window.location.pathname.endsWith("admin.html")) {

    if (sessionStorage.getItem("adminLoggedIn") !== "true") {

        window.location.href = "admin-login.html";

    }

}


// Logout
function logout() {

    sessionStorage.removeItem("adminLoggedIn");

    window.location.href = "admin-login.html";

}


/* =========================
   3. Helper Functions
========================= */

// Find doctor name by ID
function getDoctorName(id) {

    let doctor = doctors.find(function(item) {

        return item.id == id;

    });

    return doctor ? doctor.name : "Unknown Doctor";

}


// Find service name by ID
function getServiceName(id) {

    let service = services.find(function(item) {

        return item.id == id;

    });

    return service ? service.name : "Deleted Service";

}


// Prevent user-entered text from being treated as HTML
function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function(char) {

        let characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[char];

    });

}


// Show the correct doctor name in the service form
function updateDoctorOptions() {

    let select = document.getElementById("serviceDoctor");

    if (!select) return;

    let selectedValue = select.value;

    select.innerHTML = '<option value="">Choose Doctor</option>';

    doctors.forEach(function(doctor) {

        select.innerHTML += `
            <option value="${doctor.id}">
                ${escapeHTML(doctor.name)}
            </option>
        `;

    });

    if (doctors.some(function(d) {
        return String(d.id) === selectedValue;
    })) {

        select.value = selectedValue;

    }

}


/* =========================
   4. Manage Doctors
========================= */

function displayDoctors() {

    let table = document.getElementById("doctorsTable");

    if (!table) return;

    table.innerHTML = "";

    doctors.forEach(function(doctor) {

        table.innerHTML += `

            <tr>

                <td>${doctor.id}</td>

                <td>${escapeHTML(doctor.name)}</td>

                <td>${escapeHTML(doctor.specialty)}</td>

                <td>

                    <button class="edit-btn"
                        onclick="editDoctor(${doctor.id})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteDoctor(${doctor.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// Add or Update Doctor
let doctorForm = document.getElementById("doctorForm");

if (doctorForm) {

    doctorForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let id = document.getElementById("doctorId").value;

        let name = document.getElementById("doctorName").value.trim();

        let specialty = document.getElementById("doctorSpecialty").value.trim();

        if (!name || !specialty) return;

        if (id === "") {

            let newDoctor = {

                id: Date.now(),

                name: name,

                specialty: specialty

            };

            doctors.push(newDoctor);

        } else {

            let doctor = doctors.find(function(item) {

                return item.id == id;

            });

            if (doctor) {

                doctor.name = name;

                doctor.specialty = specialty;

            }

        }

        saveData();

        displayDoctors();

        updateDoctorOptions();

        displayServices();

        updateDashboard();

        resetDoctorForm();

    });

}


// Edit Doctor
function editDoctor(id) {

    let doctor = doctors.find(function(item) {

        return item.id == id;

    });

    if (!doctor) return;

    document.getElementById("doctorId").value = doctor.id;

    document.getElementById("doctorName").value = doctor.name;

    document.getElementById("doctorSpecialty").value = doctor.specialty;

    document.getElementById("doctorSubmit").textContent = "Update Doctor";

    document.getElementById("doctors").scrollIntoView();

}


// Delete Doctor
function deleteDoctor(id) {

    let doctorHasServices = services.some(function(service) {

        return service.doctorId == id;

    });

    if (doctorHasServices) {

        alert("This doctor has services. Reassign or delete these services first.");

        return;

    }

    if (!confirm("Are you sure you want to delete this doctor?")) {

        return;

    }

    doctors = doctors.filter(function(doctor) {

        return doctor.id != id;

    });

    saveData();

    displayDoctors();

    updateDoctorOptions();

    updateDashboard();

}


// Reset Doctor Form
function resetDoctorForm() {

    doctorForm.reset();

    document.getElementById("doctorId").value = "";

    document.getElementById("doctorSubmit").textContent = "Add Doctor";

}


/* =========================
   5. Manage Services
========================= */

function displayServices() {

    let table = document.getElementById("servicesTable");

    if (!table) return;

    table.innerHTML = "";

    services.forEach(function(service) {

        table.innerHTML += `

            <tr>

                <td>${service.id}</td>

                <td>${escapeHTML(service.name)}</td>

                <td>${service.price} EGP</td>

                <td>${escapeHTML(getDoctorName(service.doctorId))}</td>

                <td>

                    <button class="edit-btn"
                        onclick="editService(${service.id})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteService(${service.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// Add or Update Service
let serviceForm = document.getElementById("serviceForm");

if (serviceForm) {

    serviceForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let id = document.getElementById("serviceId").value;

        let name = document.getElementById("serviceName").value.trim();

        let price = Number(document.getElementById("servicePrice").value);

        let doctorId = Number(document.getElementById("serviceDoctor").value);

        if (!name || price <= 0 || !doctorId) {

            alert("Please enter valid service information.");

            return;

        }

        if (id === "") {

            services.push({

                id: Date.now(),

                name: name,

                price: price,

                doctorId: doctorId

            });

        } else {

            let service = services.find(function(item) {

                return item.id == id;

            });

            if (service) {

                service.name = name;

                service.price = price;

                service.doctorId = doctorId;

            }

        }

        saveData();

        displayServices();

        updateDashboard();

        resetServiceForm();

    });

}


// Edit Service
function editService(id) {

    let service = services.find(function(item) {

        return item.id == id;

    });

    if (!service) return;

    document.getElementById("serviceId").value = service.id;

    document.getElementById("serviceName").value = service.name;

    document.getElementById("servicePrice").value = service.price;

    document.getElementById("serviceDoctor").value = service.doctorId;

    document.getElementById("serviceSubmit").textContent = "Update Service";

    document.getElementById("services").scrollIntoView();

}


// Delete Service
function deleteService(id) {

    if (!confirm("Delete this service?")) return;

    services = services.filter(function(service) {

        return service.id != id;

    });

    saveData();

    displayServices();

    displayAppointments();

    updateDashboard();

}


// Reset Service Form
function resetServiceForm() {

    serviceForm.reset();

    document.getElementById("serviceId").value = "";

    document.getElementById("serviceSubmit").textContent = "Add Service";

}


/* =========================
   6. Manage Appointments
========================= */

function displayAppointments() {

    let table = document.getElementById("appointmentsTable");

    if (!table) return;

    table.innerHTML = "";

    appointments.forEach(function(appointment) {

        table.innerHTML += `

            <tr>

                <td>${escapeHTML(appointment.fullName)}</td>

                <td>${escapeHTML(appointment.phone)}</td>

                <td>${escapeHTML(getServiceName(appointment.serviceId))}</td>

                <td>${escapeHTML(getDoctorName(appointment.doctorId))}</td>

                <td>${escapeHTML(appointment.date)}</td>

                <td>${escapeHTML(appointment.time)}</td>

                <td>${escapeHTML(appointment.price)} EGP</td>

                <td>${escapeHTML(appointment.status)}</td>

                <td>

                    <button class="edit-btn"
                        onclick="editAppointment(${appointment.id})">
                        Edit
                    </button>

                    <button class="whatsapp-btn"
                        onclick="sendWhatsApp(${appointment.id})">
                        WhatsApp
                    </button>

                    <button class="confirm-btn"
                        onclick="confirmAppointment(${appointment.id})">
                        Confirm
                    </button>

                    <button class="delete-btn"
                        onclick="deleteAppointment(${appointment.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// Edit Appointment


   function editAppointment(id) {

    let appointment = appointments.find(function(item) {
        return item.id == id;
    });

    if (!appointment) return;

    let newDate = prompt(
        "New Date (YYYY-MM-DD):",
        appointment.date
    );

    if (newDate === null) return;

    let newTime = prompt(
        "New Time:",
        appointment.time
    );

    if (newTime === null) return;

    let newPrice = prompt(
        "New Price:",
        appointment.price
    );

    if (newPrice === null) return;

    let newServiceId = prompt(
        "New Service ID:",
        appointment.serviceId
    );

    if (newServiceId === null) return;

    let newDoctorId = prompt(
        "New Doctor ID:",
        appointment.doctorId
    );

    if (newDoctorId === null) return;

    let price = Number(newPrice);

    let serviceId = Number(newServiceId);

    let doctorId = Number(newDoctorId);

    let service = services.find(function(item) {
        return item.id === serviceId;
    });

    let doctor = doctors.find(function(item) {
        return item.id === doctorId;
    });

    if (
        !newDate ||
        !newTime ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !service ||
        !doctor ||
        service.doctorId !== doctorId
    ) {

        alert("Invalid data. Check the service and doctor IDs.");

        return;

    }

    appointment.date = newDate;
    appointment.time = newTime;
    appointment.price = price;
    appointment.serviceId = serviceId;
    appointment.doctorId = doctorId;

    saveData();

    displayAppointments();

    alert("Appointment updated successfully!");

} 

// Confirm Appointment
function confirmAppointment(id) {

    let appointment = appointments.find(function(item) {

        return item.id == id;

    });

    if (!appointment) return;

    appointment.status = "Confirmed";

    saveData();

    displayAppointments();

    updateDashboard();

    alert("Appointment confirmed!");

}


// Delete Appointment
function deleteAppointment(id) {

    if (!confirm("Are you sure you want to delete this appointment?")) {

        return;

    }

    appointments = appointments.filter(function(item) {

        return item.id != id;

    });

    saveData();

    displayAppointments();

    updateDashboard();

}


/* =========================
   7. WhatsApp
========================= */

function sendWhatsApp(id) {

    let appointment = appointments.find(function(item) {

        return item.id == id;

    });

    if (!appointment) return;

    // Convert Egyptian phone to international format
    let phone = String(appointment.phone).replace(/\D/g, "");

    if (phone.startsWith("0")) {

        phone = "20" + phone.substring(1);

    }

    if (!phone.startsWith("20")) {

        alert("Please enter an Egyptian phone number.");

        return;

    }

    let message =

        "Hello " + appointment.fullName +

        ", your appointment at Beauty Clinic: " +

        getServiceName(appointment.serviceId) +

        " with " + getDoctorName(appointment.doctorId) +

        " on " + appointment.date +

        " at " + appointment.time +

        ". Price: " + appointment.price + " EGP." +

        " Please confirm your appointment.";

    let whatsappURL =

        "https://wa.me/" + phone +

        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

}


/* =========================
   8. Dashboard Statistics
========================= */

function updateDashboard() {

    let doctorCount = document.getElementById("doctorCount");

    if (!doctorCount) return;

    doctorCount.textContent = doctors.length;

    document.getElementById("serviceCount").textContent =
        services.length;

    document.getElementById("appointmentCount").textContent =
        appointments.length;

    let pending = appointments.filter(function(appointment) {

        return appointment.status === "Pending";

    });

    document.getElementById("pendingCount").textContent =
        pending.length;

}


/* =========================
   9. Display All Data
========================= */

function displayAllData() {

    if (!document.getElementById("doctorsTable")) return;

    displayDoctors();

    updateDoctorOptions();

    displayServices();

    displayAppointments();

    updateDashboard();

}


// Run when page is loaded
if (document.getElementById("doctorsTable")) {

    displayAllData();

}