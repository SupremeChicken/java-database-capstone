// header.js — dynamic header renderer for all pages

export function renderHeader() {
  const headerDiv = document.getElementById("header");

  // If on root/index page, show minimal header
  if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>`;
    return;
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  let headerContent = `
    <header class="header">
      <div class="logo-section">
        <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </div>
      <nav class="header-nav">`;

  // Handle invalid sessions
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  // Role-specific header actions
  if (role === "admin") {
    headerContent += `
      <a href="#" id="adminLogout">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
      <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
      <a href="#" id="doctorLogout">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
      <button id="patientLogin" class="adminBtn">Login</button>
      <button id="patientSignup" class="adminBtn">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
      <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
      <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
      <a href="#" id="patientLogout">Logout</a>`;
  }

  // Close nav + header
  headerContent += `</nav></header>`;

  // Render to DOM
  headerDiv.innerHTML = headerContent;

  // Add behavior for dynamic buttons
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const patientLogin = document.getElementById("patientLogin");
  const patientSignup = document.getElementById("patientSignup");
  const adminLogout = document.getElementById("adminLogout");
  const doctorLogout = document.getElementById("doctorLogout");
  const patientLogout = document.getElementById("patientLogout");

  if (patientLogin) {
    patientLogin.addEventListener("click", () => openModal("patientLogin"));
  }

  if (patientSignup) {
    patientSignup.addEventListener("click", () => openModal("patientSignup"));
  }

  if (adminLogout) {
    adminLogout.addEventListener("click", logout);
  }

  if (doctorLogout) {
    doctorLogout.addEventListener("click", logout);
  }

  if (patientLogout) {
    patientLogout.addEventListener("click", logoutPatient);
  }
}

// Generic logout function (Admin/Doctor)
function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
  window.location.href = "/";
}

// Patient-specific logout
function logoutPatient() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
  window.location.href = "/pages/patientDashboard.html";
}

// Immediately render the header
renderHeader();