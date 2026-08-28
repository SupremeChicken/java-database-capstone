import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRecordRow.js";

// === State Variables ===
const tableBody = document.getElementById("patientTableBody");
const token = localStorage.getItem("token");
let selectedDate = new Date().toISOString().split("T")[0]; // today's date in YYYY-MM-DD
let patientName = null;

// === Search Bar Filtering ===
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.trim();
    patientName = query !== "" ? query : null;
    loadAppointments();
  });
}

// === "Today" Button Handler ===
const todayButton = document.getElementById("todayButton");
if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").value = selectedDate;
    loadAppointments();
  });
}

// === Date Picker Change Handler ===
const datePicker = document.getElementById("datePicker");
if (datePicker) {
  datePicker.addEventListener("change", () => {
    selectedDate = datePicker.value;
    loadAppointments();
  });
}

// === Load Appointments Based on Date & Optional Name Filter ===
async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(selectedDate, patientName, token);
    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="noPatientRecord">No Appointments found for selected date.</td></tr>`;
      return;
    }

    appointments.forEach(app => {
        console.log(app);
      const patient = {
        id: app.patient.id,
        name: app.patient.name,
        email: app.patient.email,
        phone: app.patient.phone
      };
      const row = createPatientRow(app, patient);
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading appointments:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="noPatientRecord">Error loading appointments. Try again later.</td></tr>`;
  }
}

// === Initialize Page on Load ===
document.addEventListener("DOMContentLoaded", () => {
  renderContent(); // Injects header/footer layout
  loadAppointments(); // Loads today's appointments
});