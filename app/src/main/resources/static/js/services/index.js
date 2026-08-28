import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

const ADMIN_API = `${API_BASE_URL}/api/admin/login`;
const DOCTOR_API = `${API_BASE_URL}/api/doctors/login`;
const PATIENT_LOGIN_API = `${API_BASE_URL}/api/patients/login`;
const PATIENT_REGISTER_API = `${API_BASE_URL}/api/patients/register`;

window.onload = () => {
  const adminLoginBtn = document.getElementById("adminLogin");
  const patientLoginBtn = document.getElementById("patientLogin");
  const patientSignupBtn = document.getElementById("patientSignup");
  const doctorLoginBtn = document.getElementById("doctorLogin");

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => openModal("adminLogin"));
  }

  if (patientLoginBtn) {
    patientLoginBtn.addEventListener("click", () => openModal("patientLogin"));
  }

  if (patientSignupBtn) {
    patientSignupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  if (doctorLoginBtn) {
    doctorLoginBtn.addEventListener("click", () => openModal("doctorLogin"));
  }
};

window.adminLoginHandler = async function () {
  const username = document.getElementById("adminUsername")?.value;
  const password = document.getElementById("adminPassword")?.value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid admin credentials.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", "admin");

    selectRole("admin");
  } catch (error) {
    console.error("Admin login failed:", error);
    alert("An error occurred. Please try again later.");
  }
};

window.patientLoginHandler = async function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(PATIENT_LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid patient credentials.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", "patient");

    selectRole("patient");
  } catch (error) {
    console.error("Patient login failed:", error);
    alert("An error occurred. Please try again later.");
  }
};

window.patientSignupHandler = async function () {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const phone = document.getElementById("phone")?.value;
  const password = document.getElementById("password")?.value;

  if (!name || !email || !phone || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const patient = {
    name,
    email,
    phone,
    password
  };

  try {
    const response = await fetch(PATIENT_REGISTER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patient)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to create patient account.");
      return;
    }

    alert(data.message || "Account created successfully.");

    openModal("patientLogin");
  } catch (error) {
    console.error("Patient signup failed:", error);
    alert("An error occurred while creating your account.");
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById("doctorEmail")?.value;
  const password = document.getElementById("doctorPassword")?.value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid doctor credentials.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", "doctor");

    selectRole("doctor");
  } catch (error) {
    console.error("Doctor login failed:", error);
    alert("An error occurred. Please try again later.");
  }
};