// modals.js
export function openModal(type) {
  let modalContent = '';
  if (type === 'addDoctor') {
    modalContent = `
         <h2>Add Doctor</h2>
         <input type="text" id="doctorName" placeholder="Doctor Name" class="input-field">
         <select id="specialization" class="input-field select-dropdown">
             <option value="">Specialization</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Urologist">Urologist</option>
                        <option value="Oncologist">Oncologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                        <option value="General Physician">General Physician</option>

        </select>
        <input type="email" id="doctorEmail" placeholder="Email" class="input-field">
        <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
        <input type="text" id="doctorPhone" placeholder="Mobile No." class="input-field">
        <div class="availability-container">
        <label class="availabilityLabel">Select Availability:</label>
          <div class="doctorAvailability" class="checkbox-group">
              <label><input type="checkbox" name="availability" value="09:00-10:00"> 9:00 AM - 10:00 AM</label>
              <label><input type="checkbox" name="availability" value="10:00-11:00"> 10:00 AM - 11:00 AM</label>
              <label><input type="checkbox" name="availability" value="11:00-12:00"> 11:00 AM - 12:00 PM</label>
              <label><input type="checkbox" name="availability" value="12:00-13:00"> 12:00 PM - 1:00 PM</label>
          </div>
        </div>
        <button class="dashboard-btn" id="saveDoctorBtn">Save</button>
      `;
  } else if (type === 'patientLogin') {
    modalContent = `
        <h2>Patient Login</h2>
        <input class="input-field" id="email" type="email" placeholder="Email">
        <input class="input-field" id="password" type="password" placeholder="Password">

        <button id="loginBtn" class="dashboard-btn" onclick="loginPatient()">Login</button>
      `;
  }
  else if (type === "patientSignup") {
    modalContent = `
      <h2>Patient Signup</h2>
      <input class="input-field" id="name" type="text" placeholder="Name">
      <input class="input-field" id="email" type="email" placeholder="Email">
      <input class="input-field" id="phone" type="tel" placeholder="123-456-7890">
      <input class="input-field" id="password" type="password" placeholder="Password">
      <input class="input-field" id="address" type="text" placeholder="Address">

    <button id="signupBtn" class="dashboard-btn" onclick="signupPatient()">Create Account</button>
    `;

  } else if (type === 'adminLogin') {
    modalContent = `
        <h2>Admin Login</h2>
        <input type="text" id="adminUsername" name="username" placeholder="Username" class="input-field">
        <input type="password" id="adminPassword" name="password" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="adminLoginBtn" >Login</button>
      `;
  } else if (type === 'doctorLogin') {
    modalContent = `
        <h2>Doctor Login</h2>
        <input type="text" id="doctorEmail" placeholder="Email" class="input-field">
        <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="doctorLoginBtn" >Login</button>
      `;
  }

  document.getElementById('modal-body').innerHTML = modalContent;
  document.getElementById('modal').style.display = 'block';

  document.getElementById('closeModal').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };

  if (type === 'addDoctor') {
    document.getElementById('saveDoctorBtn').addEventListener('click', adminAddDoctor);
  }

  if (type === 'adminLogin') {
    document.getElementById('adminLoginBtn').addEventListener('click', adminLoginHandler);
  }

  if (type === 'doctorLogin') {
    document.getElementById('doctorLoginBtn').addEventListener('click', doctorLoginHandler);
  }
}
