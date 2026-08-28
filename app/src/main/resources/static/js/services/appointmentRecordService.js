// appointmentRecordService.js
import { API_BASE_URL } from "../config/config.js";

const APPOINTMENT_API = `${API_BASE_URL}/api/appointments`;

export async function getAllAppointments(date, patientName, token) {
  try {
    const params = new URLSearchParams();

    if (patientName) {
      params.append("patientName", patientName);
    }

    const url = `${APPOINTMENT_API}/${token}/${date}?${params.toString()}`;
    console.log("Fetching appointments:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch appointments");
    }

    return data.appointments || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function bookAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/book/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Something went wrong."
    };
  } catch (error) {
    console.error("Error booking appointment:", error);

    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

export async function updateAppointment(appointment, appointmentId, patientId, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/update/${token}/${appointmentId}/${patientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Something went wrong."
    };
  } catch (error) {
    console.error("Error updating appointment:", error);

    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

export async function cancelAppointment(appointmentId, patientId, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/cancel/${token}/${appointmentId}/${patientId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Something went wrong."
    };
  } catch (error) {
    console.error("Error canceling appointment:", error);

    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}