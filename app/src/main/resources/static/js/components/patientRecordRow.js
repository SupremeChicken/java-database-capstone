// patientRecordRow.js
export function createPatientRow(app, patient) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${app.appointmentTimeOnly}</td>
      <td class="patient-id">${patient.id}</td>
      <td>${patient.name}</td>
      <td>${patient.phone}</td>
      <td>${patient.email}</td>
      <td><img src="../assets/images/addPrescriptionIcon/addPrescription.png" alt="addPrescriptionIcon" class="prescription-btn" data-id="${patient.id}"></img></td>
    `;

  // Attach event listeners
  tr.querySelector(".prescription-btn").addEventListener("click", () => {
    window.location.href = `/pages/addPrescription.html?mode=view&appointmentId=${app.id}`;
  });

  return tr;
}
