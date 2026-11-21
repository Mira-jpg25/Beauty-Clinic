
// Booking Button

let bookButton = document.querySelector(".hero-content button");

bookButton.addEventListener("click", function() { 

    document.querySelector("#booking").scrollIntoView({
        behavior: "smooth"
    });

});


// Learn More Button

let learnButton = document.querySelector(".about-content button");

learnButton.addEventListener("click", function() {

    document.querySelector("#services").scrollIntoView({
        behavior: "smooth"
    });

});


// Booking Form

let bookingForm = document.querySelector("#bookingForm");

bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Your appointment has been booked successfully!");

    bookingForm.reset();

});
  document.addEventListener("DOMContentLoaded", function () {
    const openLogin = document.getElementById("openLogin");
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      // 1. إذا كان هناك مستخدم مسجل، حوّل الزر إلى Logout
      openLogin.textContent = "Logout";
      openLogin.href = "#"; // إلغاء الذهاب لصفحة اللوجين

      // 2. عند الضغط على Logout
      openLogin.addEventListener("click", function (e) {
        e.preventDefault();
        
        // مسح بيانات المستخدم المسجل
        localStorage.removeItem("currentUser");
        
        // إعادة الزر لحالته الأصلية أو تحديث الصفحة
        openLogin.textContent = "Login";
        openLogin.href = "login.html";
        window.location.reload(); // تحديث الصفحة لتأكيد الخروج
      });
    } else {
      // إذا لم يكن هناك مستخدم مسجل
      openLogin.textContent = "Login";
      openLogin.href = "login.html";
    }
  });


