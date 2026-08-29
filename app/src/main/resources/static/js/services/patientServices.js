// patientServices
import { API_BASE_URL } from "../config/config.js";
const PATIENT_API = API_BASE_URL + '/api/patients'


//For creating a patient in db
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}/register`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return { success: response.ok, message: result.message }
  }
  catch (error) {
    console.error("Error :: patientSignup :: ", error)
    return { success: false, message: error.message }
  }
}

//For logging in patient
export async function patientLogin(data) {
  console.log("patientLogin :: ", data)
  return await fetch(`${PATIENT_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });


}

// For getting patient data (name ,id , etc ). Used in booking appointments
export async function fetchPatientDetails(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();
    if (response.ok) return data.patient;
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

// the Backend API for fetching the patient record(visible in Doctor Dashboard) and Appointments (visible in Patient Dashboard) are same based on user(patient/doctor).
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/appointments/${id}/${user}/${token}`);
    const data = await response.json();
    console.log(data.appointments)
    if (response.ok) {
      return data.appointments;
    }
    return null;
  }
  catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

export async function filterAppointments(condition = "", name = "", token) {
    try {
      const params = new URLSearchParams();
  
      if (condition) {
        params.append("condition", condition);
      }
  
      if (name) {
        params.append("name", name);
      }
  
      params.append("token", token);
  
      const response = await fetch(`${PATIENT_API}/appointments/filter?${params.toString()}`);
  
      if (!response.ok) {
        throw new Error("Failed to filter appointments");
      }
  
      const data = await response.json();
      return data.appointments || [];
    } catch (error) {
      console.error("Error filtering appointments:", error);
      return [];
    }
  }