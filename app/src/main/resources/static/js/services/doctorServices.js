import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = `${API_BASE_URL}/api/doctors`;

export async function getDoctors() {
  try {
    const response = await fetch(`${DOCTOR_API}`);

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function deleteDoctor(doctorId, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/delete/${token}/${doctorId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);

    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/register/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message
    };
  } catch (error) {
    console.error("Error saving doctor:", error);

    return {
      success: false,
      message: "Unable to save doctor. Please try again."
    };
  }
}

export async function filterDoctors(name = "", time = "", specialty = "") {
  try {
    const params = new URLSearchParams();

    if (name) {
      params.append("name", name);
    }

    if (time) {
      params.append("time", time);
    }

    if (specialty) {
      params.append("specialty", specialty);
    }

    const response = await fetch(`${DOCTOR_API}/filter?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to filter doctors");
    }

    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Error filtering doctors:", error);
    return [];
  }
}