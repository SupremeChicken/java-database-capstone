// prescriptionServices.js
import { API_BASE_URL } from "../config/config.js";

const PRESCRIPTION_API = `${API_BASE_URL}/api/prescription`;

export async function savePrescription(prescription, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/save/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prescription)
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Something went wrong."
    };
  } catch (error) {
    console.error("Error saving prescription:", error);

    return {
      success: false,
      message: "Unable to save prescription. Please try again."
    };
  }
}

export async function getPrescription(appointmentId, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/${appointmentId}/${token}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch prescription.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching prescription:", error);
    throw error;
  }
}