import { getDoctors, saveDoctor, filterDoctors } from "./doctorServices.js";
import { createDoctorCard } from "../components/doctorCard.js";
import { openModal } from "../components/modals.js";

// === Event Listener: Add Doctor Button ===
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addDoctorBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => openModal("addDoctor"));
  }

  // Load all doctors initially
  loadDoctorCards();

  // Add filter listeners
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
});

// === Load and Display All Doctor Cards ===
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (err) {
    console.error("Error loading doctor cards:", err);
  }
}

// === Filter Handler ===
async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar")?.value.trim() || "";
  const time = document.getElementById("filterTime")?.value || "";
  const specialty = document.getElementById("filterSpecialty")?.value || "";
  
  try {
    const result = await filterDoctors(name, time, specialty);

    if (result.length > 0) {
      renderDoctorCards(result);
    } else {
      document.getElementById("content").innerHTML = `<p class="noDoctorMsg">No doctors found with the given filters.</p>`;
    }
  } catch (err) {
    console.error("Error filtering doctors:", err);
    alert("Failed to filter doctors. Please try again.");
  }
}

// === Render Doctor Cards ===
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  doctors.forEach((doc) => {
    const card = createDoctorCard(doc);
    contentDiv.appendChild(card);
  });
}

// === Admin Add Doctor Handler ===
window.adminAddDoctor = async function () {
  const name = document.getElementById("doctorName")?.value.trim();
  const email = document.getElementById("doctorEmail")?.value.trim();
  const phone = document.getElementById("doctorPhone")?.value.trim();
  const password = document.getElementById("doctorPassword")?.value.trim();
  const specialty = document.getElementById("specialization")?.value.trim();
  const availableTimes = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(checkbox => checkbox.value);

  if (!name || !email || !phone || !password || !specialty || !availableTimes) {
    alert("Please fill in all fields.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/";
    return;
  }

  const doctor = {
    name,
    specialty,
    email,
    password,
    phone,
    availableTimes
  };

  try {
    const result = await saveDoctor(doctor, token);

    if (result.success) {
      alert("Doctor added successfully!");
      document.getElementById('modal').style.display = 'none';
      loadDoctorCards();
    } else {
      alert(`Failed to add doctor: ${result.message}`);
    }
  } catch (err) {
    console.error("Error adding doctor:", err);
    alert("An error occurred. Please try again.");
  }
};