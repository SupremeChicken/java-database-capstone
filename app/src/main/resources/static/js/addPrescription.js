import { savePrescription, getPrescription } from "./services/prescriptionServices.js";

document.addEventListener("DOMContentLoaded", async () => {
  const savePrescriptionBtn = document.getElementById("savePrescription");
  const patientNameInput = document.getElementById("patientName");
  const medicinesInput = document.getElementById("medicines");
  const dosageInput = document.getElementById("dosage");
  const notesInput = document.getElementById("notes");
  const heading = document.getElementById("heading");

  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get("appointmentId");
  const mode = urlParams.get("mode");
  const patientName = urlParams.get("patientName");
  const token = localStorage.getItem("token");

  if (!appointmentId || !token) {
    alert("Invalid appointment or session.");
    return;
  }

  if (heading) {
    heading.innerHTML = mode === "view"
      ? "View <span>Prescription</span>"
      : "Add <span>Prescription</span>";
  }

  if (patientNameInput && patientName) {
    patientNameInput.value = patientName;
  }

  try {
    const response = await getPrescription(appointmentId, token);

    if (response?.prescription) {
      const existingPrescription = response.prescription;

      patientNameInput.value = existingPrescription.patientName || patientName || "";
      medicinesInput.value = existingPrescription.medication || "";
      dosageInput.value = existingPrescription.dosage || "";
      notesInput.value = existingPrescription.doctorNotes || "";
    }
  } catch (error) {
    console.warn("No existing prescription found:", error);
  }

  if (mode === "view") {
    patientNameInput.disabled = true;
    medicinesInput.disabled = true;
    dosageInput.disabled = true;
    notesInput.disabled = true;

    if (savePrescriptionBtn) {
      savePrescriptionBtn.style.display = "none";
    }

    return;
  }

  if (!savePrescriptionBtn) {
    return;
  }

  savePrescriptionBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const prescription = {
      patientName: patientNameInput.value.trim(),
      medication: medicinesInput.value.trim(),
      dosage: dosageInput.value.trim(),
      doctorNotes: notesInput.value.trim(),
      appointmentId: Number(appointmentId)
    };

    if (!prescription.patientName || !prescription.medication || !prescription.dosage) {
      alert("Please fill in all required prescription fields.");
      return;
    }

    const { success, message } = await savePrescription(prescription, token);

    if (success) {
      alert("Prescription saved successfully.");
      selectRole("doctor");
    } else {
      alert("Failed to save prescription. " + message);
    }
  });
});