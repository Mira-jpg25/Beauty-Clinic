"use strict";

// Filter service cards by category.
var filterButtons = document.querySelectorAll(".filter-btn");
var serviceCards = document.querySelectorAll(".service-card");
var bookButtons = document.querySelectorAll(".book-btn");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        var category = button.getAttribute("data-category");

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });
        button.classList.add("active");

        serviceCards.forEach(function (card) {
            var serviceCategory = card.getAttribute("data-category");
            card.style.display = (category === "all" || category === serviceCategory)
                ? "block"
                : "none";
        });
    });
});

// Send the selected service to the booking page.
bookButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        var serviceName = button.getAttribute("data-service");
        window.location.href = "booking.html?service=" + encodeURIComponent(serviceName);
    });
});
