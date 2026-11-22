document.addEventListener("DOMContentLoaded", function () {
    // ===== 1. Login / Logout Logic =====
    var loginBtn = document.getElementById("loginBtn");
    var logoutBtn = document.getElementById("logoutBtn");
    var myAccountLink = document.getElementById("myAccountLink");

    var user = localStorage.getItem("loggedInUser") || localStorage.getItem("user") || sessionStorage.getItem("loggedInUser");

    if (user) {
        // مسجل -> اخفي Login واظهري Logout و My Account
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (myAccountLink) myAccountLink.style.display = "inline-block";
    } else {
        // مش مسجل -> اظهري Login واخفي Logout و My Account
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (myAccountLink) myAccountLink.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("user");
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }

    // ===== 2. Filters + Search =====
    var searchInput = document.getElementById("search");
    var filterSpecialty = document.getElementById("filterSpecialty");
    var filterExp = document.getElementById("filterExp");
    var filterService = document.getElementById("filterService");
    var doctorItems = document.querySelectorAll(".doctor-item");

    function applyFilters() {
        var searchText = searchInput ? searchInput.value.toLowerCase() : "";
        var specialty = filterSpecialty ? filterSpecialty.value : "all";
        var exp = filterExp ? filterExp.value : "all";
        var service = filterService ? filterService.value : "all";

        doctorItems.forEach(function (item) {
            var name = item.querySelector("h6") ? item.querySelector("h6").textContent.toLowerCase() : "";
            var itemSpecialty = item.getAttribute("data-specialty");
            var itemExp = parseInt(item.getAttribute("data-exp"));
            var itemService = item.getAttribute("data-service");

            var show = true;
            if (searchText && !name.includes(searchText)) show = false;
            if (specialty !== "all" && specialty !== itemSpecialty) show = false;
            if (exp !== "all" && itemExp < parseInt(exp)) show = false;
            if (service !== "all" && service !== itemService) show = false;

            item.style.display = show ? "block" : "none";
        });
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterSpecialty) filterSpecialty.addEventListener("change", applyFilters);
    if (filterExp) filterExp.addEventListener("change", applyFilters);
    if (filterService) filterService.addEventListener("change", applyFilters);

    // ===== 3. Book Button =====
    var bookButtons = document.querySelectorAll(".btn-book");
    bookButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var doctor = btn.getAttribute("data-doctor");
            var service = btn.getAttribute("data-service");
            window.location.href = "booking.html?doctor=" + encodeURIComponent(doctor) + "&service=" + encodeURIComponent(service);
        });
    });
});