/* ==========================================
   MEGHA QUIZ APP AUTH SYSTEM
========================================== */

/* ==========================================
   LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email =document.getElementById("email").value.trim();
      const password =document.getElementById("password").value;

      const users =JSON.parse(localStorage.getItem("users")) || [];

      const user =users.find(user =>user.email === email && user.password === password);

      if (user) {
        localStorage.setItem("currentUser",JSON.stringify(user));

        alert("Login Successful");

        window.location.href ="index.html";

      } else {
        alert("Invalid Email or Password");

      }

    }
  );

}

/* ==========================================
   SIGNUP
========================================== */

const signupForm =document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit",function (event) {
      event.preventDefault();
      const name =document.getElementById("name").value.trim();

      const email =document.getElementById("email").value.trim();

      const password =document.getElementById("password").value;

      const confirm_password =document.getElementById("confirm_password").value;

      if (password!==confirm_password){
        alert(`Password does not match`);
      const password =document.getElementById("password").value =``;

      const confirm_password =document.getElementById("confirm_password").value=``;

        return;
      }

      const users =JSON.parse(localStorage.getItem("users")) || [];
      const existingUser =users.find(user =>user.email === email);

      if (existingUser) {
        alert("Email already registered");
        return;
      }

      const newUser = {
        name,
        email,
        password
      };

      users.push(newUser);

      localStorage.setItem("users",JSON.stringify(users));

      alert(
        "Account created successfully"
      );

      window.location.href ="login.html";
    }
  );

}

/* ==========================================
   DISPLAY USER NAME
========================================== */

const currentUser =JSON.parse(localStorage.getItem("currentUser"));

const candidateName =document.getElementById("candidateName");

if (currentUser && candidateName) {

  candidateName.textContent =
    currentUser.name;

}

/* ==========================================
   PROTECT PAGES
========================================== */

const publicPages = [
  "login.html",
  "signup.html"
];

const currentPage =  window.location.pathname.split("/").pop();

if ( !currentUser && !publicPages.includes(currentPage)) {
  window.location.href =
    "login.html";
}

/* ==========================================
   LOGOUT
========================================== */

function logout() {

  localStorage.removeItem("currentUser");
  window.location.href ="login.html";
}

window.logout = logout;