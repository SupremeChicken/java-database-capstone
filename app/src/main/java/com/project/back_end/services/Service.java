package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@org.springframework.stereotype.Service
public class Service {

    public final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Service(TokenService tokenService, AdminRepository adminRepository, DoctorRepository doctorRepository,
                   PatientRepository patientRepository, DoctorService doctorService, PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public boolean validateToken(String token, String role) {
        try {
            return tokenService.validateToken(token, role);
        } catch (Exception e) {
            return false;
        }
    }

    public ResponseEntity<Map<String, String>> validateAdmin(String username, String password) {
        try {
            Admin admin = adminRepository.findByUsername(username);

            if (admin == null || !admin.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "Invalid username or password."));
            }

            String token = tokenService.generateToken(admin, "admin", username);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Admin login successful.",
                    "token", token,
                    "role", "admin",
                    "username", username
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Login failed due to an internal error."));
        }
    }

    public List<Doctor> filterDoctor(String name, String specialty, String time) {
        System.out.println("Name: " + name);
        System.out.println("Specialty: " + specialty);
        System.out.println("Time: " + time);
        if (name != null && specialty != null && time != null) {
            System.out.println("Filter All");
            return doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
        } else if (name != null && specialty != null) {
            System.out.println("Filter Name and Specialty");
            return doctorService.filterDoctorByNameAndSpecialty(name, specialty);
        } else if (name != null && time != null) {
            System.out.println("Filter Name and Time");
            return doctorService.filterDoctorByNameAndTime(name, time);
        } else if (specialty != null && time != null) {
            System.out.println("Filter Time and Specialty");
            return doctorService.filterDoctorByTimeAndSpecialty(specialty, time);
        } else if (name != null) {
            System.out.println("Filter Name");
            return doctorService.findDoctorByName(name);
        } else if (specialty != null) {
            System.out.println("Filter Specialty");
            return doctorService.filterDoctorBySpecialty(specialty);
        } else if (time != null) {
            System.out.println("Filter Time");
            return doctorService.filterDoctorsByTime(time);
        } else {
            System.out.println("Filter None");
            return doctorService.getDoctors();
        }
    }

    public int validateAppointment(Long doctorId, LocalDate date, LocalTime time) {
        Optional<Doctor> optional = doctorRepository.findById(doctorId);

        if (optional.isEmpty()) {
            return -1;
        }

        List<String> availableSlots = doctorService.getDoctorAvailability(doctorId, java.sql.Date.valueOf(date));
        return availableSlots.stream()
            .anyMatch(slot -> slot.split("-")[0].equals(time.toString())) ? 1 : 0;
    }

    public boolean validatePatient(Patient patient) {
        return patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(String email, String password) {
        try {
            Patient patient = patientRepository.findByEmail(email);

            if (patient == null || !patient.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "Invalid email or password."));
            }

            String token = tokenService.generateToken(patient, "patient", email);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Patient login successful.",
                    "token", token,
                    "role", "patient",
                    "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Login failed due to an internal error."));
        }
    }

    public List<AppointmentDTO> filterPatient(String token, String condition, String doctorName) {
        try {
            String email = tokenService.extractEmailFromToken(token);
            Patient patient = patientRepository.findByEmail(email);

            if (patient == null) {
                return List.of();
            }

            Long patientId = patient.getId();

            if (condition != null && doctorName != null) {
                return patientService.filterByDoctorAndCondition(doctorName, patientId, condition);
            } else if (doctorName != null) {
                return patientService.filterByDoctor(doctorName, patientId);
            } else if (condition != null) {
                return patientService.filterByCondition(patientId, condition);
            } else {
                return patientService.getPatientAppointment(patientId);
            }
        } catch (Exception e) {
            return List.of();
        }
    }
}