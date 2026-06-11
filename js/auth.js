/* ==========================================
   MEGHA QUIZ APP - AUTH SYSTEM (CLEAN VERSION)
========================================== */

/* ==========================================
   GET CURRENT USER (GLOBAL)
========================================== */

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/* ==========================================
   LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid Email or Password");
      return;
    }

    // Save session user (important)
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login Successful");

    window.location.href = "index.html";
  });
}

/* ==========================================
   SIGNUP
========================================== */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(u => u.email === email);

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

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully");

    window.location.href = "login.html";
  });
}

/* ==========================================
   DISPLAY USER NAME (GLOBAL AUTO SYSTEM)
========================================== */

function displayUserName() {
  const user = getCurrentUser();

  // Support multiple pages (practice, dashboard, profile, navbar)
  const nameElement =
    document.getElementById("name") ||
    document.getElementById("candidateName");

  if (!nameElement) return;

  if (user && user.name) {
    nameElement.textContent = user.name;
  } else {
    nameElement.textContent = "Guest User";
  }
}

/* Run automatically */
displayUserName();

/* ==========================================
   PAGE PROTECTION
========================================== */

const publicPages = ["login.html", "signup.html"];

const currentPage = window.location.pathname.split("/").pop();

const user = getCurrentUser();

if (!user && !publicPages.includes(currentPage)) {
  window.location.href = "login.html";
}

/* ==========================================
   LOGOUT
========================================== */

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// make global
window.logout = logout;