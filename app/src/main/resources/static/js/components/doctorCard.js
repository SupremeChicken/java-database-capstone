import { deleteDoctor } from '../services/doctorServices.js';
import { showBookingOverlay } from '../loggedPatient.js';
import { fetchPatientDetails } from '../services/patientServices.js';

export function createDoctorCard(doctor) {
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // === Main Card Container ===
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // === Info Section ===
  const info = document.createElement("div");
  info.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = `${doctor.name}`;

  const specialty = document.createElement("p");
  specialty.textContent = `Specialty: ${doctor.specialty}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email}`;

  const phone = document.createElement("p");
  phone.textContent = `Phone: ${doctor.phone}`;

  const timeList = document.createElement("ul");
  timeList.classList.add("availability-list");
  doctor.availableTimes?.forEach(time => {
    const li = document.createElement("li");
    li.textContent = time;
    timeList.appendChild(li);
  });

  info.append(name, specialty, email, phone, timeList);

  // === Action Button Container ===
  const actions = document.createElement("div");
  actions.classList.add("doctor-actions");

  // === ADMIN: DELETE DOCTOR ===
  if (role === "admin") {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "adminBtn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      if (!token) {
        alert("Admin session expired. Please log in again.");
        window.location.href = "/";
        return;
      }

      if (!confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) return;

      try {
        const success = await deleteDoctor(doctor.id, token);
        if (success) {
          alert("Doctor deleted successfully.");
          card.remove();
        } else {
          alert("Failed to delete doctor.");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting doctor.");
      }
    });

    actions.appendChild(deleteBtn);
  }

  // === PATIENT (NOT LOGGED-IN) ===
  else if (role === "patient") {
    const bookBtn = document.createElement("button");
    bookBtn.className = "adminBtn";
    bookBtn.textContent = "Book Now";

    bookBtn.addEventListener("click", () => {
      alert("Please log in before booking an appointment.");
      window.location.href = "/pages/patientDashboard.html";
    });

    actions.appendChild(bookBtn);
  }

  // === LOGGED-IN PATIENT ===
  else if (role === "loggedPatient") {
    const bookBtn = document.createElement("button");
    bookBtn.className = "adminBtn";
    bookBtn.textContent = "Book Now";

    bookBtn.addEventListener("click", async () => {
      if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "/pages/patientDashboard.html";
        return;
      }

      try {
        const patient = await fetchPatientDetails(token);
        showBookingOverlay(doctor, patient);
      } catch (err) {
        console.error(err);
        alert("Error fetching patient details.");
      }
    });

    actions.appendChild(bookBtn);
  }

  // === Final Assembly ===
  card.appendChild(info);
  card.appendChild(actions);

  return card;
}