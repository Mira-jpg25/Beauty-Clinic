

var users = JSON.parse(localStorage.getItem("users")) ||[]

 var adminExists = users.some(function (user) {
    return user.role === "admin"
 })

 if (!adminExists) {
    users.push({
        fullName:"Admin",
        age:30,
        email:"adminclinic@gmail.com",
        password:"Admin@123",
        gender:"male",
        role: "admin"
    })
    localStorage.setItem("users", JSON.stringify(users))
 }

var loginForm = document.getElementById("loginForm")
var emailInput = document.getElementById("emailLogin")
var passwordInput = document.getElementById("passwordLogin")
var message = document.getElementById("Message1")

function showMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
    }

    loginForm.addEventListener("submit", function(e){
        e.preventDefault()

        var Email = emailInput.value.trim().toLowerCase()
        var Password = passwordInput.value

        if (Email === "" || Password === "") {
            showMessage("Please fill in all fields" , "red")
            return;
        }
      //   console.log(Email, Password, users);
        
 var foundUser = users.find(function (user) {
    return user.email === Email && user.password === Password
 }) 

 if (!foundUser) {
    showMessage("Email or password is incorrect", "red")
    return;
 }

 var currentUser = {
    fullName: foundUser.fullName,
    email: foundUser.email,
    role: foundUser.role
 }

 localStorage.setItem("currentUser" ,JSON.stringify(currentUser))



 showMessage("login successful", "green")

  setTimeout(function () {
 if (foundUser.role === "admin") {
     window.location.href = "admin.html"
 }else{
     window.location.href = "index.html"}
 } , 1500)
 
    }) 