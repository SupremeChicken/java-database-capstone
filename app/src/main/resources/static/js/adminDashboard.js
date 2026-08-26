import { getDoctors, saveDoctor, filterDoctors } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal, closeModal } from "./components/modals.js";

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
  document.getElementById("timeFilter")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("specialtyFilter")?.addEventListener("change", filterDoctorsOnChange);
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
  const time = document.getElementById("timeFilter")?.value || "";
  const specialty = document.getElementById("specialtyFilter")?.value || "";

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
  const name = document.getElementById("docName")?.value.trim();
  const email = document.getElementById("docEmail")?.value.trim();
  const phone = document.getElementById("docPhone")?.value.trim();
  const password = document.getElementById("docPassword")?.value.trim();
  const specialty = document.getElementById("docSpecialty")?.value.trim();
  const availableTimesInput = document.getElementById("docAvailableTimes")?.value.trim();

  if (!name || !email || !phone || !password || !specialty || !availableTimesInput) {
    alert("Please fill in all fields.");
    return;
  }

  const availableTimes = availableTimesInput.split(",").map(t => t.trim());
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/";
    return;
  }

  const doctor = {
    name,
    email,
    phone,
    password,
    specialty,
    availableTimes
  };

  try {
    const result = await saveDoctor(doctor, token);

    if (result.success) {
      alert("Doctor added successfully!");
      closeModal("addDoctor");
      loadDoctorCards();
    } else {
      alert(`Failed to add doctor: ${result.message}`);
    }
  } catch (err) {
    console.error("Error adding doctor:", err);
    alert("An error occurred. Please try again.");
  }
};