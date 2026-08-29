package com.project.back_end.controllers;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "patients")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getPatient(@PathVariable String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        Patient patient = patientService.getPatientDetails(token);

        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Patient not found."));
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "patient", patient
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> createPatient(@RequestBody Patient patient) {
        if (!service.validatePatient(patient)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Patient already exists with given email or phone."));
        }

        int result = patientService.createPatient(patient);

        return switch (result) {
            case 1 -> ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "message", "Patient registered successfully."));
            case 0 -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error saving patient."));
            default -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Unexpected error."));
        };
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
        return service.validatePatientLogin(login.getEmail(), login.getPassword());
    }

    @GetMapping("/appointments/{patientId}/{user}/{token}")
    public ResponseEntity<Map<String, Object>> getPatientAppointments(
            @PathVariable Long patientId,
            @PathVariable String user,
            @PathVariable String token) {

        if (!service.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        if ("patient".equalsIgnoreCase(user)) {
            Long tokenPatientId = service.tokenService.extractPatientIdFromToken(token);

            if (tokenPatientId == null || !tokenPatientId.equals(patientId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("status", "error", "message", "You cannot access another patient's appointments."));
            }
        }

        List<AppointmentDTO> appointments = patientService.getPatientAppointment(patientId);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "appointments", appointments
        ));
    }

    @GetMapping("/appointments/filter")
    public ResponseEntity<Map<String, Object>> filterPatientAppointment(
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String name,
            @RequestParam String token) {

        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        List<AppointmentDTO> appointments = service.filterPatient(token, condition, name);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "appointments", appointments
        ));
    }
}