// patientDashboard.js
import { getDoctors } from './services/doctorServices.js';
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { filterDoctors } from './services/doctorServices.js';//call the same function to avoid duplication coz the functionality was same
import { patientSignup, patientLogin } from './services/patientServices.js';



document.addEventListener("DOMContentLoaded", () => {
  // Load all doctors initially
  loadDoctorCards();

  // Add filter listeners
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("patientSignup");
  if (btn) {
    btn.addEventListener("click", () => openModal("patientSignup"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLogin")
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      openModal("patientLogin")
    })
  }
})

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

window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    }
    else alert(message);
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email,
      password
    }
    console.log("loginPatient :: ", data)
    const response = await patientLogin(data);
    console.log("Status Code:", response.status);
    console.log("Response OK:", response.ok);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      selectRole('loggedPatient');
      localStorage.setItem('token', result.token)
      window.location.href = '/pages/loggedPatientDashboard.html';
    } else {
      alert('❌ Invalid credentials!');
    }
  }
  catch (error) {
    alert("❌ Failed to Login : ", error);
    console.log("Error :: loginPatient :: ", error)
  }


}
